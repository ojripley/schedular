import { useState } from 'react';

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  return {
    mode,
    transition(newMode, replace = false) {
      console.log(newMode);
      setHistory((prev) => {
        if (replace) {
          prev.pop();
        }
        setMode(newMode);
        return [...prev, newMode];
      });
    },
    back() {
      // console.log(history[history.length - 1]);
      if (history.length > 1) {
        setHistory((prev) => {
          console.log(prev[prev.length - 1]);
          prev.pop();
          console.log(prev[prev.length - 1]);
          setMode(prev[prev.length - 1]);
          return prev;
        });
      } else {
        console.log(history[0]);
        setMode(history[0]);
      }
    }
  };
}