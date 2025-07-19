"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";

type AnimatedNumberProps = {
  value: number;
  className?: string;
};

export default function AnimatedNumber({
  value,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const from = previousValue.current;
    const to = value;
    const duration = 0.25;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.round(from + (to - from) * easedProgress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    previousValue.current = value;
  }, [value]);

  return (
    <span ref={scope} className={className}>
      Rp. {displayValue.toLocaleString("id-ID")}
    </span>
  );
}
