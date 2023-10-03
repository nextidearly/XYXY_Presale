import React from "react";
import Countdown from "react-countdown";

export default function CountDownComponent({
  targetBlockTime,
  start,
  started,
}) {
  const renderer = ({ completed, formatted }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed && start) {
      started(true);
      return true;
    }
    return (
      <>
        <div>
          <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
          <span>{seconds}</span>
        </div>
      </>
    );
  };
  return (
    <div className="text-[20px] mb-[10px]">
      {targetBlockTime ? (
        <Countdown date={targetBlockTime} renderer={renderer} />
      ) : (
        <>
          <div>
            <span>...</span>
          </div>
        </>
      )}
    </div>
  );
}
