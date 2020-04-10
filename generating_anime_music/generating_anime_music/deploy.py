from keras.models import load_model
from keras.utils import to_categorical
from keras.backend import set_session

import tensorflow as tf

from music21 import instrument, note, chord, stream

import pickle
import numpy as np

# implementation based on https://towardsdatascience.com/how-to-generate-music-using-a-lstm-neural-network-in-keras-68786834d4c5

# store graph session to prevent losing information
sess = tf.Session()
graph = tf.get_default_graph()
set_session(sess)
model = load_model('static/model.hdf5')
model.summary()


def generate_dataset():
    """datas preprocessing based on a list of song objects, each song object contains song's name and a sequence of notes"""
    songs = pickle.load(open("static/songs.p", "rb"))

    # get a list of all notes in all songs
    notes = []
    for song in songs:
        notes += song["notes"]

    # n_vocab is the number of unique netes
    n_vocab = len(set(notes))

    # length of input sequence to LSTM network
    sequence_length = 100
    # get all pitch names
    pitchnames = sorted(set(item for item in notes))
    # create a dictionary to map pitches to integers
    note_to_int = dict((note, number)
                       for number, note in enumerate(pitchnames))
    int_to_note = dict((number, note)
                       for number, note in enumerate(pitchnames))

    network_input = []
    network_output = []
    # create input sequences and the corresponding outputs
    for song in songs:
        print("Loading", song["name"])
        notes = song["notes"]

        for i in range(0, len(notes) - sequence_length, 1):
            sequence_in = notes[i: i + sequence_length]
            sequence_out = notes[i + sequence_length]
            network_input.append([note_to_int[char] for char in sequence_in])
            network_output.append(note_to_int[sequence_out])

    n_patterns = len(network_input)
    # reshape the input into a format compatible with LSTM layers
    network_input = np.reshape(network_input, (n_patterns, sequence_length, 1))
    # normalize input
    network_input = network_input / float(n_vocab)
    network_output = to_categorical(network_output)

    return (n_vocab, int_to_note, network_input, network_output)


(n_vocab, int_to_note, network_input, _) = generate_dataset()


def generate_notes():
    """ Generate notes from the neural network based on a sequence of notes """

    # pick a random sequence from the input as a starting point for the prediction
    start = np.random.randint(0, len(network_input) - 1)

    pattern = network_input[start]
    prediction_output = []

    # generate 500 notes
    for i in range(500):
        prediction_input = np.reshape(pattern, (1, len(pattern), 1))
        prediction_input = prediction_input / float(n_vocab)

        with graph.as_default():
            set_session(sess)
            prediction = model.predict(prediction_input, verbose=0)

        # random choose from a distribution
        index = np.random.choice(n_vocab, 1, p=prediction[0])[0]
        # index = np.argmax(prediction)
        result = int_to_note[index]
        prediction_output.append(result)

        print(result)

        pattern = np.append(pattern, index)
        pattern = pattern[1: len(pattern)]

    return prediction_output


def create_midi(prediction_output, filename):
    """ convert the output from the prediction to notes and create a midi file
        from the notes """
    offset = 0
    output_notes = []

    # create note and chord objects based on the values generated by the model
    for pattern in prediction_output:
        # pattern is a chord
        if ('.' in pattern) or pattern.isdigit():
            notes_in_chord = pattern.split('.')
            notes = []
            for current_note in notes_in_chord:
                new_note = note.Note(int(current_note))
                new_note.storedInstrument = instrument.Piano()
                notes.append(new_note)
            new_chord = chord.Chord(notes)
            new_chord.offset = offset
            output_notes.append(new_chord)
        # pattern is a note
        else:
            new_note = note.Note(pattern)
            new_note.offset = offset
            new_note.storedInstrument = instrument.Piano()
            output_notes.append(new_note)
        # increase offset each iteration so that notes do not stack
        offset += 0.5

    midi_stream = stream.Stream(output_notes)
    midi_stream.write('midi', fp='{}.mid'.format(filename))


def generate_song():
    prediction_output = generate_notes()
    create_midi(prediction_output, 'generated_song')
