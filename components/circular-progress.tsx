import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  percentage: number;
  color: string;
  label: string;
  value: string;
  max: string;
}

export function CircularProgress({
  size = 120,
  strokeWidth = 8,
  percentage,
  color,
  label,
  value,
  max,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="items-center gap-2">
      <View style={{ width: size, height: size, position: 'relative' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2D2D44"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            originX={size / 2}
            originY={size / 2}
          />
        </Svg>
        {/* Center text */}
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-sm text-muted">{label}</Text>
          <Text className="text-lg font-semibold text-foreground">{value}</Text>
          <Text className="text-xs text-muted">/ {max}</Text>
        </View>
      </View>
    </View>
  );
}
