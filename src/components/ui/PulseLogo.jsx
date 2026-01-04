import React from 'react';

/**
 * ExtendiHealth Logo - Pulse line with bold nodes at both ends
 * Can be used as SVG component or you can use the image asset at /assets/logo-white.webp
 */
const PulseLogo = ({ 
  size = 32, 
  color = 'currentColor', 
  className = '',
  style = {}
}) => {
  // Maintain aspect ratio - logo is wider than tall
  const width = size;
  const height = size * 0.6; // Approximate aspect ratio
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 60" 
      fill="none" 
      className={className}
      style={style}
      aria-label="ExtendiHealth logo"
    >
      {/* Left node (bold circle) */}
      <circle 
        cx="10" 
        cy="30" 
        r="8" 
        fill={color} 
      />
      
      {/* Pulse line - starts from left node, goes through heartbeat pattern, ends at right node */}
      <path 
        d="M18 30 L30 30 L38 10 L50 50 L62 30 L72 30" 
        stroke={color} 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Right node (bold circle) */}
      <circle 
        cx="80" 
        cy="30" 
        r="8" 
        fill={color} 
      />
    </svg>
  );
};

/**
 * Animated version with subtle pulse effect
 */
export const AnimatedPulseLogo = ({ 
  size = 32, 
  color = 'currentColor', 
  className = '' 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <PulseLogo size={size} color={color} />
    </div>
  );
};

/**
 * Logo with image asset (for places where you need the exact PNG/WebP)
 * Use this when you need the precise uploaded logo
 */
export const LogoImage = ({ 
  size = 32, 
  className = '',
  variant = 'white' // 'white' for dark backgrounds
}) => {
  return (
    <img 
      src={`/assets/logo-${variant}.webp`}
      alt="ExtendiHealth"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default PulseLogo;
