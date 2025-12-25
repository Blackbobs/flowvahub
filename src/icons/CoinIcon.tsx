import React from "react";

const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="45"
    height="45"
    {...props}
  >
    <defs>
      <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFC700" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
      <linearGradient
        id="coinInnerGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#FFE850" />
        <stop offset="100%" stopColor="#FFB800" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#coinGradient)" />
    <circle cx="50" cy="50" r="35" fill="url(#coinInnerGradient)" />
    <polygon
      points="50,20 57,40 78,40 61,52 68,72 50,60 32,72 39,52 22,40 43,40"
      fill="#FF8C00"
    />
  </svg>
);

export default CoinIcon;
