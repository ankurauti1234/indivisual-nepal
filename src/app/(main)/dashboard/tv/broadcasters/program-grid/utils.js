// Add or update these utility functions

export const formatTime = (date) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const minutesToTime = (minutes) => {
  const date = new Date();
  date.setHours(9, 0, 0, 0); // Start at 9:00:00 AM
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

export const timeToMinutes = (time) => {
  const base = new Date(time);
  base.setHours(9, 0, 0, 0); // Set base to 9:00:00 AM
  return (time.getTime() - base.getTime()) / 60000;
};
