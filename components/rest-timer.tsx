import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface RestTimerProps {
  defaultSeconds?: number;
  onComplete?: () => void;
  onStart?: () => void;
}

export function RestTimer({ defaultSeconds = 90, onComplete, onStart }: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      onStart?.();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReset = () => {
    setSeconds(defaultSeconds);
    setIsRunning(false);
    setIsCompleted(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAddTime = (amount: number) => {
    setSeconds((prev) => Math.max(0, prev + amount));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Animation for completion
  useEffect(() => {
    if (isCompleted) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isCompleted, scaleAnim, opacityAnim]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const progress = 1 - seconds / defaultSeconds;

  return (
    <View className="gap-4">
      {/* Timer Display */}
      <View className="bg-gradient-to-b from-primary/10 to-primary/5 rounded-3xl p-8 items-center border-2 border-primary/20 relative">
        {/* Completion Animation */}
        {isCompleted && (
          <Animated.View
            style={{
              position: 'absolute',
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }}
            className="absolute inset-0 items-center justify-center"
          >
            <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center">
              <MaterialIcons name="check" size={48} color="#10B981" />
            </View>
          </Animated.View>
        )}

        {/* Time Display */}
        <Text className="text-6xl font-bold text-primary">
          {minutes.toString().padStart(2, '0')}:{displaySeconds.toString().padStart(2, '0')}
        </Text>
        <Text className="text-sm text-muted mt-2">Tempo de Descanso</Text>

        {/* Progress Bar */}
        <View className="w-full mt-6 h-2 bg-primary/20 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary"
            style={{
              width: `${progress * 100}%`,
            }}
          />
        </View>
      </View>

      {/* Controls */}
      <View className="gap-2">
        {/* Main Action Button */}
        <TouchableOpacity
          onPress={isRunning ? handlePause : handleStart}
          activeOpacity={0.8}
          className={`rounded-lg py-3 flex-row items-center justify-center gap-2 ${
            isRunning ? 'bg-warning' : 'bg-primary'
          }`}
        >
          <MaterialIcons
            name={isRunning ? 'pause' : 'play-arrow'}
            size={24}
            color="white"
          />
          <Text className="text-white font-semibold text-lg">
            {isRunning ? 'Pausar' : 'Iniciar'}
          </Text>
        </TouchableOpacity>

        {/* Quick Add Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => handleAddTime(-15)}
            activeOpacity={0.8}
            className="flex-1 bg-surface border border-border rounded-lg py-2"
          >
            <Text className="text-foreground font-semibold text-center">-15s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAddTime(15)}
            activeOpacity={0.8}
            className="flex-1 bg-surface border border-border rounded-lg py-2"
          >
            <Text className="text-foreground font-semibold text-center">+15s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.8}
            className="flex-1 bg-surface border border-border rounded-lg py-2"
          >
            <Text className="text-foreground font-semibold text-center">Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Completion Message */}
      {isCompleted && (
        <View className="bg-primary/10 rounded-lg p-4 border border-primary items-center">
          <Text className="text-primary font-semibold text-center">
            ✓ Tempo de descanso completo! Pronto para a próxima série?
          </Text>
        </View>
      )}
    </View>
  );
}
