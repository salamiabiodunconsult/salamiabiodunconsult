/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16'
  };

  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`${sizeClasses[size]} ${className} select-none shrink-0`}
      aria-label="Salami Abiodun Consult Logo"
    >
      <defs>
        {/* Arc for curved text on top half */}
        <path 
          id="logoTextCurve" 
          d="M 22,100 A 78,78 0 1,1 178,100" 
          fill="none" 
        />
      </defs>

      {/* Outer black solid circle */}
      <circle cx="100" cy="100" r="98" fill="#000" />
      
      {/* Outer white delicate border */}
      <circle cx="100" cy="100" r="95" fill="none" stroke="#fff" strokeWidth="2.5" />
      
      {/* Curved "SALAMI ABIODUN CONSULT" text */}
      <text 
        fill="#fff" 
        fontSize="14.5" 
        fontWeight="800" 
        fontFamily="'Inter', 'Space Grotesk', system-ui, sans-serif" 
        letterSpacing="4.2"
      >
        <textPath href="#logoTextCurve" startOffset="50%" textAnchor="middle">
          SALAMI ABIODUN CONSULT
        </textPath>
      </text>

      {/* Decorative dot in the bottom */}
      <circle cx="100" cy="178" r="4" fill="#fff" />
      
      {/* Inner white circle backing */}
      <circle cx="100" cy="100" r="68" fill="#fff" />
      
      {/* Inner black solid circle */}
      <circle cx="100" cy="100" r="54" fill="#000" />
      
      {/* Inner white delicate border */}
      <circle cx="100" cy="100" r="52" fill="none" stroke="#fff" strokeWidth="1" />
      
      {/* Center 'SAC' text */}
      <text 
        x="100" 
        y="114" 
        fill="#fff" 
        fontSize="40" 
        fontWeight="900" 
        fontFamily="'Inter', 'Space Grotesk', system-ui, sans-serif" 
        letterSpacing="1" 
        textAnchor="middle"
      >
        SAC
      </text>
    </svg>
  );
}
