import { twMerge } from "tailwind-merge";
import React from "react";

// Radar spins: rotate(20deg) → rotate(380deg) in 10s, linear.
// For each icon at CSS hit angle θ:
//   hitTime = (θ - 20) / 36   [seconds into cycle]
//   animationDelay = -(10 - hitTime)s  → first ping fires exactly at hitTime
//
// CSS sweep direction at angle θ: (-cos θ, sin θ) in screen-y-down coords.
// θ = atan2(dy, -dx)  where (dx,dy) = icon pos relative to radar center.

export const Circle = ({ className, idx, ...rest }: any) => (
  <div
    {...rest}
    className={twMerge(
      "absolute inset-0 left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full",
      className
    )}
  />
);

export const Radar = ({ className }: { className?: string }) => {
  const circles = new Array(8).fill(1);
  return (
    <div
      className={twMerge(
        "relative flex h-20 w-20 items-center justify-center rounded-full",
        className
      )}
    >
      <style>{`
        @keyframes radar-spin {
          from { transform: rotate(20deg); }
          to   { transform: rotate(380deg); }
        }
        .animate-radar-spin {
          animation: radar-spin 10s linear infinite;
        }

        /* Icon ping: nearly invisible → red flash → fade back */
        @keyframes radarPing {
          0%   { opacity: 1;    box-shadow: 0 0 18px rgba(239,68,68,0.7), 0 0 6px rgba(239,68,68,0.4); border-color: rgba(239,68,68,0.7); }
          4%   { opacity: 0.75; box-shadow: 0 0 8px rgba(239,68,68,0.25); border-color: rgba(239,68,68,0.3); }
          18%  { opacity: 0.13; box-shadow: none; border-color: rgba(55,65,81,0.8); }
          100% { opacity: 0.13; box-shadow: none; border-color: rgba(55,65,81,0.8); }
        }
        .radar-ping-box {
          animation: radarPing 10s linear infinite;
          opacity: 0.13;
          border: 1px solid rgba(55,65,81,0.8);
        }
      `}</style>

      {/* Rotating sweep line */}
      <div
        style={{ transformOrigin: "right center" }}
        className="animate-radar-spin absolute right-1/2 top-1/2 z-40 flex h-[5px] w-[400px] items-end justify-center overflow-hidden bg-transparent"
      >
        <div className="relative z-40 h-[1px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      </div>

      {/* Concentric circles */}
      {circles.map((_, idx) => (
        <Circle
          style={{
            height: `${(idx + 1) * 5}rem`,
            width: `${(idx + 1) * 5}rem`,
            border: `1px solid rgba(239, 68, 68, ${Math.max(0.025, 0.16 - idx * 0.02)})`,
          }}
          key={`circle-${idx}`}
          idx={idx}
        />
      ))}
    </div>
  );
};

export const IconContainer = ({
  icon,
  text,
  hitTime,
}: {
  icon?: React.ReactNode;
  text?: string;
  /** Seconds into the 10s radar cycle when the sweep hits this icon (0–10). */
  hitTime: number;
}) => {
  // Negative delay so the first ping fires at exactly hitTime seconds after mount.
  const delay = -(10 - hitTime);

  return (
    <div className="relative z-50 flex flex-col items-center justify-center space-y-2">
      <div
        className="radar-ping-box flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900/80"
        style={{ animationDelay: `${delay}s` }}
      >
        {icon}
      </div>
      <div className="hidden px-2 py-1 md:block">
        <div className="text-center text-xs font-bold text-gray-600">
          {text}
        </div>
      </div>
    </div>
  );
};
