import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Svg, { Circle } from 'react-native-svg';

export default function HomeScreen() {
  const router = useRouter();
  const { getTodayWorkout, getDailyStats, settings, waterIntake, meals } = useAppStore();
  const todayWorkout = getTodayWorkout();
  const dailyStats = getDailyStats();

  // Calculate percentages
  const caloriePercentage = Math.min((dailyStats.calories / (settings.targetCalories || 3200)) * 100, 100);
  const proteinPercentage = Math.min((dailyStats.protein / (settings.targetProtein || 180)) * 100, 100);
  const carbsPercentage = Math.min((dailyStats.carbs / 420) * 100, 100);
  const fatsPercentage = Math.min((dailyStats.fats / 90) * 100, 100);
  const waterPercentage = Math.min((waterIntake / ((settings.targetWater || 4) * 1000)) * 100, 100);

  // Helper function to create circular progress
  const CircleProgress = ({ percentage, color, size = 100, strokeWidth = 6 }: any) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#2D2D44" strokeWidth={strokeWidth} fill="none" />
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
    );
  };

  const getNextMeal = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    return meals.find((meal) => {
      const [hour, minute] = meal.time.split(':').map(Number);
      const mealTime = hour * 60 + minute;
      return mealTime > currentTime && !meal.consumed;
    });
  };

  const nextMeal = getNextMeal();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row justify-between items-start">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
              <Text className="text-sm text-muted">
                {'Metas ilustrativas da demonstração'}
              </Text>
            </View>
          </View>

          {/* Main Macros Section */}
          <View className="bg-surface rounded-3xl p-6 border border-border gap-6">
            {/* Calories Circle - Center */}
            <View className="items-center">
              <View style={{ width: 140, height: 140, position: 'relative' }}>
                <CircleProgress percentage={caloriePercentage} color="#A855F7" size={140} strokeWidth={8} />
                <View className="absolute inset-0 items-center justify-center">
                  <Text className="text-4xl font-bold text-foreground">{Math.round(dailyStats.calories)}</Text>
                  <Text className="text-xs text-muted">/ {settings.targetCalories || 3200} kcal</Text>
                </View>
              </View>
            </View>

            {/* Macro Rings Grid */}
            <View className="flex-row justify-around items-center">
              {/* Protein */}
              <View className="items-center gap-2">
                <View style={{ width: 90, height: 90, position: 'relative' }}>
                  <CircleProgress percentage={proteinPercentage} color="#A855F7" size={90} strokeWidth={5} />
                  <View className="absolute inset-0 items-center justify-center">
                    <Text className="text-xl font-bold text-foreground">{Math.round(dailyStats.protein)}</Text>
                    <Text className="text-xs text-muted">g</Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">Proteína</Text>
              </View>

              {/* Carbs */}
              <View className="items-center gap-2">
                <View style={{ width: 90, height: 90, position: 'relative' }}>
                  <CircleProgress percentage={carbsPercentage} color="#FBBF24" size={90} strokeWidth={5} />
                  <View className="absolute inset-0 items-center justify-center">
                    <Text className="text-xl font-bold text-foreground">{Math.round(dailyStats.carbs)}</Text>
                    <Text className="text-xs text-muted">g</Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">Carbos</Text>
              </View>

              {/* Fats */}
              <View className="items-center gap-2">
                <View style={{ width: 90, height: 90, position: 'relative' }}>
                  <CircleProgress percentage={fatsPercentage} color="#3B82F6" size={90} strokeWidth={5} />
                  <View className="absolute inset-0 items-center justify-center">
                    <Text className="text-xl font-bold text-foreground">{Math.round(dailyStats.fats)}</Text>
                    <Text className="text-xs text-muted">g</Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">Gordura</Text>
              </View>
            </View>

            {/* Water */}
            <View className="gap-2 pt-4 border-t border-border">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="water-drop" size={16} color="#0EA5E9" />
                  <Text className="text-sm text-muted">Água</Text>
                </View>
                <Text className="text-sm font-semibold text-secondary">{(waterIntake / 1000).toFixed(1)}L / {settings.targetWater || 4}L</Text>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full bg-water"
                  style={{
                    width: `${waterPercentage}%`,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Next Meal */}
          {nextMeal && (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/comida')}
              activeOpacity={0.7}
              className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text className="text-sm text-muted">Próxima Refeição</Text>
                <Text className="text-lg font-semibold text-foreground mt-1">{nextMeal.name}</Text>
                <Text className="text-xs text-muted mt-1">{nextMeal.time}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#A855F7" />
            </TouchableOpacity>
          )}

          {/* Today's Workout */}
          {todayWorkout && (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/treino')}
              activeOpacity={0.7}
              className="bg-surface rounded-2xl p-4 border border-border"
            >
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text className="text-sm text-muted">Treino de Hoje</Text>
                  <Text className="text-lg font-semibold text-foreground mt-1">{todayWorkout.name}</Text>
                </View>
                <MaterialIcons name="fitness-center" size={24} color="#10B981" />
              </View>
              <View className="gap-2">
                {todayWorkout.exercises.slice(0, 3).map((exercise) => (
                  <View key={exercise.id} className="flex-row items-center gap-2">
                    <View className="w-1 h-1 rounded-full bg-primary" />
                    <Text className="text-sm text-muted flex-1">{exercise.name}</Text>
                    <Text className="text-xs text-secondary">{exercise.sets.length} séries</Text>
                  </View>
                ))}
                {todayWorkout.exercises.length > 3 && (
                  <Text className="text-xs text-muted mt-1">+ {todayWorkout.exercises.length - 3} mais</Text>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* Quick Actions */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/comida')}
              activeOpacity={0.7}
              className="flex-1 bg-primary rounded-lg py-3 items-center"
            >
              <MaterialIcons name="restaurant" size={20} color="#FFFFFF" />
              <Text className="text-white text-xs font-semibold mt-1">Comida</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/treino')}
              activeOpacity={0.7}
              className="flex-1 bg-primary rounded-lg py-3 items-center"
            >
              <MaterialIcons name="fitness-center" size={20} color="#FFFFFF" />
              <Text className="text-white text-xs font-semibold mt-1">Treino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/evolucao')}
              activeOpacity={0.7}
              className="flex-1 bg-primary rounded-lg py-3 items-center"
            >
              <MaterialIcons name="trending-up" size={20} color="#FFFFFF" />
              <Text className="text-white text-xs font-semibold mt-1">Evolução</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
