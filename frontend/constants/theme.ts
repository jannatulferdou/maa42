/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

/**
 * Brand palette — single source of truth for color across the app.
 *
 * This consolidates colors that were previously hardcoded as raw hex
 * literals in dozens of screens, including three near-duplicate
 * "brand greens" (#32A99A, #2FA99A, #159B8D) that had drifted apart.
 * Audit of actual usage showed:
 *   - #32A99A and #2FA99A were used interchangeably for the exact same
 *     role (primary brand green) — #2FA99A was a one-digit typo and has
 *     been removed.
 *   - #159B8D was consistently used as a *deliberately darker* shade
 *     (gradient end-stop, "primaryDark") — kept as its own token rather
 *     than merged, since it plays a distinct role from #32A99A.
 * The same pass standardized the two red variants in use (#EF3340 and
 * #E83E48) on a single `danger` token, and folded a lowercase typo of
 * the accent orange (#f58523) into `accent`.
 */
export const Palette = {
  // Primary brand green
  primary: '#32A99A',
  primaryDark: '#159B8D',
  primaryLight: '#DDF5F1',

  // Accent (was also seen as the typo `#f58523`)
  accent: '#F5A623',
  accentLight: '#FFF3E0',

  // Danger / destructive — standardized on #EF3340, #E83E48 removed
  danger: '#EF3340',
  dangerLight: '#FFE7E8',

  // Neutrals
  text: '#263238',
  textSecondary: '#7B8288',
  textMuted: '#8A8F95',
  border: '#E0E7E7',
  background: '#F5FAF9',
  white: '#FFFFFF',
  black: '#000000',
};

const tintColorLight = Palette.primary;
const tintColorDark = Palette.white;

export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.white,
    tint: tintColorLight,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textSecondary,
    tabIconSelected: tintColorLight,

    primary: Palette.primary,
    primaryDark: Palette.primaryDark,
    primaryLight: Palette.primaryLight,
    accent: Palette.accent,
    accentLight: Palette.accentLight,
    danger: Palette.danger,
    dangerLight: Palette.dangerLight,
    border: Palette.border,
    surface: Palette.background,
    textSecondary: Palette.textSecondary,
    textMuted: Palette.textMuted,
    white: Palette.white,
    black: Palette.black,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    primary: Palette.primary,
    primaryDark: Palette.primaryDark,
    primaryLight: '#0F2E2A',
    accent: Palette.accent,
    accentLight: '#3A2A12',
    danger: Palette.danger,
    dangerLight: '#3A1418',
    border: '#2A2F31',
    surface: '#1B1D1E',
    textSecondary: '#9BA1A6',
    textMuted: '#7A7F86',
    white: Palette.white,
    black: Palette.black,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
