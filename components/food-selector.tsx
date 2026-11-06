import { numeroDecimal } from "@/lib/utils";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { searchFoods, calculateMacros, type FoodItem } from '@/lib/food-database';

interface FoodSelectorProps {
  visible: boolean;
  onSelect: (food: FoodItem, quantity: number) => void;
  onClose: () => void;
}

export function FoodSelector({ visible, onSelect, onClose }: FoodSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [step, setStep] = useState<'search' | 'quantity'>('search');

  const searchResults = searchQuery.length > 0 ? searchFoods(searchQuery) : [];

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setQuantity(food.defaultQuantity.toString());
    setStep('quantity');
  };

  const handleConfirm = () => {
    const amount = numeroDecimal(quantity);
    if (selectedFood && Number.isFinite(amount) && amount > 0) {
      onSelect(selectedFood, amount);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedFood(null);
    setQuantity('100');
    setStep('search');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!selectedFood) {
    return (
      <Modal visible={visible && step === 'search'} transparent animationType="slide" onRequestClose={handleClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-surface rounded-t-3xl p-6 gap-4 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-foreground">Buscar Alimento</Text>
              <TouchableOpacity onPress={handleClose}>
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View className="flex-row items-center bg-background rounded-lg px-4 py-3 border border-border gap-2">
              <MaterialIcons name="search" size={20} color="#6B7280" />
              <TextInput
                placeholder="Buscar alimento..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-foreground"
                placeholderTextColor="#6B7280"
              />
            </View>

            {/* Search Results */}
            <ScrollView className="flex-1">
              {searchResults.length > 0 ? (
                <View className="gap-2">
                  {searchResults.map((food) => (
                    <TouchableOpacity
                      key={food.id}
                      onPress={() => handleSelectFood(food)}
                      activeOpacity={0.7}
                      className="bg-background rounded-lg p-4 border border-border"
                    >
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-foreground">{food.name}</Text>
                          <Text className="text-xs text-muted mt-1">
                            {food.calories} kcal · {food.protein}g P · {food.carbs}g C · {food.fats}g G
                          </Text>
                          <Text className="text-xs text-muted mt-1">por {food.defaultQuantity}{food.unit}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#A855F7" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : searchQuery.length > 0 ? (
                <View className="items-center justify-center py-8">
                  <MaterialIcons name="search-off" size={48} color="#6B7280" />
                  <Text className="text-muted mt-2">Nenhum alimento encontrado</Text>
                </View>
              ) : (
                <View className="items-center justify-center py-8">
                  <MaterialIcons name="restaurant-menu" size={48} color="#6B7280" />
                  <Text className="text-muted mt-2">Digite para buscar alimentos</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  const macros = calculateMacros(selectedFood, numeroDecimal(quantity) || 0);

  return (
    <Modal visible={visible && step === 'quantity'} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-surface rounded-t-3xl p-6 gap-4">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={() => setStep('search')}>
              <MaterialIcons name="chevron-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground flex-1 text-center">{selectedFood.name}</Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quantity Input */}
          <View className="gap-3">
            <Text className="text-sm font-medium text-muted">Quantidade</Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => {
                  const q = Math.max((numeroDecimal(quantity) || 0) - selectedFood.defaultQuantity, selectedFood.defaultQuantity);
                  setQuantity(q.toString());
                }}
                activeOpacity={0.7}
                className="w-12 h-12 bg-background rounded-lg items-center justify-center border border-border"
              >
                <MaterialIcons name="remove" size={20} color="#A855F7" />
              </TouchableOpacity>

              <View className="flex-1 bg-background rounded-lg px-4 py-3 border border-border">
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="decimal-pad"
                  className="text-center text-lg font-semibold text-foreground"
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  const q = (numeroDecimal(quantity) || 0) + selectedFood.defaultQuantity;
                  setQuantity(q.toString());
                }}
                activeOpacity={0.7}
                className="w-12 h-12 bg-background rounded-lg items-center justify-center border border-border"
              >
                <MaterialIcons name="add" size={20} color="#A855F7" />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-muted text-center">{selectedFood.unit}</Text>
          </View>

          {/* Macros Preview */}
          <View className="bg-background rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground mb-2">Macros (estimado)</Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-secondary">{Math.round(macros.calories)}</Text>
                <Text className="text-xs text-muted">kcal</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">{Math.round(macros.protein)}</Text>
                <Text className="text-xs text-muted">g P</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-secondary">{Math.round(macros.carbs)}</Text>
                <Text className="text-xs text-muted">g C</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-water">{Math.round(macros.fats)}</Text>
                <Text className="text-xs text-muted">g G</Text>
              </View>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.8}
            className="bg-primary rounded-lg py-4 mt-4"
          >
            <Text className="text-white font-semibold text-center text-lg">Adicionar Alimento</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
