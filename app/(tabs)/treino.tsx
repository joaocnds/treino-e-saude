import { numeroDecimal } from "@/lib/utils";
import { ScrollView, Text, View, TouchableOpacity, Pressable, Modal, TextInput, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { RestTimer } from '@/components/rest-timer';
import { ExerciseCompletionModal } from '@/components/exercise-completion-modal';

export default function TreinoScreen() {
  const { getTodayWorkout, addExerciseSet } = useAppStore();
  const todayWorkout = getTodayWorkout();
  const [showAddSet, setShowAddSet] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('5');
  const [showTimer, setShowTimer] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [lastSetData, setLastSetData] = useState<{ weight: number; reps: number; rpe: number; exerciseName: string } | null>(null);

  const handleAddSet = () => {
    const peso = numeroDecimal(weight);
    const repeticoes = numeroDecimal(reps);
    const esforco = numeroDecimal(rpe);
    if (!Number.isFinite(peso) || !Number.isSafeInteger(repeticoes) || repeticoes <= 0
      || !Number.isSafeInteger(esforco) || esforco < 1 || esforco > 10 || !selectedExerciseId || !todayWorkout) {
      Alert.alert('Erro', 'Informe peso, repetições inteiras e esforço de 1 a 10.');
      return;
    }

    const newSet = {
      id: Date.now().toString(),
      weight: peso,
      reps: repeticoes,
      rpe: esforco,
      date: new Date().toISOString(),
    };

    const exercise = todayWorkout.exercises.find((e) => e.id === selectedExerciseId);
    const exerciseName = exercise?.name || 'Exercício';

    addExerciseSet(todayWorkout.id, selectedExerciseId, newSet);
    
    setLastSetData({
      weight: peso,
      reps: repeticoes,
      rpe: esforco,
      exerciseName,
    });
    setShowCompletion(true);
    
    setWeight('');
    setReps('');
    setRpe('5');
    setSelectedExerciseId(null);
    setShowAddSet(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getLastSet = (exerciseId: string) => {
    if (!todayWorkout) return null;
    const exercise = todayWorkout.exercises.find((e) => e.id === exerciseId);
    if (!exercise || exercise.sets.length === 0) return null;
    return exercise.sets[exercise.sets.length - 1];
  };

  const getSuggestion = (exerciseId: string) => {
    const lastSet = getLastSet(exerciseId);
    if (!lastSet) return null;

    const { weight: lastWeight, reps: lastReps, rpe: lastRpe } = lastSet;

    if (lastRpe <= 6 && lastReps >= 10) {
      return {
        weight: (lastWeight + 2.5).toFixed(1),
        reps: lastReps,
        message: `Próximo: ${(lastWeight + 2.5).toFixed(1)}kg x ${lastReps}`,
      };
    } else if (lastRpe <= 7 && lastReps >= 10) {
      return {
        weight: lastWeight,
        reps: lastReps + 1,
        message: `Próximo: ${lastWeight}kg x ${lastReps + 1}`,
      };
    }
    return null;
  };

  if (!todayWorkout) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="fitness-center" size={64} color="#6B7280" />
          <Text className="text-2xl font-bold text-foreground mt-4">Descanso</Text>
          <Text className="text-base text-muted text-center mt-2">
            Você não tem treino agendado para hoje
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">{todayWorkout.name}</Text>
            <Text className="text-sm text-muted">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>

          {/* Exercises List */}
          <View className="gap-3">
            {todayWorkout.exercises.map((exercise) => {
              const lastSet = getLastSet(exercise.id);
              const suggestion = getSuggestion(exercise.id);

              return (
                <View key={exercise.id} className="bg-surface rounded-2xl p-4 border border-border gap-3">
                  {/* Exercise Header */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">{exercise.name}</Text>
                      <Text className="text-xs text-muted mt-1">{exercise.sets.length} série(s) registrada(s)</Text>
                    </View>
                    <View className="bg-primary px-3 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-white">{exercise.sets.length}</Text>
                    </View>
                  </View>

                  {/* Last Set Info */}
                  {lastSet && (
                    <View className="bg-background rounded-lg p-3 gap-2">
                      <Text className="text-xs text-muted font-medium">Última série</Text>
                      <View className="flex-row justify-between">
                        <View className="items-center">
                          <Text className="text-lg font-bold text-secondary">{lastSet.weight}</Text>
                          <Text className="text-xs text-muted">kg</Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-lg font-bold text-secondary">{lastSet.reps}</Text>
                          <Text className="text-xs text-muted">reps</Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-lg font-bold text-secondary">{lastSet.rpe}</Text>
                          <Text className="text-xs text-muted">RPE</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Suggestion */}
                  {suggestion && (
                    <View className="bg-background/50 rounded-lg p-3 gap-1 border border-border/50">
                      <Text className="text-xs text-muted font-medium">Sugestão de progressão</Text>
                      <View className="flex-row gap-2">
                        <View className="flex-1 items-center">
                          <Text className="text-sm font-bold text-primary">{suggestion.weight}kg</Text>
                        </View>
                        <MaterialIcons name="arrow-forward" size={16} color="#A855F7" />
                        <View className="flex-1 items-center">
                          <Text className="text-sm font-bold text-primary">{suggestion.reps} reps</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Add Set Button */}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedExerciseId(exercise.id);
                      if (suggestion) {
                        setWeight(suggestion.weight.toString());
                        setReps(suggestion.reps.toString());
                      }
                      setShowAddSet(true);
                    }}
                    activeOpacity={0.7}
                    className="bg-primary rounded-lg py-3 items-center flex-row justify-center gap-2"
                  >
                    <MaterialIcons name="add" size={20} color="#FFFFFF" />
                    <Text className="text-white font-semibold">Registrar Série</Text>
                  </TouchableOpacity>

                  {/* Set History */}
                  {exercise.sets.length > 0 && (
                    <View className="gap-2 pt-2 border-t border-border/50">
                      <Text className="text-xs text-muted font-medium">Histórico</Text>
                      {exercise.sets.slice(-3).reverse().map((set, idx) => (
                        <View key={idx} className="flex-row justify-between items-center py-2 px-2 bg-background/50 rounded">
                          <Text className="text-xs text-muted">Série {exercise.sets.length - idx}</Text>
                          <View className="flex-row gap-3">
                            <Text className="text-xs text-secondary font-semibold">{set.weight}kg</Text>
                            <Text className="text-xs text-secondary font-semibold">{set.reps}x</Text>
                            <Text className="text-xs text-secondary font-semibold">RPE {set.rpe}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Add Set Modal */}
      <Modal visible={showAddSet} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-surface rounded-t-3xl p-6 gap-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-foreground">Registrar Série</Text>
              <TouchableOpacity onPress={() => setShowAddSet(false)}>
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Weight Input */}
            <View>
              <Text className="text-sm font-medium text-muted mb-2">Peso (kg)</Text>
              <TextInput
                placeholder="Ex: 70"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#6B7280"
              />
            </View>

            {/* Reps Input */}
            <View>
              <Text className="text-sm font-medium text-muted mb-2">Repetições</Text>
              <TextInput
                placeholder="Ex: 8"
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#6B7280"
              />
            </View>

            {/* RPE Selector */}
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-medium text-muted">RPE (Esforço Percebido)</Text>
                <View className="bg-primary px-3 py-1 rounded-full">
                  <Text className="text-sm font-bold text-white">{rpe}/10</Text>
                </View>
              </View>
              <View className="flex-row gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => setRpe(value.toString())}
                    activeOpacity={0.7}
                    className={`flex-1 py-2 rounded-lg border ${
                      numeroDecimal(rpe) === value
                        ? 'bg-primary border-primary'
                        : 'bg-background border-border'
                    }`}
                  >
                    <Text className={`text-xs font-semibold text-center ${
                      numeroDecimal(rpe) === value ? 'text-white' : 'text-muted'
                    }`}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={handleAddSet}
              activeOpacity={0.8}
              className="bg-primary rounded-lg py-4 mt-4"
            >
              <Text className="text-white font-semibold text-center text-lg">Salvar Série</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Completion Modal */}
      {lastSetData && (
        <ExerciseCompletionModal
          visible={showCompletion}
          exerciseName={lastSetData.exerciseName}
          weight={lastSetData.weight}
          reps={lastSetData.reps}
          rpe={lastSetData.rpe}
          onClose={() => setShowCompletion(false)}
          onNextSet={() => {
            setShowCompletion(false);
            setShowTimer(true);
          }}
        />
      )}

      {/* Rest Timer */}
      <Modal visible={showTimer} transparent animationType="slide">
        <View className="flex-1 bg-background justify-end">
          <View className="p-6 gap-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-foreground">Tempo de Descanso</Text>
              <TouchableOpacity onPress={() => setShowTimer(false)}>
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <RestTimer
              defaultSeconds={90}
              onComplete={() => {
                setTimeout(() => setShowTimer(false), 2000);
              }}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
