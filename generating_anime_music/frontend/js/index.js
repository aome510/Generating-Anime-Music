let Timidity = require('timidity');

const player = new Timidity('static');

let playing = false;
let btn = document.getElementById('play-stop');

player.on('eneded', () => {
  playing = false;
  btn.innerHTML = 'Play';
});

player.on('playing', () => {
  console.log(player.currentTime);
});

window.onload = () => {
  let ac = new AudioContext();
  btn.disabled = true;

  document.getElementById('generate').addEventListener('click', () => {
    player.load('/generated_song.mid').then(() => {
      playing = true;
      btn.innerHTML = 'Stop';
      btn.disabled = false;

      player.play();
    });

    document.getElementById('play-stop').addEventListener('click', () => {
      if (playing) {
        playing = false;
        btn.innerHTML = 'Play';
        player.pause();
      } else {
        ac.resume();
        playing = true;
        btn.innerHTML = 'Stop';
        player.play();
      }
    });
  });
}