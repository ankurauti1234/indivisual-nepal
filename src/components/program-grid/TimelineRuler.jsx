import { MINUTES_IN_DAY } from "./EPG";

const TimelineRuler = ({ timeRange }) => {
  const startHour = Math.floor(timeRange[0] / 60);
  const endHour = Math.ceil(timeRange[1] / 60);
  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => startHour + i
  );
  const minutesInRange = timeRange[1] - timeRange[0];
  const pixelsPerMinute = 9600 / minutesInRange;

  const isVeryZoomedIn = pixelsPerMinute > 15;
  const isZoomedIn = pixelsPerMinute > 8;
  const isSlightlyZoomedIn = pixelsPerMinute > 4;

  const formatMinute = (hour, minute) =>
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  return (
    <div className="h-12 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border-y border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
      {hours.map((hour) => {
        const left = (hour * 60 - timeRange[0]) * pixelsPerMinute;
        return (
          <div key={hour} className="absolute" style={{ left: `${left}px` }}>
            <div className="absolute h-12 w-px bg-zinc-300/70 dark:bg-zinc-600/70" />
            <div className="absolute -left-8 top-2 w-16 text-center">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {formatMinute(hour, 0)}
              </span>
            </div>
            {Array.from({ length: 60 }, (_, minute) => {
              const isQuarter = minute % 15 === 0;
              const isFive = minute % 5 === 0;
              const minuteLeft = minute * pixelsPerMinute;

              if (minute === 0) return null;
              if (!isSlightlyZoomedIn && !isQuarter) return null;
              if (!isZoomedIn && !isQuarter && !isFive) return null;

              return (
                <div
                  key={minute}
                  className="absolute"
                  style={{ left: `${minuteLeft}px` }}
                >
                  <div
                    className={`absolute w-px transition-all ${
                      isQuarter
                        ? "h-8 bg-zinc-300/50 dark:bg-zinc-600/50"
                        : isFive
                        ? "h-4 bg-zinc-200/40 dark:bg-zinc-700/40"
                        : isVeryZoomedIn
                        ? "h-2 bg-zinc-200/30 dark:bg-zinc-700/30"
                        : ""
                    }`}
                  />
                  {((isVeryZoomedIn && minute % 1 === 0) ||
                    (isZoomedIn && isFive) ||
                    (isSlightlyZoomedIn && isQuarter)) && (
                    <div className="absolute -left-8 top-2 w-16 text-center">
                      <span
                        className={`text-[10px] text-zinc-500 dark:text-zinc-400 ${
                          isQuarter ? "font-medium" : ""
                        }`}
                      >
                        {formatMinute(hour, minute)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default TimelineRuler;