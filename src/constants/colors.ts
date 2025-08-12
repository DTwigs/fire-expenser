/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const primary = "#17A398";
export const secondary = "#EB5C68";
export const tertiary = "#448FDA";

const tintColorLight = primary;

export const Colors: { [key: string]: string } = {
  text: "#353249", //"#232130",
  lightText: "#232130",
  backgroundTint: "#D6C7C2",
  background: "#EFE9E7",
  tint: primary,
  icon: "#232130",
  tabIconDefault: "#353249",
  tabIconSelected: tintColorLight,
  primary,
  secondary,
  tertiary,
};
