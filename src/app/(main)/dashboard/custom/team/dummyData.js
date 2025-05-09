// dummyData.js
const genres = ["News", "Entertainment", "Sports"];
const channelNames = [
  "Kantipur TV",
  "Nepal Television",
  "Image Channel",
  "AP1 TV",
  "Avenues TV",
  "News24",
  "ABC Television",
  "Mountain TV",
];
const programNames = [
  "Morning Show",
  "Afternoon News",
  "Evening Talk",
  "Prime Time News",
  "Late Night Show",
  "Sports Highlights",
  "Reality Show",
  "Documentary",
];

// Use a seeded random number generator for consistency
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function getRandomInt(min, max, seed) {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

export function generateDummyData(seed = 123) {
  let currentSeed = seed;

  const channels = channelNames.map((name, idx) => ({
    name,
    genre: genres[getRandomInt(0, genres.length - 1, currentSeed + idx)],
    programs: programNames.map((programName, programIdx) => ({
      name: programName,
      audience: getRandomInt(10000, 100000, currentSeed + idx + programIdx),
    })),
  }));

  const flows = [];
  channels.forEach((fromChannel, fromIdx) => {
    channels.forEach((toChannel, toIdx) => {
      if (
        fromChannel.name !== toChannel.name &&
        fromChannel.genre === toChannel.genre
      ) {
        flows.push({
          from: fromChannel.name,
          to: toChannel.name,
          audience: getRandomInt(1000, 10000, currentSeed + fromIdx + toIdx),
          program:
            fromChannel.programs[
              getRandomInt(
                0,
                fromChannel.programs.length - 1,
                currentSeed + fromIdx + toIdx
              )
            ].name,
        });
      }
    });
  });

  return { channels, flows };
}
