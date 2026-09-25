import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Check,
  ImageIcon,
  Sparkles,
  Sliders,
  Upload,
} from 'lucide-react';
import { useBackground } from '../context/BackgroundContext';

interface Props {
  onOpenFullscreen?: () => void;
  className?: string;
}

export const AcademyImageSlider: React.FC<Props> = ({
  onOpenFullscreen,
  className = '',
}) => {
  const {
    activeBgUrl,
    currentBgId,
    allImages,
    selectPresetBg,
    nextBg,
    prevBg,
    setIsBgModalOpen,
  } = useBackground();

  const currentIndex = allImages.findIndex((img) => img.id === currentBgId);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;
  const currentImage = allImages[activeIndex] || allImages[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    nextBg();
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    prevBg();
  };

  const handleThumbnailClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    selectPresetBg(id);
  };

  return (
    <div
      className={`relative bg-white/95 rounded-3xl shadow-xl border border-emerald-200/80 overflow-hidden backdrop-blur-md flex flex-col ${className}`}
    >
      {/* Top Slider Header Bar */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider font-cinzel text-white">
            Academy Atmosphere & Sacred Spaces
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBgModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-xl transition-colors"
            title="Edit and change background photos"
          >
            <Upload className="w-3 h-3" />
            <span>Edit / Change</span>
          </button>

          {onOpenFullscreen && (
            <button
              onClick={onOpenFullscreen}
              className="flex items-center gap-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded-xl transition-colors shadow-xs"
              title="Open Fullscreen Interactive Image Slider"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fullscreen</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Image Slider Viewport */}
      {/* Clicking on the image directly slides or opens fullscreen! */}
      <div
        onClick={onOpenFullscreen || handleNext}
        className="relative aspect-video sm:aspect-16/9 w-full bg-slate-950 overflow-hidden cursor-pointer group"
        title="Click to view image in full-screen slider"
      >
        <img
          key={currentImage?.url}
          src={currentImage?.url}
          alt={currentImage?.name || 'Academy scenic wallpaper'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Ambient Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
          title="Previous Image"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
          title="Next Image"
          aria-label="Next Image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Image Info Badge on Image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 pointer-events-none">
          <div className="text-white max-w-md">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md mb-1 border border-white/10">
              Photo {activeIndex + 1} of {allImages.length} · Click to enlarge
            </span>
            <h4 className="font-bold text-sm sm:text-base text-white drop-shadow-md leading-tight font-cinzel">
              {currentImage?.name}
            </h4>
            <p className="text-[11px] text-slate-200 drop-shadow-sm line-clamp-1 mt-0.5">
              {currentImage?.description}
            </p>
          </div>

          <div className="pointer-events-auto">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Website Background</span>
            </span>
          </div>
        </div>
      </div>

      {/* 
        Bottom Thumbnail Carousel:
        Clicking on ANY image immediately updates and displays that image in the slider & background!
      */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {allImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.id}
                onClick={(e) => handleThumbnailClick(e, img.id)}
                className={`relative shrink-0 rounded-xl overflow-hidden transition-all group cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-emerald-600 scale-102 shadow-md'
                    : 'opacity-65 hover:opacity-100'
                }`}
                style={{ width: '64px', height: '42px' }}
                title={`Click to show: ${img.name}`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-600/25 border-2 border-emerald-600 rounded-xl" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
