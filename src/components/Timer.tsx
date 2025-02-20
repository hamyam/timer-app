'use client';

import { useState, useEffect, useCallback } from "react";

const Timer = () => {
  const [time, setTime] = useState(0); // Gesamtzeit in ms
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [displayTime, setDisplayTime] = useState(0); // Zeit für Anzeige (minimiert Flackern)

  useEffect(() => {
    let animationFrame: number | null = null;
    let lastUpdate = 0; // Zeitpunkt des letzten UI-Updates

    const updateTimer = () => {
      if (running && startTime !== null) {
        const currentTime = Date.now() - startTime;
        setTime(currentTime);

        // UI alle 10ms aktualisieren
        if (currentTime - lastUpdate > 10) {
          setDisplayTime(currentTime);
          lastUpdate = currentTime;
        }

        animationFrame = requestAnimationFrame(updateTimer);
      }
    };

    if (running) {
      animationFrame = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [running, startTime]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    setLastKey(event.code); // Speichert die letzte gedrückte Taste

    if (event.code === "Space") {
      toggleTimer();
    } else if (event.code === "Backspace") {
      resetTimer();
    }
  }, [running, time]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const toggleTimer = () => {
    if (running) {
      setRunning(false);
    } else {
      setStartTime(Date.now() - time); // Startzeit setzen, um die Pause korrekt fortzusetzen
      setRunning(true);
    }
  };

  const resetTimer = () => {
    setRunning(false);
    setTime(0);
    setDisplayTime(0);
    setStartTime(null);
  };

  // 🔹 Korrekte Formatierung mit `padStart(2, '0')`
  const hours = Math.floor(displayTime / 3600000).toString().padStart(2, "0");
  const minutes = Math.floor((displayTime / 60000) % 60).toString().padStart(2, "0");
  const seconds = Math.floor((displayTime / 1000) % 60).toString().padStart(2, "0");
  const milliseconds = Math.floor((displayTime / 10) % 100).toString().padStart(2, "0");

  // Dynamische Anzeige: Stunden werden nur angezeigt, wenn `hours > 0`
  const formattedTime = hours !== "00" ? `${hours}:${minutes}:${seconds}.${milliseconds}` : `${minutes}:${seconds}.${milliseconds}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative">
      <h1 className="text-4xl font-bold mb-6">React Timer</h1>

      {/* Timer-Anzeige */}
      <div className="text-6xl font-mono p-4 bg-gray-800 rounded-lg shadow-md">
        {formattedTime}
      </div>

      {/* Steuerungs-Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={toggleTimer}
          className={`px-6 py-3 text-white font-bold rounded-lg shadow-md transition-all ${
            running ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-all"
        >
          Zurücksetzen
        </button>
      </div>

      <p className="mt-4 text-gray-400">
        [Leertaste] Start/Pause | [Backspace] Zurücksetzen
      </p>

      {/* Overlay für zuletzt gedrückte Taste */}
      {lastKey && (
        <div className="absolute bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-lg opacity-80">
          Letzte Taste: <span className="font-bold">{lastKey}</span>
        </div>
      )}
    </div>
  );
};

export default Timer;
