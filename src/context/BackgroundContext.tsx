import React, { createContext, useContext, useState, useEffect } from 'react';
import userPatternImg from '../assets/images/user_custom_pattern_1790363950138.jpg';
import originalPatternImg from '../assets/images/islamic_pattern_bg_1790357126226.jpg';
import goldPatternImg from '../assets/images/islamic_gold_pattern_1790357491898.jpg';
import emeraldPatternImg from '../assets/images/islamic_emerald_pat_1790357511933.jpg';
import mosqueInteriorImg from '../assets/images/mosque_interior_bg_1790362031808.jpg';
import quranRehalImg from '../assets/images/quran_rehal_bg_1790362049559.jpg';
import grandMosqueImg from '../assets/images/grand_mosque_bg_1790362064484.jpg';

export interface BackgroundPresetOption {
  id: string;
  name: string;
  url: string;
  description: string;
  category: 'scenic' | 'pattern';
}

export const BACKGROUND_PRESET_OPTIONS: BackgroundPresetOption[] = [
  {
    id: 'user_pattern',
    name: 'White & Silver Islamic Geometric Pattern',
    url: userPatternImg,
    description: 'Minimal, elegant white and light silver Moroccan Islamic geometric star lattice pattern.',
    category: 'pattern',
  },
  {
    id: 'original',
    name: 'Classic Islamic Star Pattern',
    url: originalPatternImg,
    description: 'Subtle light geometric arabesque pattern.',
    category: 'pattern',
  },
  {
    id: 'gold',
    name: 'Royal Gold & Ivory Pattern',
    url: goldPatternImg,
    description: 'Golden Islamic arabesque symmetry on cream ivory backdrop.',
    category: 'pattern',
  },
  {
    id: 'emerald',
    name: 'Emerald Mosque Tile Pattern',
    url: emeraldPatternImg,
    description: 'Emerald green and gold traditional architectural mosaic.',
    category: 'pattern',
  },
  {
    id: 'mosque_interior',
    name: 'Serene Mosque Sanctuary & Arches',
    url: mosqueInteriorImg,
    description: 'Breathtaking grand mosque interior with marble arches and warm morning sunlight.',
    category: 'scenic',
  },
  {
    id: 'quran_rehal',
    name: 'Holy Quran on Golden Rehal',
    url: quranRehalImg,
    description: 'Golden calligraphy Holy Quran resting on carved wooden rehal with peaceful ambient light.',
    category: 'scenic',
  },
  {
    id: 'grand_mosque',
    name: 'Grand Mosque at Twilight',
    url: grandMosqueImg,
    description: 'Majestic white marble mosque with illuminated minarets and tranquil reflective pool.',
    category: 'scenic',
  },
];

export interface BackgroundApplyData {
  bgId: string;
  customUrl?: string | null;
  opacity?: number;
  size?: number;
  isCover?: boolean;
}

interface BackgroundContextType {
  activeBgUrl: string;
  currentBgId: string;
  customBgUrl: string | null;
  bgOpacity: number;
  bgSize: number;
  isCover: boolean;
  allImages: BackgroundPresetOption[];
  selectPresetBg: (id: string) => void;
  nextBg: () => void;
  prevBg: () => void;
  setBgByIndex: (index: number) => void;
  uploadCustomBg: (file: File) => Promise<string>;
  setBgOpacity: (opacity: number) => void;
  setBgSize: (size: number) => void;
  setIsCover: (cover: boolean) => void;
  applyBackgroundChanges: (data: BackgroundApplyData) => void;
  resetDefaultBg: () => void;
  isBgModalOpen: boolean;
  setIsBgModalOpen: (open: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const BG_STORAGE_KEY = 'qea_background_settings_v8';

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBgId, setCurrentBgId] = useState<string>('user_pattern');
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState<number>(0.85);
  const [bgSize, setBgSize] = useState<number>(340);
  const [isCover, setIsCover] = useState<boolean>(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentBgId) setCurrentBgId(parsed.currentBgId);
        if (parsed.customBgUrl) setCustomBgUrl(parsed.customBgUrl);
        if (typeof parsed.bgOpacity === 'number') setBgOpacity(parsed.bgOpacity);
        if (typeof parsed.bgSize === 'number') setBgSize(parsed.bgSize);
        if (typeof parsed.isCover === 'boolean') setIsCover(parsed.isCover);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveState = (
    id: string,
    custom: string | null,
    opacity: number,
    size: number,
    cover: boolean
  ) => {
    try {
      localStorage.setItem(
        BG_STORAGE_KEY,
        JSON.stringify({
          currentBgId: id,
          customBgUrl: custom && custom.length < 2500000 ? custom : null,
          bgOpacity: opacity,
          bgSize: size,
          isCover: cover,
        })
      );
    } catch {
      // ignore
    }
  };

  const selectPresetBg = (id: string) => {
    setCurrentBgId(id);
    const isPresetPattern =
      id === 'user_pattern' || id === 'original' || id === 'gold' || id === 'emerald';
    const newCover = !isPresetPattern;
    setIsCover(newCover);
    saveState(id, customBgUrl, bgOpacity, bgSize, newCover);
  };

  const uploadCustomBg = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select an image file'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  };

  const applyBackgroundChanges = (data: BackgroundApplyData) => {
    const newId = data.bgId;
    const newCustom = data.customUrl !== undefined ? data.customUrl : customBgUrl;
    const newOpacity = data.opacity !== undefined ? data.opacity : bgOpacity;
    const newSize = data.size !== undefined ? data.size : bgSize;
    const newCover = data.isCover !== undefined ? data.isCover : isCover;

    setCurrentBgId(newId);
    if (data.customUrl !== undefined) setCustomBgUrl(data.customUrl);
    if (data.opacity !== undefined) setBgOpacity(newOpacity);
    if (data.size !== undefined) setBgSize(newSize);
    if (data.isCover !== undefined) setIsCover(newCover);

    saveState(newId, newCustom, newOpacity, newSize, newCover);
  };

  const handleSetOpacity = (opacity: number) => {
    setBgOpacity(opacity);
    saveState(currentBgId, customBgUrl, opacity, bgSize, isCover);
  };

  const handleSetSize = (size: number) => {
    setBgSize(size);
    saveState(currentBgId, customBgUrl, bgOpacity, size, isCover);
  };

  const handleSetIsCover = (cover: boolean) => {
    setIsCover(cover);
    saveState(currentBgId, customBgUrl, bgOpacity, bgSize, cover);
  };

  const resetDefaultBg = () => {
    setCurrentBgId('user_pattern');
    setCustomBgUrl(null);
    setBgOpacity(0.85);
    setBgSize(340);
    setIsCover(false);
    saveState('user_pattern', null, 0.85, 340, false);
  };

  const allImages: BackgroundPresetOption[] = [
    ...BACKGROUND_PRESET_OPTIONS,
    ...(customBgUrl
      ? [
          {
            id: 'custom',
            name: 'Your Custom Uploaded Photo',
            url: customBgUrl,
            description: 'Custom photo uploaded by you.',
            category: 'scenic' as const,
          },
        ]
      : []),
  ];

  const nextBg = () => {
    const currentIndex = allImages.findIndex((img) => img.id === currentBgId);
    const nextIndex = (currentIndex + 1) % allImages.length;
    selectPresetBg(allImages[nextIndex].id);
  };

  const prevBg = () => {
    const currentIndex = allImages.findIndex((img) => img.id === currentBgId);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    selectPresetBg(allImages[prevIndex].id);
  };

  const setBgByIndex = (index: number) => {
    if (index >= 0 && index < allImages.length) {
      selectPresetBg(allImages[index].id);
    }
  };

  let activeBgUrl = userPatternImg;
  if (currentBgId === 'custom' && customBgUrl) {
    activeBgUrl = customBgUrl;
  } else {
    const found = BACKGROUND_PRESET_OPTIONS.find((p) => p.id === currentBgId);
    if (found) {
      activeBgUrl = found.url;
    }
  }

  return (
    <BackgroundContext.Provider
      value={{
        activeBgUrl,
        currentBgId,
        customBgUrl,
        bgOpacity,
        bgSize,
        isCover,
        allImages,
        selectPresetBg,
        nextBg,
        prevBg,
        setBgByIndex,
        uploadCustomBg,
        setBgOpacity: handleSetOpacity,
        setBgSize: handleSetSize,
        setIsCover: handleSetIsCover,
        applyBackgroundChanges,
        resetDefaultBg,
        isBgModalOpen,
        setIsBgModalOpen,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
