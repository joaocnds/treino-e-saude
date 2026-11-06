export type ColorScheme = "light" | "dark";
const { themeColors } = require("../theme.config") as {
  themeColors: Record<"primary" | "secondary" | "background" | "surface" | "foreground"
    | "muted" | "border" | "success" | "warning" | "error" | "protein" | "carbs" | "fat" | "water",
    Record<ColorScheme, string>>;
};
type Palette = Record<keyof typeof themeColors, string>;
function palette(scheme: ColorScheme): Palette {
  return Object.fromEntries(Object.entries(themeColors).map(([name, colors]) => [name, colors[scheme]])) as Palette;
}
export const SchemeColors = { light: palette("light"), dark: palette("dark") };
