import { numeroDecimal } from "@/lib/utils";
import { ScrollView, Text, View, TouchableOpacity, Pressable, Modal, TextInput, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Svg, { Circle } from 'react-native-svg';

export default function ComidaScreen() {
  const { meals, toggleMealConsumed, addWater, waterIntake, settings, getDailyStats, addFoodToMeal } = useAppStore();
  const dailyStats = getDailyStats();
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');

  const handleToggleMeal = (mealId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleMealConsumed(mealId);
  };

  const handleAddWater = (amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addWater(amount);
  };

  const handleAddFood = () => {
    const calorias = numeroDecimal(foodCalories);
    const proteina = foodProtein.trim() ? numeroDecimal(foodProtein) : 0;
    if (!foodName.trim() || !Number.isFinite(calorias) || !Number.isFinite(proteina) || !selectedMealId) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const newFood = {
      id: Date.now().toString(),
      name: foodName.trim(),
      quantity: 1,
      unit: 'unidade',
      calories: calorias,
      protein: proteina,
      carbs: 0,
      fats: 0,
    };

    addFoodToMeal(selectedMealId, newFood);
    setFoodName('');
    setFoodCalories('');
    setFoodProtein('');
    setSelectedMealId(null);
    setShowAddFood(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getMealCheckboxColor = (mealName: string) => {
    const colorMap: Record<string, string> = {
      'Café da manhã': '#A855F7',
      'Lanche da manhã': '#FBBF24',
      'Almoço': '#3B82F6',
      'Pré-treino': '#10B981',
      'Pós-treino': '#EF4444',
      'Jantar': '#8B5CF6',
      'Ceia': '#6B7280',
    };
    return colorMap[mealName] || '#A855F7';
  };

  const getMealIconName = (mealName: string) => {
    const iconMap: Record<string, string> = {
      'Café da manhã': 'coffee',
      'Lanche da manhã': 'fastfood',
      'Almoço': 'restaurant',
      'Pré-treino': 'fitness-center',
      'Pós-treino': 'local-dining',
      'Jantar': 'dinner-dining',
      'Ceia': 'bedtime',
    };
    return iconMap[mealName] || 'restaurant';
  };

  // Circular progress for calories
  const caloriePercentage = Math.min((dailyStats.calories / (settings.targetCalories || 3200)) * 100, 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (caloriePercentage / 100) * circumference;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Nutrição</Text>
            <Text className="text-sm text-muted">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>

          {/* Macros Summary with Circular Progress */}
          <View className="bg-surface rounded-3xl p-6 border border-border gap-4">
            {/* Calories Circle + Macros */}
            <View className="flex-row items-center gap-6">
              {/* Circular Progress */}
              <View style={{ width: 120, height: 120, position: 'relative' }}>
                <Svg width={120} height={120} viewBox="0 0 120 120">
                  {/* Background circle */}
                  <Circle
                    cx={60}
                    cy={60}
                    r={radius}
                    stroke="#2D2D44"
                    strokeWidth={8}
                    fill="none"
                  />
                  {/* Progress circle */}
                  <Circle
                    cx={60}
                    cy={60}
                    r={radius}
                    stroke="#A855F7"
                    strokeWidth={8}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation={-90}
                    originX={60}
                    originY={60}
                  />
                </Svg>
                {/* Center text */}
                <View className="absolute inset-0 items-center justify-center">
                  <Text className="text-3xl font-bold text-foreground">{Math.round(dailyStats.calories)}</Text>
                  <Text className="text-xs text-muted">kcal</Text>
                </View>
              </View>

              {/* Macro Bars */}
              <View className="flex-1 gap-3">
                {/* Protein */}
                <View className="gap-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-muted">Proteína</Text>
                    <Text className="text-sm font-semibold text-secondary">{Math.round(dailyStats.protein)}g</Text>
                  </View>
                  <View className="h-2 bg-border rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((dailyStats.protein / (settings.targetProtein || 180)) * 100, 100)}%`,
                        backgroundColor: '#A855F7',
                      }}
                    />
                  </View>
                  <Text className="text-xs text-muted">/ 180g</Text>
                </View>

                {/* Carbs */}
                <View className="gap-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-muted">Carboidrato</Text>
                    <Text className="text-sm font-semibold text-secondary">{Math.round(dailyStats.carbs)}g</Text>
                  </View>
                  <View className="h-2 bg-border rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((dailyStats.carbs / 420) * 100, 100)}%`,
                        backgroundColor: '#FBBF24',
                      }}
                    />
                  </View>
                  <Text className="text-xs text-muted">/ 420g</Text>
                </View>

                {/* Fat */}
                <View className="gap-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-muted">Gordura</Text>
                    <Text className="text-sm font-semibold text-secondary">{Math.round(dailyStats.fats)}g</Text>
                  </View>
                  <View className="h-2 bg-border rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((dailyStats.fats / 90) * 100, 100)}%`,
                        backgroundColor: '#3B82F6',
                      }}
                    />
                  </View>
                  <Text className="text-xs text-muted">/ 90g</Text>
                </View>
              </View>
            </View>

            {/* Water Intake */}
            <View className="gap-2 pt-4 border-t border-border">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="water-drop" size={16} color="#0EA5E9" />
                  <Text className="text-sm text-muted">Água</Text>
                </View>
                <Text className="text-sm font-semibold text-secondary">{(waterIntake / 1000).toFixed(1)}L</Text>
              </View>
              <View className="flex-row gap-1">
                {[...Array(8)].map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleAddWater(500)}
                    activeOpacity={0.7}
                    className={`flex-1 h-6 rounded-full ${
                      i < Math.ceil(waterIntake / 500) ? 'bg-water' : 'bg-border'
                    }`}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Meals Section */}
          <View className="gap-3">
            <Text className="text-xs font-semibold text-muted uppercase tracking-wider">Refeições de Hoje</Text>
            {meals.map((meal) => {
              const mealCalories = meal.foods?.reduce((sum, f) => sum + f.calories, 0) || 0;
              const checkboxColor = getMealCheckboxColor(meal.name);
              
              return (
                <TouchableOpacity
                  key={meal.id}
                  onPress={() => handleToggleMeal(meal.id)}
                  activeOpacity={0.7}
                >
                  <View className={`bg-surface rounded-2xl p-4 border border-border ${
                    meal.consumed ? 'opacity-60' : ''
                  }`}>
                    <View className="flex-row items-center justify-between">
                      {/* Checkbox + Meal Name */}
                      <View className="flex-row items-center gap-3 flex-1">
                        <View
                          className={`w-5 h-5 rounded border-2 items-center justify-center ${
                            meal.consumed ? '' : 'border-border'
                          }`}
                          style={{
                            borderColor: meal.consumed ? checkboxColor : '#2D2D44',
                            backgroundColor: meal.consumed ? checkboxColor : 'transparent',
                          }}
                        >
                          {meal.consumed && (
                            <MaterialIcons name="check" size={14} color="#FFFFFF" />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-foreground">{meal.name}</Text>
                          <Text className="text-xs text-muted">{meal.time} · {meal.consumed ? 'concluído' : 'próxima refeição'}</Text>
                        </View>
                      </View>

                      {/* Calories + Icon */}
                      <View className="items-end gap-2">
                        <Text className="text-base font-semibold text-secondary">{Math.round(mealCalories)}</Text>
                        <Text className="text-xs text-muted">kcal</Text>
                      </View>
                    </View>

                    {/* Meal Details - Expanded */}
                    {meal.foods && meal.foods.length > 0 && (
                      <View className="mt-3 pt-3 border-t border-border/50 gap-2">
                        {meal.foods.map((food) => (
                          <View key={food.id} className="flex-row justify-between items-center">
                            <Text className="text-xs text-muted flex-1">{food.name}</Text>
                            <View className="flex-row gap-2">
                              <Text className="text-xs text-secondary">{Math.round(food.calories)}C</Text>
                              {food.protein > 0 && <Text className="text-xs text-primary">{Math.round(food.protein)}P</Text>}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Add Food Modal */}
      <Modal visible={showAddFood} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-surface rounded-t-3xl p-6 gap-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-foreground">Adicionar Alimento</Text>
              <TouchableOpacity onPress={() => setShowAddFood(false)}>
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-sm font-medium text-muted mb-2">Nome do Alimento</Text>
              <TextInput
                placeholder="Ex: Frango grelhado"
                value={foodName}
                onChangeText={setFoodName}
                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-muted mb-2">Calorias</Text>
              <TextInput
                placeholder="Ex: 250"
                value={foodCalories}
                onChangeText={setFoodCalories}
                keyboardType="number-pad"
                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-muted mb-2">Proteína (g)</Text>
              <TextInput
                placeholder="Ex: 35"
                value={foodProtein}
                onChangeText={setFoodProtein}
                keyboardType="number-pad"
                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#6B7280"
              />
            </View>

            <TouchableOpacity
              onPress={handleAddFood}
              activeOpacity={0.8}
              className="bg-primary rounded-lg py-4 mt-4"
            >
              <Text className="text-white font-semibold text-center text-lg">Salvar Alimento</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
