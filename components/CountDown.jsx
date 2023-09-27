import React from "react";
import Countdown from "react-countdown";

export default function CountDownComponent({ targetBlockTime, complete }) {
  const renderer = ({ completed, formatted }) => {
    const { days, hours, minutes, seconds } = formatted;
    if (completed) {
      // Render a completed state
      complete(true);
      return true;
    }
    // Render a countdown
    return (
      <>
        <div className="time-container">
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
        <div className="w-10 h-[60px]" />
      )}
    </div>
  );
}
