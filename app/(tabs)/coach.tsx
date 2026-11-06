import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function CoachScreen() {
  const { coachAnalyses, addAnalysis } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRequestAnalysis = async () => {
    setLoading(true);
    try {
      addAnalysis();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Coach</Text>
            <Text className="text-base text-muted">Resumo dos registros no aparelho</Text>
          </View>

          {/* Request Analysis Button */}
          <TouchableOpacity
            onPress={handleRequestAnalysis}
            disabled={loading}
            activeOpacity={0.8}
            style={undefined}
            className="bg-primary rounded-2xl py-4 flex-row items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <ActivityIndicator color="white" />
                <Text className="text-white font-semibold text-lg">Analisando...</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="auto-awesome" size={24} color="white" />
                <Text className="text-white font-semibold text-lg">Análise da Semana</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Analysis History */}
          {coachAnalyses.length > 0 ? (
            <View className="gap-3">
              <Text className="text-sm font-medium text-muted">Histórico de Análises</Text>
              {coachAnalyses.map((analysis) => (
                  <TouchableOpacity
                    key={analysis.id}
                    onPress={() => setExpandedId(expandedId === analysis.id ? null : analysis.id)}
                    activeOpacity={0.8}
                    style={undefined}
                  >
                  <View className="bg-surface rounded-2xl p-4 border border-border">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-muted">
                          {new Date(analysis.date).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })}
                        </Text>
                        <Text className="text-base font-semibold text-foreground mt-1">
                          {analysis.diagnosis.substring(0, 50)}...
                        </Text>
                      </View>
                      <MaterialIcons
                        name={expandedId === analysis.id ? 'expand-less' : 'expand-more'}
                        size={24}
                        color="#10B981"
                      />
                    </View>

                    {expandedId === analysis.id && (
                      <View className="mt-4 pt-4 border-t border-border gap-3">
                        <View>
                          <Text className="text-sm font-medium text-muted mb-2">Diagnóstico</Text>
                          <Text className="text-sm text-foreground leading-relaxed">
                            {analysis.diagnosis}
                          </Text>
                        </View>

                        <View>
                          <Text className="text-sm font-medium text-muted mb-2">Ações Recomendadas</Text>
                          <View className="gap-2">
                            {analysis.actions.map((action, idx) => (
                              <View key={idx} className="flex-row gap-2">
                                <Text className="text-primary font-bold">{idx + 1}.</Text>
                                <Text className="text-sm text-foreground flex-1">{action}</Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        <View className="bg-background rounded-lg p-3 gap-2">
                          <Text className="text-xs font-medium text-muted">Dados da Semana</Text>
                          <View className="gap-1">
                            <View className="flex-row justify-between">
                              <Text className="text-xs text-muted">Mudança de Peso</Text>
                              <Text className="text-xs font-semibold text-foreground">
                                {analysis.weekData.weightChange > 0 ? '+' : ''}{analysis.weekData.weightChange.toFixed(1)}kg
                              </Text>
                            </View>
                            <View className="flex-row justify-between">
                              <Text className="text-xs text-muted">Média de Calorias</Text>
                              <Text className="text-xs font-semibold text-foreground">
                                {Math.round(analysis.weekData.avgCalories)} kcal
                              </Text>
                            </View>
                            <View className="flex-row justify-between">
                              <Text className="text-xs text-muted">Média de Proteína</Text>
                              <Text className="text-xs font-semibold text-foreground">
                                {Math.round(analysis.weekData.avgProtein)}g
                              </Text>
                            </View>
                            <View className="flex-row justify-between">
                              <Text className="text-xs text-muted">Treinos Realizados</Text>
                              <Text className="text-xs font-semibold text-foreground">
                                {analysis.weekData.workoutsCompleted}
                              </Text>
                            </View>
                            <View className="flex-row justify-between">
                              <Text className="text-xs text-muted">RPE Médio</Text>
                              <Text className="text-xs font-semibold text-foreground">
                                {analysis.weekData.avgRPE.toFixed(1)}/10
                              </Text>
                            </View>
                            <View className="flex-row justify-between">
                              <Text className="text-xs text-muted">Água Consumida</Text>
                              <Text className="text-xs font-semibold text-foreground">
                                {analysis.weekData.waterIntake.toFixed(1)}L
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="bg-surface rounded-2xl p-6 border border-border items-center gap-3">
              <MaterialIcons name="info" size={32} color="#10B981" />
              <Text className="text-base font-semibold text-foreground text-center">
                Nenhuma análise ainda
              </Text>
              <Text className="text-sm text-muted text-center">
                Clique em "Análise da Semana" para receber recomendações personalizadas do seu Coach IA
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
