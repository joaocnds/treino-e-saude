import { Link } from "expo-router";
import { Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function OAuthCallback() {
  return (
    <ScreenContainer className="justify-center gap-4 p-6">
      <Text className="text-foreground">Esta demonstração usa armazenamento local.</Text>
      <Link className="text-primary" href="/(tabs)">Abrir o aplicativo</Link>
    </ScreenContainer>
  );
}
