import { useEffect } from "react";
import { formatTime } from "../utils/helpers";
import "./css/TestTimer.css";

function TestTimer({ timeLeft, onTimeUpdate, onTimeUp }) {
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => onTimeUpdate(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUpdate, onTimeUp]);

  return (
    <div className="test-timer">
      <span className="timer-icon">⏱️</span>
      <span className="timer-text">{formatTime(timeLeft)}</span>
    </div>
  );
}

export default TestTimer;
