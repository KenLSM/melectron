function toHumanTime(seconds) {
  const date = new Date(seconds * 1000);
  let hh = date.getUTCHours();
  let mm = date.getUTCMinutes();
  let ss = date.getSeconds();
  if (hh < 10 && hh > 0) {
    hh = "0" + hh;
  }
  if (mm < 10 && hh > 0) {
    mm = "0" + mm;
  }
  if (ss < 10) {
    ss = "0" + ss;
  }
  if (hh > 0) {
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}
