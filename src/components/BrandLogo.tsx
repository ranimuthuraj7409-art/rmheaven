import React from 'react';

interface BrandLogoProps {
  variant?: 'emblem' | 'lockup' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
  onClick?: () => void;
  brandName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'lockup',
  size = 'md',
  className = '',
  showSubtitle = true,
  subtitleText = 'Academic & Internship Platform',
  onClick,
  brandName = 'RM Heaven'
}) => {
  // Official RM Heaven emblem logo uploaded by the user
  const logoSrc = '/assets/aistudio/Regal_RM_Heaven_Lion_Crest_42e22830.png';

  const sizeDimensions = {
    xs: 'w-8 h-8 sm:w-9 sm:h-9',
    sm: 'w-10 h-10 sm:w-11 sm:h-11',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
    '2xl': 'w-36 h-36 sm:w-44 sm:h-44'
  };

  const emblemElement = (
    <div
      className={`relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200 ${sizeDimensions[size]}`}
    >
      <img
        src={logoSrc}
        alt="RM Heaven Official Lion Crest Logo"
        className="w-full h-full object-contain filter drop-shadow-xs select-none rounded-lg"
        loading="eager"
        decoding="async"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes('rm_heaven_logo')) {
            target.src = '/assets/logo/rm_heaven_logo.png';
          }
        }}
      />
    </div>
  );

  if (variant === 'emblem') {
    return (
      <div 
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
      >
        {emblemElement}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-3.5 p-2.5 sm:p-3 bg-white/95 backdrop-blur-xs border border-[#D6B878]/60 rounded-2xl shadow-sm hover:border-[#D6B878] transition-all ${
          onClick ? 'cursor-pointer hover:shadow-md' : ''
        } ${className}`}
      >
        {emblemElement}
        <div className="flex flex-col text-left">
          <span className="font-heading font-extrabold text-base sm:text-lg text-[#393333] tracking-tight leading-tight">
            {brandName}
          </span>
          {showSubtitle && (
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#702D3D] font-bold leading-tight mt-0.5">
              {subtitleText}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: lockup (for Navbar, Footer, Headers)
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 text-left whitespace-nowrap shrink-0 group focus:outline-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {emblemElement}
      <div className="flex flex-col">
        <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#393333] group-hover:text-[#800020] transition-colors leading-none flex items-center gap-1.5">
          <span>{brandName}</span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-widest text-[#702D3D] font-semibold leading-tight mt-1">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
