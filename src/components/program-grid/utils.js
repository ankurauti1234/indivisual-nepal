
export const timeToMinutes = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
};

export const timeToSeconds = (time) => {
  const [hh, mm, ss] = time.split(":").map(Number);
  return hh * 3600 + mm * 60 + ss;
};

export const secondsToTime = (seconds) => {
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export const getUniqueRegions = (data) => [
  ...new Set(data.map((item) => item.region).filter(Boolean)),
];

export const getUniqueChannels = (data) => [
  ...new Set(data.map((item) => item.channel)),
];

export const getUniqueContentTypes = (data) => [
  ...new Set(data.map((item) => item.type)),
];

export const getDatesWithData = (availableData) =>
  [
    ...new Set(
      Object.values(availableData).flatMap((station) => station.dates)
    ),
  ].sort();

export const findNearestDateWithData = (currentDate, datesWithData) => {
  const current = new Date(currentDate);
  let nearestDate = null;
  let minDiff = Infinity;

  datesWithData.forEach((date) => {
    const diff = Math.abs(new Date(date) - current);
    if (diff < minDiff) {
      minDiff = diff;
      nearestDate = date;
    }
  });

  return nearestDate;
};

export const formatTimeForURL = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:00`;
};

export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};