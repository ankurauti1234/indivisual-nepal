export const channels = ["Channel A", "Channel B", "Channel C"];


export const channelColors = {
  "Channel A": "bg-blue-500 border-blue-600",
  "Channel B": "bg-purple-500 border-purple-600",
  "Channel C": "bg-orange-500 border-orange-600",
  "Channel B": "bg-red-500 border-red-600",
  "Channel C": "bg-green-500 border-green-600",
};

export const channelLightColors = {
  "Channel A": "bg-blue-100",
  "Channel B": "bg-purple-100",
  "Channel C": "bg-orange-100",
  "Channel B": "bg-red-100",
  "Channel C": "bg-green-100",
};

export const personas = [
  { id: 1, name: "Alice", type: "Parent" },
  { id: 2, name: "Bob", type: "Elder" },
  { id: 3, name: "Charlie", type: "Teenager" },
  { id: 4, name: "Diana", type: "Child" },
  { id: 5, name: "Eve", type: "Young Professional" },
];

export const channelPresence = {
  1: [
    { channel: "Channel A", start: "06:30", end: "11:15" }, // Morning news
    { channel: "Channel B", start: "11:35", end: "14:45" }, // Breakfast show
    { channel: "Channel C", start: "18:30", end: "19:00" }, // Kids' program with children
    { channel: "Channel A", start: "19:30", end: "20:15" }, // Evening drama
    { channel: "Channel D", start: "21:30", end: "22:00" }, // Late-night talk show
  ],
  2: [
    { channel: "Channel B", start: "05:00", end: "06:00" }, // Early morning devotional
    { channel: "Channel C", start: "10:30", end: "11:15" }, // Nature documentaries
    { channel: "Channel E", start: "14:00", end: "15:30" }, // Classic movie
    { channel: "Channel A", start: "16:30", end: "17:15" }, // Evening news
    { channel: "Channel D", start: "20:00", end: "21:00" }, // Prime-time show
  ],
  3: [
    { channel: "Channel C", start: "08:00", end: "08:30" }, // Morning cartoons
    { channel: "Channel E", start: "15:00", end: "15:45" }, // Sports highlights
    { channel: "Channel D", start: "16:00", end: "17:00" }, // Teen drama
    { channel: "Channel B", start: "19:00", end: "19:30" }, // Social media trends
    { channel: "Channel C", start: "21:00", end: "22:00" }, // Anime series
  ],
  4: [
    { channel: "Channel C", start: "07:00", end: "07:45" }, // Morning cartoons
    { channel: "Channel A", start: "10:00", end: "10:30" }, // Educational programming
    { channel: "Channel C", start: "14:30", end: "15:00" }, // Afternoon cartoons
    { channel: "Channel E", start: "17:00", end: "17:30" }, // Kids' quiz show
    { channel: "Channel B", start: "19:00", end: "19:15" }, // Quick kids' news
  ],
  5: [
    { channel: "Channel A", start: "06:45", end: "07:15" }, // Morning news
    { channel: "Channel D", start: "12:15", end: "12:45" }, // Midday entertainment
    { channel: "Channel E", start: "18:00", end: "18:30" }, // Sports highlights
    { channel: "Channel B", start: "20:30", end: "21:15" }, // Prime-time talk show
    { channel: "Channel C", start: "22:00", end: "23:00" }, // Late-night movie
  ],
};



export const getChannelIndex = (channel) => channels.indexOf(channel);

export const getTimePosition = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours + minutes / 60) / 24;
};

export const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};
