import React from 'react';
import './style.css'; 

export const Button = ({ children, onClick, variant = 'primary', 
    type = 'button', className = '' }) => {

  return (
    <button
      type={type} onClick={onClick}
      className={`shared-button ${variant} ${className}`} >
      {children}
    </button>
  );
};
