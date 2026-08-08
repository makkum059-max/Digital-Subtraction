export type ThemePreset = 'red' | 'emerald' | 'purple' | 'amber' | 'blue' | 'rose' | 'teal' | 'maroon' | 'custom';

export interface ThemeConfig {
  id: ThemePreset;
  nameBn: string;
  nameEn: string;
  primary: string;
  hover: string;
  light: string;
  border: string;
  text: string;
  gradient: string;
}

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'red',
    nameBn: 'লাল (Classic Litchi Red)',
    nameEn: 'Classic Litchi Red',
    primary: '#dc2626',
    hover: '#b91c1c',
    light: '#fef2f2',
    border: '#fecaca',
    text: '#991b1b',
    gradient: 'from-red-600 to-rose-700',
  },
  {
    id: 'emerald',
    nameBn: 'সবুজ (Organic Garden Emerald)',
    nameEn: 'Garden Emerald',
    primary: '#059669',
    hover: '#047857',
    light: '#ecfdf5',
    border: '#a7f3d0',
    text: '#065f46',
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'purple',
    nameBn: 'বেগুনি (Royal Berry Purple)',
    nameEn: 'Royal Berry Purple',
    primary: '#7c3aed',
    hover: '#6d28d9',
    light: '#f5f3ff',
    border: '#ddd6fe',
    text: '#5b21b6',
    gradient: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'amber',
    nameBn: 'আম্বার / সোনালী (Golden Harvest)',
    nameEn: 'Golden Harvest Amber',
    primary: '#d97706',
    hover: '#b45309',
    light: '#fffbeb',
    border: '#fde68a',
    text: '#92400e',
    gradient: 'from-amber-600 to-yellow-600',
  },
  {
    id: 'blue',
    nameBn: 'নীল (Executive Royal Blue)',
    nameEn: 'Royal Blue',
    primary: '#2563eb',
    hover: '#1d4ed8',
    light: '#eff6ff',
    border: '#bfdbfe',
    text: '#1e40af',
    gradient: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'rose',
    nameBn: 'ক্রিমসন রোজ (Crimson Rose)',
    nameEn: 'Crimson Rose',
    primary: '#e11d48',
    hover: '#be123c',
    light: '#fff1f2',
    border: '#fecdd3',
    text: '#9f1239',
    gradient: 'from-rose-600 to-pink-700',
  },
  {
    id: 'teal',
    nameBn: 'টিয়াল (Ocean Fresh Teal)',
    nameEn: 'Ocean Teal',
    primary: '#0d9488',
    hover: '#0f766e',
    light: '#f0fdf4',
    border: '#99f6e4',
    text: '#115e59',
    gradient: 'from-teal-600 to-cyan-700',
  },
  {
    id: 'maroon',
    nameBn: 'মারুন (Deep Berry Maroon)',
    nameEn: 'Deep Maroon',
    primary: '#881337',
    hover: '#4c0519',
    light: '#fff1f2',
    border: '#fecdd3',
    text: '#4c0519',
    gradient: 'from-rose-950 to-red-900',
  },
];

export function getAdminGradient(presetId: ThemePreset = 'red'): string {
  switch (presetId) {
    case 'red':
      return 'from-red-600 via-rose-600 to-amber-500';
    case 'emerald':
      return 'from-emerald-600 via-teal-600 to-green-500';
    case 'purple':
      return 'from-purple-600 via-violet-600 to-indigo-600';
    case 'amber':
      return 'from-amber-600 via-orange-500 to-yellow-500';
    case 'blue':
      return 'from-blue-600 via-indigo-600 to-cyan-500';
    case 'rose':
      return 'from-rose-600 via-pink-600 to-red-500';
    case 'teal':
      return 'from-teal-600 via-emerald-600 to-cyan-600';
    case 'maroon':
      return 'from-rose-900 via-red-900 to-amber-900';
    case 'custom':
      return 'from-red-600 via-rose-600 to-amber-500';
    default:
      return 'from-red-600 via-rose-600 to-amber-500';
  }
}

export function getThemeConfig(presetId: ThemePreset = 'red', customHex?: string): ThemeConfig {
  if (presetId === 'custom' && customHex) {
    const formattedHex = customHex.startsWith('#') ? customHex : `#${customHex}`;
    if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(formattedHex)) {
      const hoverColor = adjustColorBrightness(formattedHex, -20);
      const lightColor = adjustColorBrightness(formattedHex, 85);
      const borderColor = adjustColorBrightness(formattedHex, 60);
      const textColor = adjustColorBrightness(formattedHex, -40);
      return {
        id: 'custom',
        nameBn: 'কাস্টম কালার',
        nameEn: 'Custom Color',
        primary: formattedHex,
        hover: hoverColor,
        light: lightColor,
        border: borderColor,
        text: textColor,
        gradient: `from-[${formattedHex}] to-[${hoverColor}]`,
      };
    }
  }

  return THEME_PRESETS.find((t) => t.id === presetId) || THEME_PRESETS[0];
}

export function applyTheme(presetId: ThemePreset = 'red', customHex?: string) {
  let config = getThemeConfig(presetId, customHex);

  const root = document.documentElement;
  root.style.setProperty('--theme-primary', config.primary);
  root.style.setProperty('--theme-hover', config.hover);
  root.style.setProperty('--theme-light', config.light);
  root.style.setProperty('--theme-border', config.border);
  root.style.setProperty('--theme-text', config.text);
  root.style.setProperty('--theme-gradient', `linear-gradient(135deg, ${config.primary}, ${config.hover})`);
  root.style.setProperty('--theme-dark-gradient', `linear-gradient(135deg, ${config.hover}, #111827)`);
}

// Utility to lighten or darken hex color
function adjustColorBrightness(hex: string, percent: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  let num = parseInt(cleanHex, 16);
  if (isNaN(num)) return '#dc2626';
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = ((num >> 8) & 0x00ff) + amt;
  let B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
