import React from 'react';

const Card = ({ children, className = '', onClick, ...props }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
