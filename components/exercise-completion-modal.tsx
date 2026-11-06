import { View, Text, Modal, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ExerciseCompletionModalProps {
  visible: boolean;
  exerciseName: string;
  weight: number;
  reps: number;
  rpe: number;
  onClose: () => void;
  onNextSet?: () => void;
}

export function ExerciseCompletionModal({
  visible,
  exerciseName,
  weight,
  reps,
  rpe,
  onClose,
  onNextSet,
}: ExerciseCompletionModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim, rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
          className="bg-background rounded-3xl p-8 w-full max-w-sm items-center gap-6"
        >
          {/* Animated Checkmark */}
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center">
              <MaterialIcons name="check-circle" size={80} color="#10B981" />
            </View>
          </Animated.View>

          {/* Success Message */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Série Completa!</Text>
            <Text className="text-base text-muted text-center">{exerciseName}</Text>
          </View>

          {/* Stats Card */}
          <View className="w-full bg-surface rounded-2xl p-4 border border-border gap-3">
            <View className="flex-row justify-between items-center">
              <View className="items-center flex-1">
                <Text className="text-xs text-muted mb-1">Peso</Text>
                <Text className="text-2xl font-bold text-foreground">{weight}kg</Text>
              </View>
              <View className="w-px h-12 bg-border" />
              <View className="items-center flex-1">
                <Text className="text-xs text-muted mb-1">Reps</Text>
                <Text className="text-2xl font-bold text-foreground">{reps}</Text>
              </View>
              <View className="w-px h-12 bg-border" />
              <View className="items-center flex-1">
                <Text className="text-xs text-muted mb-1">RPE</Text>
                <Text className="text-2xl font-bold text-foreground">{rpe}/10</Text>
              </View>
            </View>
          </View>

          {/* Motivation Message */}
          <View className="bg-primary/10 rounded-lg p-4 w-full border border-primary">
            <Text className="text-sm text-primary font-medium text-center">
              {rpe >= 8
                ? '💪 Excelente esforço! Você está no caminho certo.'
                : rpe >= 6
                  ? '👍 Bom trabalho! Continue assim.'
                  : '🔥 Mais uma série para ir bem!'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="w-full gap-2">
            <TouchableOpacity
              onPress={() => {
                handleClose();
                onNextSet?.();
              }}
              activeOpacity={0.8}
              className="bg-primary rounded-lg py-4"
            >
              <Text className="text-white font-semibold text-center text-lg">
                Próxima Série
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.8}
              className="bg-surface border border-border rounded-lg py-4"
            >
              <Text className="text-foreground font-semibold text-center text-lg">
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
