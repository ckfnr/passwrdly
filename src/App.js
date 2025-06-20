import React, { useState, useEffect } from "react";
import zxcvbn from "zxcvbn";
import SplitText from "./SplitText";
import Dither from './Dither';
import CircularText from './CircularText';

function App() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState({ warning: "", suggestions: [] });

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    let charset = "";
    if (includeUppercase) charset += upper;
    if (includeLowercase) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (!charset) return "";

    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += charset[Math.floor(Math.random() * charset.length)];
    }
    return pwd;
  };

  useEffect(() => {
    const pwd = generatePassword();
    setPassword(pwd);
    const result = zxcvbn(pwd);
    setStrength(result.score);
    setFeedback(result.feedback);
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "#ff3e36",
    "#ff691f",
    "#ffda36",
    "#0be881",
    "#05c46b",
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Dither background as the bottom layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      {/* UI "box" */}
      <div className="app-container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            position: "relative",
            width: 180,
            height: 180,
            margin: "48px auto 20px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://raw.githubusercontent.com/ckfnr/gallery/refs/heads/main/cksite_logo_transparent.png"
            alt="Logo"
            style={{
              width: 110,
              height: 110,
              objectFit: "contain",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          />
          <CircularText
            text="CK*SITE*ONLINE*"
            onHover="speedUp"
            spinDuration={20}
            className="custom-class"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 180,
              height: 180,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        </div>
        <center><SplitText text="PASSWRDLY" /></center>

        <label>
          Length: {length}
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </label>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={() => setIncludeUppercase(!includeUppercase)}
            />
            Include Uppercase
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={() => setIncludeLowercase(!includeLowercase)}
            />
            Include Lowercase
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
            />
            Include Numbers
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
            />
            Include Symbols
          </label>
        </div>

        <input
          type="text"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            const result = zxcvbn(e.target.value);
            setStrength(result.score);
            setFeedback(result.feedback);
          }}
          style={{ width: "100%", fontSize: 18, marginTop: 10, padding: 8 }}
        />

        <div
          className="strength-bar"
          style={{
            backgroundColor: strengthColors[strength],
          }}
        />

        <div className="strength-label">
          Strength: {strengthLabels[strength]}
        </div>

        {feedback.warning && (
          <div className="feedback-warning">Warning: {feedback.warning}</div>
        )}

        {feedback.suggestions.length > 0 && (
          <ul className="feedback-suggestions">
            {feedback.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}

        <button
          className="copy-button"
          onClick={() => {
            navigator.clipboard.writeText(password);
            alert("Copied to clipboard!");
          }}
        >
          Copy Password
        </button>
      </div>
    </div>
  );
}

export default App;