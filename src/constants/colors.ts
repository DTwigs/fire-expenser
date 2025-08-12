/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const primary = "#17A398";
export const secondary = "#EB5C68";
export const tertiary = "#448FDA";

const tintColorLight = primary;
const tintColorDark = "#EFE9E7";

export const Colors: { [key: string]: { [key: string]: string } } = {
  light: {
    text: "#353249", //"#232130",
    lightText: "#09090aff",
    backgroundTint: "#D6C7C2",
    background: "#EFE9E7",
    tint: tintColorLight,
    icon: "#232130",
    tabIconDefault: "#353249",
    tabIconSelected: tintColorLight,
    primary,
    secondary,
    tertiary,
  },
  dark: {
    text: "#EFE9E7",
    lightText: "#D6C7C2",
    backgroundTint: "#353249",
    background: "#232130",
    tint: tintColorDark,
    icon: "#EFE9E7",
    tabIconDefault: "#353249",
    tabIconSelected: tintColorDark,
    primary,
    secondary,
    tertiary,
  },
};
