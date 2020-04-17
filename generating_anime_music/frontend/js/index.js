let Timidity = require('timidity');

const player = new Timidity('static');

let ac;
let playing;
let play_pause_btn = document.getElementById('play-pause');
let log = document.getElementById('log');
let main_img = document.getElementById('main-img');

player.on('ended', () => {
  playing = false;
  play_pause_btn.innerHTML = 'Play';
});

function clear() {
  if (playing) {
    playing = false;
    play_pause_btn.innerHTML = 'Play';
  }
  play_pause_btn.disabled = true;
}

player.on('error', (err) => {
  console.log(err);
});

player.on('buffering', () => {
  log.innerHTML = 'Generating...';
  main_img.src = '/static/img/loading.gif';
  main_img.alt = 'Generating';
}); 

play_pause_btn.addEventListener('click', () => {
  if (playing) {
    playing = false;
    play_pause_btn.innerHTML = 'Play';
    player.pause();
  } else {
    ac.resume();
    playing = true;
    play_pause_btn.innerHTML = 'Pause';
    player.play();
  }
});

window.onload = () => {
  clear();
  ac = new AudioContext();

  main_img.src = '/static/img/welcome.jpg';
  main_img.alt = 'Welcome to Anime Music Generator';

  document.getElementById('generate').addEventListener('click', () => {
    clear();
    ac.resume();

    player.load('/generated_song.mid').then(() => {
      playing = true;
      play_pause_btn.innerHTML = 'Pause';
      play_pause_btn.disabled = false;

      main_img.src = '/static/img/enjoy.png';
      main_img.alt = 'Please enjoy!';

      log.innerHTML = '';

      player.play();
    });
  });
}