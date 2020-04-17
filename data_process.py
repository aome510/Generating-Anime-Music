from music21 import converter, instrument, note, chord
import glob
import pickle
import os

# implementation based on https://towardsdatascience.com/how-to-generate-music-using-a-lstm-neural-network-in-keras-68786834d4c5


def get_songs():
    songs = []

    for file in glob.glob("data/*.mid"):
        print("Parsing", file)

        try:
            notes = []
            name = os.path.splitext(os.path.basename(file))[0]

            midi = converter.parse(file)
            notes_to_parse = None

            parts = instrument.partitionByInstrument(midi)
            if parts:  # file has instrument parts
                notes_to_parse = parts.parts[0].recurse()
            else:  # file has notes in a flat structure
                notes_to_parse = midi.flat.notes

            for element in notes_to_parse:
                if isinstance(element, note.Note):
                    notes.append(str(element.pitch))
                elif isinstance(element, chord.Chord):
                    notes.append('.'.join(str(n) for n in element.normalOrder))

            songs.append({"name": name, "notes": notes})
        except Exception as err:
            print("Parsing Failed", file)
            print("Error:", err)

    pickle.dump(songs, open("songs.p", "wb"))
    return songs


def load_songs():
    songs = pickle.load(open("songs.p", "rb"))

    for song in songs:
        print("Load", song["name"])
        print("First 10 notes:", song["notes"][:10])


if __name__ == "__main__":
    # get_songs()
    load_songs()
