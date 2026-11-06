import { numeroDecimal } from "@/lib/utils";
import { ScrollView, Text, View, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAppStore, type Medida } from '@/lib/store';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function EvolucaoScreen() {
  const { weights, measurements, addWeight, addMeasurement, settings } = useAppStore();
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [weightValue, setWeightValue] = useState('');
  const [showAddMeasure, setShowAddMeasure] = useState(false);
  const [measureType, setMeasureType] = useState('');
  const [measureValue, setMeasureValue] = useState('');

  const measureTypes = [
    { id: 'biceps_right', label: 'Bíceps Direito' },
    { id: 'biceps_left', label: 'Bíceps Esquerdo' },
    { id: 'chest', label: 'Peito' },
    { id: 'waist', label: 'Cintura' },
    { id: 'thigh', label: 'Coxa' },
    { id: 'calf', label: 'Panturrilha' },
  ];

  const handleAddWeight = () => {
    const peso = numeroDecimal(weightValue);
    if (!Number.isFinite(peso) || peso <= 0) {
      Alert.alert('Erro', 'Digite o peso');
      return;
    }

    const newWeight = {
      id: Date.now().toString(),
      weight: peso,
      date: new Date().toISOString(),
    };

    addWeight(newWeight);
    setWeightValue('');
    setShowAddWeight(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleAddMeasure = () => {
    const medida = numeroDecimal(measureValue);
    if (!measureType || !Number.isFinite(medida) || medida <= 0) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const newMeasure = {
      id: Date.now().toString(),
      type: measureType,
      value: medida,
      date: new Date().toISOString(),
    };

    addMeasurement(newMeasure);
    setMeasureType('');
    setMeasureValue('');
    setShowAddMeasure(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getLatestMeasurements = () => {
    const latest: Record<string, Medida[]> = {};
    measureTypes.forEach((type) => {
      const measures = measurements.filter((m) => m.type === type.id).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      if (measures.length > 0) {
        latest[type.id] = measures.slice(0, 3);
      }
    });
    return latest;
  };

  const latestMeasurements = getLatestMeasurements();
  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weight : settings.currentWeight;
  const intervalo = settings.goalWeight - settings.currentWeight;
  const progressPercent = intervalo === 0 ? 100 : Math.max(0, Math.min(100,
    (currentWeight - settings.currentWeight) / intervalo * 100));

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Evolução Física</Text>
            <Text className="text-base text-muted">Acompanhe seu progresso</Text>
          </View>

          {/* Weight Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="gap-3 mb-4">
              <Text className="text-sm font-medium text-muted">Peso Atual</Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-4xl font-bold text-foreground">{currentWeight.toFixed(1)}</Text>
                <Text className="text-lg text-muted">kg</Text>
              </View>
              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Meta: {settings.goalWeight}kg</Text>
                  <Text className="text-sm font-medium text-primary">
                    {Math.max(0, Math.min(100, progressPercent)).toFixed(0)}%
                  </Text>
                </View>
                <View className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.max(0, Math.min(100, progressPercent))}%`,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Weight History */}
            {weights.length > 1 && (
              <View className="border-t border-border pt-4">
                <Text className="text-xs font-medium text-muted mb-2">Histórico Recente</Text>
                <View className="gap-1">
                  {weights.slice(-3).reverse().map((w, idx) => (
                    <View key={w.id} className="flex-row justify-between">
                      <Text className="text-xs text-muted">
                        {new Date(w.date).toLocaleDateString('pt-BR')}
                      </Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {w.weight.toFixed(1)}kg
                        {idx > 0 && weights.length > 1 && (
                          <Text className={`text-xs ${
                            w.weight > weights[weights.length - 2 - idx].weight
                              ? 'text-primary'
                              : 'text-error'
                          }`}>
                            {' '}({w.weight > weights[weights.length - 2 - idx].weight ? '+' : ''}{(w.weight - weights[weights.length - 2 - idx].weight).toFixed(1)}kg)
                          </Text>
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Add Weight Button */}
          <TouchableOpacity
            onPress={() => setShowAddWeight(true)}
            activeOpacity={0.8}
            style={undefined}
            className="bg-primary rounded-lg py-3"
          >
            <Text className="text-white font-semibold text-center">Registrar Peso</Text>
          </TouchableOpacity>

          {/* Measurements */}
          <View className="gap-3">
            <Text className="text-sm font-medium text-muted">Medidas Corporais</Text>
            {measureTypes.map((type) => {
              const typeMeasures = latestMeasurements[type.id] || [];
              return (
                <View key={type.id} className="bg-surface rounded-2xl p-4 border border-border">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-base font-semibold text-foreground">{type.label}</Text>
                    {typeMeasures.length > 0 && (
                      <Text className="text-base font-bold text-primary">
                        {typeMeasures[0].value.toFixed(1)}cm
                      </Text>
                    )}
                  </View>
                  {typeMeasures.length > 0 && (
                    <View className="gap-1">
                      {typeMeasures.map((m, idx) => (
                        <Text key={m.id} className="text-xs text-muted">
                          {new Date(m.date).toLocaleDateString('pt-BR')} - {m.value.toFixed(1)}cm
                          {idx > 0 && (
                            <Text className={`text-xs ${
                              m.value > typeMeasures[idx - 1].value
                                ? 'text-primary'
                                : 'text-error'
                            }`}>
                              {' '}({m.value > typeMeasures[idx - 1].value ? '+' : ''}{(m.value - typeMeasures[idx - 1].value).toFixed(1)}cm)
                            </Text>
                          )}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Add Measurement Button */}
          <TouchableOpacity
            onPress={() => setShowAddMeasure(true)}
            activeOpacity={0.8}
            style={undefined}
            className="bg-primary rounded-lg py-3"
          >
            <Text className="text-white font-semibold text-center">Adicionar Medida</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Weight Modal */}
      <Modal visible={showAddWeight} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-foreground">Registrar Peso</Text>
              <TouchableOpacity onPress={() => setShowAddWeight(false)}>
                <MaterialIcons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-sm font-medium text-muted mb-2">Peso (kg)</Text>
              <TextInput
                placeholder="Ex: 70.5"
                value={weightValue}
                onChangeText={setWeightValue}
                keyboardType="decimal-pad"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#6B7280"
              />
            </View>

            <TouchableOpacity
              onPress={handleAddWeight}
              activeOpacity={0.8}
              style={undefined}
              className="bg-primary rounded-lg py-4 mt-4"
            >
              <Text className="text-white font-semibold text-center text-lg">Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Measurement Modal */}
      <Modal visible={showAddMeasure} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-foreground">Adicionar Medida</Text>
              <TouchableOpacity onPress={() => setShowAddMeasure(false)}>
                <MaterialIcons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-sm font-medium text-muted mb-2">Tipo de Medida</Text>
              <View className="flex-row flex-wrap gap-2">
                {measureTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => setMeasureType(type.id)}
                    activeOpacity={0.8}
                    className={`px-3 py-2 rounded-lg border ${
                      measureType === type.id
                        ? 'bg-primary border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        measureType === type.id ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-muted mb-2">Valor (cm)</Text>
              <TextInput
                placeholder="Ex: 32.5"
                value={measureValue}
                onChangeText={setMeasureValue}
                keyboardType="decimal-pad"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#6B7280"
              />
            </View>

            <TouchableOpacity
              onPress={handleAddMeasure}
              activeOpacity={0.8}
              style={undefined}
              className="bg-primary rounded-lg py-4 mt-4"
            >
              <Text className="text-white font-semibold text-center text-lg">Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
