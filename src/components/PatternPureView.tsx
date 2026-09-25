import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ArrowLeft,
  ImageIcon,
  Check,
  Upload,
  Play,
  Pause,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { ACADEMY_INFO } from '../utils/whatsapp';
import { AcademyLogo } from './AcademyLogo';
import { useBackground, BackgroundPresetOption } from '../context/BackgroundContext';

interface Props {
  onExit: () => void;
  onOpenWhatsAppModal: () => void;
}

export const PatternPureView: React.FC<Props> = ({
  onExit,
  onOpenWhatsAppModal,
}) => {
  const {
    activeBgUrl,
    currentBgId,
    allImages,
    selectPresetBg,
    nextBg,
    prevBg,
    setBgByIndex,
    setIsBgModalOpen,
  } = useBackground();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Sync current index when activeBgUrl / currentBgId changes
  useEffect(() => {
    const idx = allImages.findIndex((img) => img.id === currentBgId);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  }, [currentBgId, allImages]);

  // Autoplay slider if user toggles play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allImages.length]);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allImages.length;
    setCurrentIndex(nextIdx);
    selectPresetBg(allImages[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentIndex(prevIdx);
    selectPresetBg(allImages[prevIdx].id);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    selectPresetBg(allImages[index].id);
  };

  const currentImage = allImages[currentIndex] || allImages[0];
  const isAppliedAsBackground = currentBgId === currentImage?.id;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-black select-none flex flex-col justify-between"
      onMouseMove={() => setShowControls(true)}
    >
      {/* 
        Full-Screen Image Display:
        Clicking directly on the image advances to the next image, exactly like an image slider!
      */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={handleNext}
        title="Click anywhere to slide to the next image"
      >
        <img
          key={currentImage?.url}
          src={currentImage?.url}
          alt={currentImage?.name || 'Academy Background'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center animate-in fade-in zoom-in-95 duration-500 transition-transform duration-700"
        />

        {/* Subtle vignette shadow so navigation controls and image contrast are clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Floating Top Navigation Bar */}
      <header
        className={`relative z-30 p-3 sm:p-5 flex flex-wrap items-center justify-between gap-3 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExit();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 text-xs font-semibold shadow-lg transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Academy</span>
          </button>

          <div className="flex items-center gap-2.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-white">
            <AcademyLogo className="w-8 h-8" />
            <div className="hidden sm:block">
              <h1 className="font-cinzel font-bold text-sm leading-none text-white">
                {ACADEMY_INFO.name}
              </h1>
              <p className="text-[11px] text-emerald-300 font-semibold mt-0.5">
                Image Slider ({currentIndex + 1} of {allImages.length})
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Autoplay button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 text-xs font-semibold shadow-lg transition-colors"
            title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          {/* Change / Upload Image */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBgModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 text-xs font-semibold shadow-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edit / Upload</span>
          </button>

          {/* WhatsApp Direct Admission */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenWhatsAppModal();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp Admission</span>
          </button>
        </div>
      </header>

      {/* Side Arrow Navigation Buttons (Prev / Next) */}
      <div className="relative z-30 px-3 sm:px-6 w-full flex items-center justify-between pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="pointer-events-auto p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all transform hover:scale-110 active:scale-90"
          title="Previous Image (Left Arrow)"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="pointer-events-auto p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all transform hover:scale-110 active:scale-90"
          title="Next Image (Right Arrow / Click on screen)"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Bottom Floating Interactive Thumbnail Slider Strip */}
      <footer
        className={`relative z-30 p-4 sm:p-6 flex flex-col items-center gap-3 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Active Image Title & Quick Info */}
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-white text-xs shadow-xl max-w-xl text-center">
          <div className="text-left flex-1 min-w-0">
            <p className="font-bold text-sm text-white truncate font-cinzel">
              {currentImage?.name}
            </p>
            <p className="text-[11px] text-emerald-300 line-clamp-1">
              {currentImage?.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 pl-3 border-l border-white/20">
            {isAppliedAsBackground ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" />
                <span>Active Background</span>
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectPresetBg(currentImage.id);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-xl shadow-md transition-colors"
              >
                <span>Set as Background</span>
              </button>
            )}
          </div>
        </div>

        {/* 
          Thumbnails Strip:
          "image slider me image pr click krne se image ata hai isi trah is pr b image ay div ki jgha"
          User can click ANY thumbnail image, and that image immediately loads and displays on screen!
        */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-black/55 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-x-auto max-w-full">
          {allImages.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleThumbnailClick(idx);
                }}
                className={`relative shrink-0 rounded-xl overflow-hidden transition-all duration-300 group cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 scale-105 shadow-xl opacity-100'
                    : 'opacity-60 hover:opacity-100 hover:scale-100'
                }`}
                style={{ width: '70px', height: '48px' }}
                title={`Click to view: ${img.name}`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-500/20 border-2 border-emerald-400 rounded-xl" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tip text */}
        <p className="text-[11px] text-white/70 tracking-wide font-medium hidden sm:block">
          Click any thumbnail or press <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] text-white">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] text-white">→</kbd> to switch images. Click image to advance.
        </p>
      </footer>
    </div>
  );
};
