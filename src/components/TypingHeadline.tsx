"use client";
import { useEffect, useMemo, useState } from "react";

export default function TypingHeadline({
  words,
  className,
  typingMs = 70,
  pauseMs = 700,
  loop = true,
}: {
  words: string[];
  className?: string;
  typingMs?: number;
  pauseMs?: number;
  loop?: boolean;
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const fullText = useMemo(() => words.join(" "), [words]);
  const [output, setOutput] = useState<string>("");

  // Detect reduced motion after mount to avoid SSR/CSR mismatch
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setOutput(fullText);
      return;
    }
    let wordIndex = 0;
    let charIndex = 0;
    let current = "";
    let timer: number | undefined;

    function typeNext() {
      const word = words[wordIndex] ?? "";
      if (charIndex < word.length) {
        current += word[charIndex++];
        setOutput(current);
        timer = window.setTimeout(typeNext, typingMs);
        return;
      }
      // word finished
      if (wordIndex < words.length - 1) {
        current += " ";
      }
      setOutput(current);
      wordIndex += 1;
      charIndex = 0;
      if (wordIndex < words.length) {
        timer = window.setTimeout(typeNext, pauseMs);
      } else if (loop) {
        timer = window.setTimeout(() => {
          wordIndex = 0;
          charIndex = 0;
          current = "";
          setOutput("");
          typeNext();
        }, pauseMs * 2);
      }
    }

    timer = window.setTimeout(typeNext, 300);
    return () => window.clearTimeout(timer);
  }, [words, typingMs, pauseMs, loop, prefersReducedMotion, fullText]);

  return (
    <span className={className} aria-live="polite">
      {output}
      <span className="typing-caret" aria-hidden="true" />
    </span>
  );
}


