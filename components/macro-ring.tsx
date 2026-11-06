import { View, Text } from 'react-native';

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

export function MacroRing({ label, current, target, color, unit = 'g' }: MacroRingProps) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <View className="gap-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-muted">{label}</Text>
        <Text className="text-sm font-semibold text-secondary">{current}{unit} / {target}{unit}</Text>
      </View>
      <View className="h-2 bg-surface rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}
