import React from 'react';
import { useBackground } from '../context/BackgroundContext';

interface Props {
  className?: string;
  fixed?: boolean;
}

export const IslamicPatternBackground: React.FC<Props> = ({
  className = '',
  fixed = true,
}) => {
  const { activeBgUrl, bgOpacity, isCover, bgSize } = useBackground();

  return (
    <div
      className={`${
        fixed ? 'fixed inset-0 pointer-events-none' : 'absolute inset-0'
      } z-0 overflow-hidden bg-[#faf9f6] ${className}`}
      aria-hidden="true"
    >
      {/* 
        Full-Time Background Pattern/Image:
        Displays the light white and silver geometric Islamic pattern uploaded by the user
      */}
      {isCover ? (
        <img
          src={activeBgUrl}
          alt="Quran Education Academy Pattern"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out select-none"
          style={{
            opacity: bgOpacity,
          }}
        />
      ) : (
        <div
          className="w-full h-full transition-all duration-300 bg-center"
          style={{
            backgroundImage: `url(${activeBgUrl})`,
            backgroundRepeat: 'repeat',
            backgroundSize: `${bgSize}px auto`,
            opacity: bgOpacity,
          }}
        />
      )}

      {/* Subtle soft gradient to give elegant depth */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#faf9f6]/20 to-[#faf9f6]/40 pointer-events-none" />
    </div>
  );
};
