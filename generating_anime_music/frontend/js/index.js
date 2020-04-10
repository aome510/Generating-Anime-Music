var JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
require('jzz-synth-tiny')(JZZ);

const URL = 'generated_song.mid';

var log = document.getElementById('log');
var btn = document.getElementById('btn');

btn.disabled = true

function report(s) { return function() { log.innerHTML = s; }; }

JZZ.synth.Tiny.register('Web Audio');
var out = JZZ().or(report('Cannot start MIDI engine!')).openMidiOut().or(report('Cannot open MIDI Out!'));
var player;
var playing = false;

function clear() {
  if (player) player.stop();
  playing = false;
  log.innerHTML = 'please wait...';
  btn.innerHTML = 'Play';
  btn.disabled = true;
}

function load(data, name) {
  try {
    player = JZZ.MIDI.SMF(data).player();
    player.connect(out);
    player.onEnd = function() {
      playing = false;
      btn.innerHTML = 'Play';
    }
    playing = true;
    player.play();
    log.innerHTML = '';
    btn.innerHTML = 'Stop';
    btn.disabled = false;
  }
  catch (e) {
    log.innerHTML = e;
  }
}

btn.addEventListener('click', () => {
  if (playing) {
    player.stop();
    playing = false;
    btn.innerHTML = 'Play';
  }
  else {
    player.play();
    playing = true;
    btn.innerHTML = 'Stop';
  }
})

function fromURL(url) {
    clear();
    try {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            var r, i;
            var data = '';
            r = xhttp.response;
            if (r instanceof ArrayBuffer) {
              r = new Uint8Array(r);
              for (i = 0; i < r.length; i++) data += String.fromCharCode(r[i]);
            }
            else { // for really antique browsers
              r = xhttp.responseText;
              for (i = 0; i < r.length; i++) data += String.fromCharCode(r.charCodeAt(i) & 0xff);
            }
            load(data, url);
          }
          else {
            log.innerHTML = 'XMLHttpRequest error';
          }
        }
      };
      try { xhttp.responseType = 'arraybuffer'; } catch (e) {}
      xhttp.overrideMimeType('text/plain; charset=x-user-defined');
      xhttp.open('GET', url, true);
      xhttp.send()
    }
    catch (e) {
      log.innerHTML = 'XMLHttpRequest error';
    }
}

document.getElementById('generate').addEventListener('click', function playMusic() {
    fromURL(URL);
})