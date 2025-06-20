import React from "react";
import "./SplitText.css"; // Hier kommt das CSS, das du gleich erstellst

export default function SplitText({ text }) {
  return (
    <h2 className="split-text">
      {[...text].map((char, i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 0.1}s` }}
          className="split-text-char"
        >
          {char}
        </span>
      ))}
    </h2>
  );
}
