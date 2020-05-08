const URL = window.URL;

const main = document.getElementById("main");

const input = document.getElementById("vid-input");
const progressBar = document.getElementById("progress-bar-active");
const progressBarBase = document.getElementById("progress-bar-base");
const playBtn = document.getElementById("btn-play");
const pauseBtn = document.getElementById("btn-pause");
const fullscreenBtn = document.getElementById("btn-expand");
const exitFullscreenBtn = document.getElementById("btn-compress");
const isHostDiv = document.getElementById("is-host-div");
const isHostCheckbox = document.getElementById("is-host-cb");
const syncDiv = document.getElementById("sync-div");
const syncCheckbox = document.getElementById("sync-cb");
let vidSource;
let totalDuration = 0;

onWindowResize();
window.addEventListener("resize", onWindowResize);

playBtn.onclick = onPlayBtnPress;
pauseBtn.onclick = onPlayBtnPress;
isHostDiv.onclick = onIsHostBtnPress;
syncDiv.onclick = onSyncBtnPress;

progressBarBase.onmousedown = () => {
  progressBarBase.onmousemove = onProgressBarClick;
};
progressBarBase.onmouseup = () => {
  progressBarBase.onmousemove = null;
};
progressBarBase.onclick = onProgressBarClick;
input.addEventListener("change", handleVideoInput);
fullscreenBtn.onclick = onFullscreenBtnPress;
exitFullscreenBtn.onclick = exitFullscreenBtnPress;

function onFullscreenBtnPress() {
  main.webkitRequestFullscreen();
  exitFullscreenBtn.style.display = null;
  fullscreenBtn.style.display = "none";
}

function exitFullscreenBtnPress() {
  document.webkitCancelFullScreen();
  fullscreenBtn.style.display = null;
  exitFullscreenBtn.style.display = "none";
}

function onWindowResize() {
  main.style.height = `${window.innerWidth * 0.5625}px`;
}

function handleVideoInput(event) {
  const file = input.files[0];
  const fileUrl = URL.createObjectURL(file);

  vidSource = document.getElementById("vid-source");
  vidSource.src = fileUrl;
  vidSource.onloadedmetadata = () => onVideoLoaded(vidSource);
}

function onVideoLoaded(vidSource) {
  console.log("onVideoLoaded");
  progressBar.style.width = "10%";
  onProgressBarClick({ offsetX: 0 });
}

function onProgressBarClick(event) {
  console.log("onProgressBarClick");
  const percent = event.offsetX / progressBarBase.clientWidth;
  vidSource.currentTime = percent * vidSource.duration;
  progressBar.style.width = `${percent * 100}%`;
}
function onPlayBtnPress() {
  if (vidSource.paused) {
    vidSource.play();
    pauseBtn.style.display = null;
    playBtn.style.display = "none";
    return;
  }
  vidSource.pause();
  playBtn.style.display = null;
  pauseBtn.style.display = "none";
}
function onIsHostBtnPress() {
  isHostCheckbox.checked = !isHostCheckbox.checked;
}
function onSyncBtnPress() {
  syncCheckbox.checked = !syncCheckbox.checked;
}

async function synchronizer() {
  if (!syncCheckbox.checked) return;
  const isHost = isHostCheckbox.checked;
  const hostKey = document.getElementById("host-key-input").value;
  if (isHost) {
    updateTime2Server(hostKey, vidSource.currentTime);
    return;
  }

  const data = await getDataFromServer(hostKey);
  console.log(data);
  syncTime(timeDeflate(data.time));
}

function syncTime(time) {
  const delta = Math.abs(vidSource.currentTime - time);
  console.log(vidSource.currentTime - time);
  console.log(delta);

  if (delta > RESYNC_THRESHOLD) {
    vidSource.currentTime = time;
  }
}

setInterval(synchronizer, 1000);
