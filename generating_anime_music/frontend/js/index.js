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
  document.getElementById('music-player-wrapper').classList.add('music-player');

  addGenerate();
  addPlayPause();
  addSeek();
  document.getElementById('loading').remove();
}

function clear() {
  let play_pause = document.getElementById('play-pause');
  let generate = document.getElementById('generate');
  let seek = document.getElementById('seek');

  document.getElementById('music-player-wrapper').classList.remove('music-player');

  playing = false;

  if (play_pause) play_pause.remove();
  if (generate) generate.remove();
  if (seek) seek.remove();
}

function playPause() {
  play_pause = document.getElementById('play-pause');
  if (playing) {
    playing = false;
    play_pause.title = 'Play';
    play_pause.className = 'play';
    player.pause();
  } else {
    ac.resume();
    playing = true;
    play_pause.title = 'Pause';
    play_pause.className = 'pause';
    player.play();
  }
}

function addPlayPause() {
  let play_pause = document.createElement('button');
  play_pause.id = 'play-pause';

  play_pause.addEventListener('click', (e) => {
    playPause();
  });

  document.getElementById('music-player-wrapper').appendChild(play_pause);
}

function addGenerate() {
  let generate = document.createElement('div');
  generate.id = 'generate';
  generate.className = 'btn';
  generate.innerHTML = 'Generate';
  generate.title = 'Generate an anime song!';

  generate.addEventListener('click', () => {
    clear();
    ac.resume();

    player.load('/generated_song.mid').then(() => {
      loaded();

      main_img.src = '/static/img/enjoy.jpg';
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
  seek.className = 'slider';
  seek.value = 0;

  seek.addEventListener('input', (e) => {
    e.preventDefault();

    if (!playing) playPause();
    let time = 0.25 * Math.ceil(4 * seek.value / 100 * player.duration);
    console.log(time);
    player.seek(time);

    return false;
  });

  seek.addEventListener('keydown', (e) => {
    e.preventDefault();
    return false;
  });

  player.on('timeupdate', (seconds) => {
    seek.value = seconds / player.duration * 100;
    seek.style.backgroundSize = seek.value.toString() + '% 100%';
  });

  document.getElementById('music-player-wrapper').appendChild(seek);
}

player.on('ended', () => {
  playing = false;
  play_pause.title = 'Play';
  play_pause.className = 'play';
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