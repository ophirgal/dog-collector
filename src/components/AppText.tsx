import { Text, type TextProps } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = TextProps & {
  weight?: keyof typeof fonts;
  size?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
};

/** Inter needs a font family per weight, so pick it here instead of using fontWeight. */
export function AppText({ weight = 'regular', size = 15, color = colors.ink, align, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: fonts[weight], fontSize: size, color, textAlign: align, lineHeight: size * 1.3 }, style]}
    />
  );
}
