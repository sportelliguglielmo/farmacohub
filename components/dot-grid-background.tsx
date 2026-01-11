'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import DotGrid from './DotGrid';

export default function DotGridBackground() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme to handle system theme
  const currentTheme = resolvedTheme || theme || 'light';

  // Theme-appropriate colors - subtle for background
  const baseColor =
    currentTheme === 'dark'
      ? '#2a2a2a' // Very subtle dark gray for dark mode
      : '#f3f4f6'; // Very subtle light gray for light mode

  const activeColor =
    currentTheme === 'dark'
      ? '#10b981' // Primary green for dark mode
      : '#059669'; // Primary green for light mode

  if (!mounted) {
    return null;
  }

  return (
    <DotGrid
      dotSize={16}
      gap={32}
      baseColor={baseColor}
      activeColor={activeColor}
      proximity={150}
      speedTrigger={100}
      shockRadius={250}
      shockStrength={5}
      maxSpeed={5000}
      resistance={750}
      returnDuration={1.5}
      className='h-full w-full p-0'
    />
  );
}
