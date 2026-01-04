import React from 'react';

/**
 * Animated ExtendiHealth Logo
 * Pulse line with bold nodes at both ends + subtle animation
 */
const AnimatedPulseIcon = ({ size = 32, color = 'white' }) => {
  const width = size;
  const height = size * 0.65;
  
  return (
    <svg width={width} height={height} viewBox="0 0 100 65" fill="none">
      {/* Animated glow behind left node */}
      <circle cx="12" cy="32" r="10" fill={color} opacity="0.2">
        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      
      {/* Left node (bold circle) */}
      <circle cx="12" cy="32" r="8" fill={color} />
      
      {/* Pulse line */}
      <path 
        d="M20 32 L32 32 L40 12 L52 52 L64 32 L76 32" 
        stroke={color} 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Animated glow behind right node */}
      <circle cx="84" cy="32" r="10" fill={color} opacity="0.2">
        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" begin="0.5s" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      
      {/* Right node (bold circle) */}
      <circle cx="84" cy="32" r="8" fill={color} />
    </svg>
  );
};

export default AnimatedPulseIcon;
