const SERVER_URL = "http://localhost:3000";
const INFLATION = 1000;
function updateTime2Server(hostingKey, time) {
  fetch(`${SERVER_URL}/${hostingKey}/${timeInflate(time)}`);
}
async function getDataFromServer(hostingKey) {
  return await fetch(`${SERVER_URL}/${hostingKey}`).then((d) => d.json());
}

function timeInflate(time) {
  return (time * INFLATION) | 0;
}

function timeDeflate(time) {
  return (time / INFLATION) | 0;
}
