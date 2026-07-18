import React, { useState, useEffect } from 'react';

export function HeroTypewriter() {
  const part1 = "Intelligent Marketing. ";
  const part2 = "Accelerating Growth To Empower Brands.";

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText1(part1.slice(0, index + 1));
      index++;
      if (index >= part1.length) {
        clearInterval(interval);
        setShowCursor1(false);
        setShowCursor2(true);
        startPart2();
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const startPart2 = () => {
    let index = 0;
    const interval = setInterval(() => {
      setText2(part2.slice(0, index + 1));
      index++;
      if (index >= part2.length) {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-slate-900 min-h-[120px] sm:min-h-[160px]">
      <span>{text1}</span>
      {showCursor1 && (
        <span className="inline-block w-1 h-8 sm:h-12 ml-1 bg-slate-900 animate-pulse align-middle"></span>
      )}
      <br className="hidden sm:inline" />
      <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
        {text2}
      </span>
      {showCursor2 && (
        <span className="inline-block w-1 h-8 sm:h-12 ml-1 bg-emerald-500 animate-pulse align-middle"></span>
      )}
    </h1>
  );
}
