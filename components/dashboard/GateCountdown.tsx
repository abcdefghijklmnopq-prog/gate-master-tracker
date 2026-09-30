"use client";

import { useSyncExternalStore } from "react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const GATE_EXAM_DATE = new Date(
  "2027-02-07T09:30:00+05:30",
).getTime();

function calculateCountdown(timestamp: number): Countdown {
  const difference = GATE_EXAM_DATE - timestamp;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / (60 * 60 * 24)),
    hours: Math.floor(
      (totalSeconds % (60 * 60 * 24)) / (60 * 60),
    ),
    minutes: Math.floor(
      (totalSeconds % (60 * 60)) / 60,
    ),
    seconds: totalSeconds % 60,
  };
}

function getCurrentSecond() {
  return Math.floor(Date.now() / 1000);
}

function subscribe(callback: () => void) {
  const interval = window.setInterval(callback, 1000);

  return () => {
    window.clearInterval(interval);
  };
}

function getServerSnapshot() {
  return 0;
}

export default function GateCountdown() {
  const currentSecond = useSyncExternalStore(
    subscribe,
    getCurrentSecond,
    getServerSnapshot,
  );

  const countdown =
    currentSecond === 0
      ? null
      : calculateCountdown(currentSecond * 1000);

  const countdownItems = countdown
    ? [
        [countdown.days, "Days"],
        [countdown.hours, "Hours"],
        [countdown.minutes, "Minutes"],
        [countdown.seconds, "Seconds"],
      ]
    : [
        ["--", "Days"],
        ["--", "Hours"],
        ["--", "Minutes"],
        ["--", "Seconds"],
      ];

  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
      <p className="text-sm font-medium text-slate-400">
        GATE 2027 Countdown
      </p>

      <h3 className="mt-3 text-3xl font-bold">
        Keep Preparing
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Time remaining until the GATE 2027 examination.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {countdownItems.map(([value, label]) => (
          <div
            key={label}
            className="rounded-xl bg-white/10 p-3 text-center"
          >
            <p className="text-xl font-bold tabular-nums">
              {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}