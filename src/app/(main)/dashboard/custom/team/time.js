export function createDateTime(hour, minute) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function getTimelinePositions(range, width) {
  const positions = [];
  const start = new Date(range.start);
  const end = new Date(range.end);
  const duration = end.getTime() - start.getTime();
  const hourMs = 60 * 60 * 1000;

  for (let time = start.getTime(); time <= end.getTime(); time += hourMs) {
    const date = new Date(time);
    const hour = date.getHours();
    const left = ((time - start.getTime()) / duration) * width;

    positions.push({
      hour,
      label: `${hour === 0 ? "12" : hour > 12 ? hour - 12 : hour}:00${
        hour >= 12 ? "PM" : "AM"
      }`,
      left: `${left}px`,
    });
  }
  return positions;
}

export function calculateProgramPosition(
  program,
  range,
  width
) {
  const start = new Date(program.startTime);
  const end = new Date(program.endTime);
  const rangeStart = range.start;
  const rangeEnd = range.end;
  const rangeDuration = rangeEnd.getTime() - rangeStart.getTime();

  const left = Math.max(
    0,
    ((start.getTime() - rangeStart.getTime()) / rangeDuration) * width
  );
  const right = Math.min(
    width,
    ((end.getTime() - rangeStart.getTime()) / rangeDuration) * width
  );
  const programWidth = right - left;

  return { left: `${left}px`, width: `${programWidth}px` };
}

export function getCurrentTimePosition(range, width) {
  const now = new Date();
  const start = range.start;
  const end = range.end;
  const duration = end.getTime() - start.getTime();
  return ((now.getTime() - start.getTime()) / duration) * width;
}
