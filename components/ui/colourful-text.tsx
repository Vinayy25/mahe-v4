"use client";
import React from "react";
import { motion } from "motion/react";

export default function ColourfulText({ text }: { text: string }) {
  const colors = [
    "rgb(255, 215, 0)", // Gold metallic
    "rgb(249, 129, 47)", // Warm orange
    "rgb(255, 140, 0)", // Dark orange
    "rgb(251, 191, 36)", // Golden yellow
    "rgb(255, 165, 0)", // Orange
    "rgb(255, 159, 67)", // Light orange
    "rgb(255, 193, 7)", // Bright gold
    "rgb(245, 158, 11)", // Amber
    "rgb(255, 183, 77)", // Peach gold
    "rgb(255, 206, 84)", // Light gold
    "rgb(251, 146, 60)", // Orange amber
    "rgb(217, 119, 6)", // Deep amber
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${count}-${index}`}
          initial={{
            y: 0,
          }}
          animate={{
            color: currentColors[index % currentColors.length],
            y: [0, -3, 0],
            scale: [1, 1.02, 1],
            filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
            opacity: [1, 0.9, 1],
            textShadow: [
              `0 0 10px ${currentColors[index % currentColors.length]}40`,
              `0 0 20px ${currentColors[index % currentColors.length]}60`,
              `0 0 10px ${currentColors[index % currentColors.length]}40`,
            ],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
          }}
          className="inline-block whitespace-pre font-sans tracking-tight font-bold bg-clip-text"
          style={{
            textShadow: `0 1px 3px rgba(0,0,0,0.3), 0 0 20px ${currentColors[index % currentColors.length]}30`,
            fontWeight: "700",
          }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}
