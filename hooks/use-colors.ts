import { SchemeColors } from "@/constants/theme";
import { useThemeContext } from "@/lib/theme-provider";

export function useColors() {
  return SchemeColors[useThemeContext().colorScheme];
}
