let Soundfont = require('soundfont-player');
let playing = false;
let btn = document.getElementById('play-stop');

let getJSON = function(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      let status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

window.onload = () => {
  let ac = new AudioContext();
  btn.disabled = true;
  
  Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
      document.getElementById('generate').addEventListener('click', () => {
          ac.resume();

          fetch('midi_events.json')
              .then(res => res.json())
              .then((data) => {
                  console.log(data.midi_events);
                  btn.disabled = false;
                  playing = true;
                  btn.innerHTML = 'Stop';

                  console.log(piano.schedule(ac.currentTime, data.midi_events));
              });
      });

      document.getElementById('play-stop').addEventListener('click', () => {
        if (playing) {
          piano.stop();
          playing = false;
          btn.innerHTML = 'Play';
        } else {
          ac.resume();
          piano.play();
          playing = true;
          btn,innerHTML = 'Stop';
        }
      });
  });
}