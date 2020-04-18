let Timidity = require('timidity');

const player = new Timidity('static');

let ac;
let playing;
let main_img = document.getElementById('main-img');

function loading() {
  let loading_message = document.createElement('div');
  loading_message.id= 'loading';
  loading_message.innerHTML = 'Generating';
  document.getElementById('log-wrapper').appendChild(loading_message);
}

function loaded() {
  addGenerate();
  addPlayPause();
  addSeek();
  document.getElementById('loading').remove();
}

function clear() {
  let play_pause = document.getElementById('play-pause');
  let generate = document.getElementById('generate');
  let seek = document.getElementById('seek');

  playing = false;

  if (play_pause) play_pause.remove();
  if (generate) generate.remove();
  if (seek) seek.remove();
}

function playPause() {
  play_pause = document.getElementById('play-pause');
  if (playing) {
    playing = false;
    play_pause.innerHTML = 'Play';
    player.pause();
  } else {
    ac.resume();
    playing = true;
    play_pause.innerHTML = 'Pause';
    player.play();
  }
}

function addPlayPause() {
  let play_pause = document.createElement('div');
  play_pause.id = 'play-pause';
  play_pause.className = 'btn';

  play_pause.addEventListener('click', (e) => {
    playPause();
  });

  document.getElementById('btn-wrapper').appendChild(play_pause);
}

function addGenerate() {
  let generate = document.createElement('div');
  generate.id = 'generate';
  generate.className = 'btn';
  generate.innerHTML = 'Generate';

  generate.addEventListener('click', () => {
    clear();
    ac.resume();

    player.load('/generated_song.mid').then(() => {
      loaded();

      main_img.src = '/static/img/enjoy_2.jpg';
      main_img.alt = 'Please enjoy!';

      playPause();
    });
  }, { once: true });  

  document.getElementById('btn-wrapper').appendChild(generate);
}

function addSeek() {
  let seek = document.createElement('input');
  seek.type = 'range';
  seek.id = 'seek';
  seek.value = 0;

  seek.addEventListener('input', () => {
    if (!playing) playPause();
    player.seek(seek.value / 100 * player.duration);
  });

  player.on('timeupdate', (seconds) => {
    seek.value = seconds / player.duration * 100;
  });

  document.getElementById('music-player-wrapper').appendChild(seek);
}

player.on('ended', () => {
  playing = false;
  document.getElementById('play-pause').innerHTML = 'Play';
});

player.on('error', (err) => {
  console.log(err);
});

player.on('buffering', () => {
  loading();

  main_img.src = '/static/img/loading.gif';
  main_img.alt = 'Generating';
});

window.onload = () => {
  ac = new AudioContext();

  main_img.src = '/static/img/welcome.jpg';
  main_img.alt = 'Welcome to Anime Music Generator';

  addGenerate();
}