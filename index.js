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

const undoBtn = document.getElementById("btn-undo");
const redoBtn = document.getElementById("btn-redo");

let vidSource;
let totalDuration = 0;
let videoLoaded = false;

// initial resize
onWindowResize();

window.addEventListener("resize", onWindowResize);

playBtn.onclick = onPlayBtnPress;
pauseBtn.onclick = onPlayBtnPress;
isHostDiv.onclick = onIsHostBtnPress;
syncDiv.onclick = onSyncBtnPress;
undoBtn.onclick = () => moveTimerBy(-5);
redoBtn.onclick = () => moveTimerBy(5);

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
  videoLoaded = true;

  onProgressBarClick({ offsetX: 0 });
  const durationText = document.getElementById("duration-text");
  durationText.innerHTML = toHumanTime(vidSource.duration);
}

function onProgressBarClick(event) {
  console.log("onProgressBarClick");
  const percent = event.offsetX / progressBarBase.clientWidth;
  setCurTime(percent * vidSource.duration);
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

function moveTimerBy(delta) {
  if (!videoLoaded) return;

  setCurTime(vidSource.currentTime + delta);
}

async function synchronizer() {
  if (!syncCheckbox.checked || !videoLoaded) return;
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
  console.log("Delta: " + (vidSource.currentTime - time));

  if (delta > RESYNC_THRESHOLD) {
    setCurTime(time);
  }
}

function setCurTime(time) {
  vidSource.currentTime = time;
  updateVideoTime({ forced: true });
}

function updateVideoTime(options) {
  const { forced } = options || {};
  if (!videoLoaded || (vidSource.paused && !forced)) return;
  const curTimeText = document.getElementById("cur-time-text");

  const percent = vidSource.currentTime / vidSource.duration;
  progressBar.style.width = `${percent * 100}%`;
  curTimeText.innerHTML = toHumanTime(vidSource.currentTime);
}

setInterval(synchronizer, 1000);
setInterval(updateVideoTime, 300);
