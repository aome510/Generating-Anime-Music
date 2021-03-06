let Timidity = require("timidity");

let player;

let ac;
let playing;
let main_img = document.getElementById("main-img");

const log_classes =
  "text-center rounded border-4 border-solid bg-white border-black text-3xl select-none my-1 py-1";
const music_player_classes =
  "music-player h-12 w-full rounded flex items-center my-1";
const button_classes =
  "bg-green-500 text-center text-xl text-white px-12 py-4 cursor-pointer select-none my-1";
const seek_classes =
  "slider w-11/12 ml-3 mr-5 rounded-lg h-3 transition-opacity outline-none appearance-none";

function loading() {
  let log = document.getElementById('log-message');
  if (log) log.remove();

  let loading_message = document.createElement("div");
  loading_message.id = "loading";
  loading_message.innerHTML = "Generating";

  loading_message.className = log_classes;

  main_img.src = "/static/loading.gif";
  main_img.alt = "Generating";

  document.getElementById("log-wrapper").appendChild(loading_message);
}

function loaded() {
  // console.log(player.duration);

  document.getElementById("music-player").className = music_player_classes;

  addGenerate();
  addPlayPause();
  addSeek();
  document.getElementById("loading").remove();
}

function clear() {
  let play_pause = document.getElementById("play-pause");
  let generate = document.getElementById("generate");
  let seek = document.getElementById("seek");

  document.getElementById("music-player").className = "";

  if (playing) {
    playing = false;
    player.pause();
  }

  if (play_pause) play_pause.remove();
  if (generate) generate.remove();
  if (seek) seek.remove();
}

function playPause() {
  play_pause = document.getElementById("play-pause");
  if (playing) {
    playing = false;
    play_pause.title = "Play";
    play_pause.className = "play";
    player.pause();
  } else {
    ac.resume();
    playing = true;
    play_pause.title = "Pause";
    play_pause.className = "pause";
    player.play();
  }
}

function addPlayPause() {
  let play_pause = document.createElement("button");
  play_pause.id = "play-pause";

  play_pause.addEventListener("click", (e) => {
    playPause();
  });

  document.getElementById("music-player").appendChild(play_pause);
}

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("promise timeout"))
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}

function addLog(message) {
  let log = document.createElement('div');
  log.innerHTML = message;
  log.className = log_classes;
  log.id = 'log-message';

  main_img.src = "/static/confused.jpg";
  main_img.alt = "Something went wrong";

  document.getElementById('log-wrapper').appendChild(log);
}

function addGenerate() {
  let generate = document.createElement("div");
  generate.id = "generate";
  generate.innerHTML = "Generate";
  generate.title = "Generate an anime song!";

  generate.className = button_classes;

  generate.addEventListener(
    "click",
    () => {
      clear();
      loading();

      timeoutPromise(30000, fetch("midi_binary_data.json"))
        .then(response => response.json())
        .then(data => {
          player.load(new Uint8Array(data["data"])).then(() => {
            loaded();

            main_img.src = "/static/enjoy.jpg";
            main_img.alt = "Please enjoy!";

            playPause();
          });
        }).catch((err) => {
          document.getElementById('loading').remove();

          addLog('Request time out!<br>Please try to generate again.');
          addGenerate();
        })
    },
    { once: true }
  );

  document.getElementById("btn-wrapper").appendChild(generate);
}

function addSeek() {
  let seek = document.createElement("input");
  seek.type = "range";
  seek.id = "seek";
  seek.className = seek_classes;
  seek.value = 0;

  seek.addEventListener("input", (e) => {
    e.preventDefault();

    let time = 0.25 * Math.ceil(((4 * seek.value) / 100) * player.duration);
    // console.log(time);
    player.seek(time);
    if (!playing) playPause();

    return false;
  });

  seek.addEventListener("keydown", (e) => {
    e.preventDefault();
    return false;
  });

  player.on("timeupdate", (seconds) => {
    seek.value = (seconds / player.duration) * 100;
    seek.style.backgroundSize = seek.value.toString() + "% 100%";
  });

  document.getElementById("music-player").appendChild(seek);
}

window.onload = () => {
  ac = new AudioContext();
  player = new Timidity('static');

  player.on("ended", () => {
    playing = false;
    play_pause.title = "Play";
    play_pause.className = "play";
  });

  player.on("error", (err) => {
    console.warn(err);
  });

  web_favicon = document.createElement("link");
  web_favicon.rel = "shortcut icon";
  web_favicon.href = "static/favicon.ico"

  document.getElementsByTagName("head")[0].appendChild(web_favicon);
  document.getElementsByTagName("body")[0].style["background-image"] = "url(/static/background.jpg)";

  main_img.src = "/static/welcome.jpg";
  main_img.alt = "Welcome to Anime Music Generator";

  addGenerate();
};
