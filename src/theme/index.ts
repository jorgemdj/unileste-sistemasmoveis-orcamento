// src/theme/index.ts

export const Colors = {
  // Principal
  purpleLight: '#DFDAF2',
  purpleBase: '#6A46EB',

  // Base / Gray scale
  gray100: '#FAFAFA',
  gray200: '#F0F0F0',
  gray300: '#E6E5E5',
  gray400: '#A1A2A1',
  gray500: '#676767',
  gray600: '#4A4A4A',
  gray700: '#0F0F0F',

  // Feedback – Danger
  dangerLight: '#FFD6D6',
  dangerBase: '#DB4D4D',
  dangerDark: '#9E4949',

  // Feedback – Success
  successLight: '#BFF7BE',
  successBase: '#4BB88A',
  successDark: '#30752F',

  // Feedback – Info
  infoLight: '#CEEFFF',
  infoBase: '#2AA1D9',
  infoDark: '#1D7096',

  // Semantic aliases
  white: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#FAFAFA',
  border: '#E6E5E5',
  textPrimary: '#0F0F0F',
  textSecondary: '#676767',
  textDisabled: '#A1A2A1',
};

export const Typography = {
  titleLg: { fontSize: 18, lineHeight: 25, fontWeight: '700' as const },
  titleMd: { fontSize: 16, lineHeight: 22, fontWeight: '700' as const },
  titleSm: { fontSize: 14, lineHeight: 20, fontWeight: '700' as const },
  titleXs: { fontSize: 12, lineHeight: 17, fontWeight: '700' as const },
  textMd: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  textSm: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  textXs: { fontSize: 12, lineHeight: 17, fontWeight: '400' as const },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
};
