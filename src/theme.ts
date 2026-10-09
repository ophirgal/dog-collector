export const colors = {
  green: '#1F7A5A',
  greenDark: '#16523D',
  greenSoft: '#DCEEE5',
  yellow: '#FFC63D',
  yellowSoft: '#FFF1C9',
  cream: '#F6F3EC',
  sand: '#ECE7DC',
  ink: '#1D1F24',
  inkSoft: '#5D6169',
  muted: '#9A9DA3',
  white: '#FFFFFF',
  line: '#E4DFD3',
  red: '#E5484D',
  gem: '#3B9BEA',
  night: '#1E2128',
  nightSoft: '#2B2F38',
  water: '#BFDDF0',
  park: '#CFE6C0',
};

// Card backgrounds cycle through these, as in the My Pack mockup.
export const tints = ['#FFF1C9', '#FDE3D6', '#E2EEF8', '#DCEEE5', '#E9E4FA', '#FCEBD9'];

export const tintFor = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return tints[h % tints.length];
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  black: 'Inter_800ExtraBold',
};

export const radius = { sm: 10, md: 16, lg: 22, pill: 999 };

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};
