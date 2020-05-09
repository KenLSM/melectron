const SERVER_URL =
  "http://ec2-13-229-249-179.ap-southeast-1.compute.amazonaws.com:3000";
const INFLATION = 1000;
function updateTime2Server(hostingKey, time, state) {
  fetch(`${SERVER_URL}/${hostingKey}/${timeInflate(time)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });
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
