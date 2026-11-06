import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Macros = { calories: number; protein: number; carbs: number; fats: number };
type Food = Macros & { id: string; name: string; quantity: number; unit: string };
type Meal = { id: string; name: string; time: string; foods: Food[]; consumed: boolean };
type Serie = { id: string; weight: number; reps: number; rpe: number; date: string };
type Exercicio = { id: string; name: string; sets: Serie[] };
type Treino = { id: string; name: string; exercises: Exercicio[] };
type Peso = { id: string; date: string; weight: number };
export type Medida = { id: string; date: string; type: string; value: number };
type Dia = Macros & { water: number };
type Analise = {
  id: string; date: string; diagnosis: string; actions: string[];
  weekData: { weightChange: number; avgCalories: number; avgProtein: number;
    workoutsCompleted: number; avgRPE: number; waterIntake: number };
};
type Estado = {
  dia: string;
  meals: Meal[];
  waterIntake: number;
  dias: Record<string, Dia>;
  workouts: Treino[];
  weights: Peso[];
  measurements: Medida[];
  coachAnalyses: Analise[];
  settings: { goalWeight: number; currentWeight: number; targetCalories: number; targetProtein: number; targetWater: number };
  syncDay: () => void;
  toggleMealConsumed: (id: string) => void;
  addWater: (ml: number) => void;
  addFoodToMeal: (id: string, food: Food) => void;
  addExerciseSet: (treinoId: string, exercicioId: string, serie: Serie) => void;
  addWeight: (peso: Peso) => void;
  addMeasurement: (medida: Medida) => void;
  getDailyStats: () => Macros;
  getTodayWorkout: () => Treino | undefined;
  addAnalysis: () => void;
};

function chaveDia(data = new Date()) {
  return [data.getFullYear(), data.getMonth() + 1, data.getDate()]
    .map(n => String(n).padStart(2, "0")).join("-");
}
const refeicoes = (): Meal[] => [
  ["cafe", "Café da manhã", "07:00"], ["lanche", "Lanche da manhã", "10:00"],
  ["almoco", "Almoço", "12:30"], ["pre", "Pré-treino", "15:30"], ["pos", "Pós-treino", "18:00"],
  ["jantar", "Jantar", "20:00"], ["ceia", "Ceia", "22:00"],
].map(([id, name, time]) => ({ id, name, time, foods: [], consumed: false }));

function macros(meals: Meal[]): Macros {
  return meals.filter(meal => meal.consumed).flatMap(meal => meal.foods).reduce((total, item) => ({
    calories: total.calories + item.calories, protein: total.protein + item.protein,
    carbs: total.carbs + item.carbs, fats: total.fats + item.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
}

export const useAppStore = create<Estado>()(persist((set, get) => ({
  dia: chaveDia(), meals: refeicoes(), waterIntake: 0, dias: {},
  workouts: [{ id: "demo", name: "Treino de demonstração", exercises: ["Supino", "Remada", "Agachamento"]
    .map((name, index) => ({ id: String(index + 1), name, sets: [] })) }],
  weights: [], measurements: [], coachAnalyses: [],
  settings: { goalWeight: 80, currentWeight: 70.2, targetCalories: 3200, targetProtein: 180, targetWater: 4 },
  syncDay: () => {
    const hoje = chaveDia();
    if (get().dia === hoje) return;
    set(s => {
      const anterior = { ...macros(s.meals), water: s.waterIntake };
      const dias = Object.fromEntries(Object.entries({ ...s.dias, [s.dia]: anterior })
        .sort(([a], [b]) => a.localeCompare(b)).slice(-30));
      return { dia: hoje, meals: refeicoes(), waterIntake: 0, dias };
    });
  },
  toggleMealConsumed: id => {
    get().syncDay();
    set(s => ({ meals: s.meals.map(m => m.id === id ? { ...m, consumed: !m.consumed } : m) }));
  },
  addWater: ml => {
    if (!Number.isFinite(ml) || ml <= 0) return;
    get().syncDay();
    set(s => ({ waterIntake: s.waterIntake + ml }));
  },
  addFoodToMeal: (id, food) => {
    get().syncDay();
    set(s => ({ meals: s.meals.map(m => m.id === id ? { ...m, foods: [...m.foods, food] } : m) }));
  },
  addExerciseSet: (treinoId, exercicioId, serie) => set(s => ({
    workouts: s.workouts.map(t => t.id !== treinoId ? t : { ...t,
      exercises: t.exercises.map(e => e.id !== exercicioId ? e : { ...e, sets: [...e.sets, serie] }) }),
  })),
  addWeight: peso => set(s => ({ weights: [...s.weights, peso] })),
  addMeasurement: medida => set(s => ({ measurements: [...s.measurements, medida] })),
  getDailyStats: () => macros(get().meals),
  getTodayWorkout: () => get().workouts[0],
  addAnalysis: () => {
    get().syncDay();
    const s = get();
    const agora = new Date();
    const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 6);
    const dias = Object.entries(s.dias).filter(([key]) => key >= chaveDia(inicio) && key < s.dia).map(([, row]) => row);
    dias.push({ ...s.getDailyStats(), water: s.waterIntake });
    const series = s.workouts.flatMap(t => t.exercises.flatMap(e => e.sets)).filter(serie => new Date(serie.date) >= inicio);
    const pesos = s.weights.filter(peso => new Date(peso.date) >= inicio);
    const media = (key: keyof Dia) => dias.reduce((total, d) => total + d[key], 0) / dias.length;
    const analise: Analise = {
      id: String(agora.getTime()), date: agora.toISOString(),
      diagnosis: "Resumo local dos registros dos últimos sete dias.",
      actions: [series.length + " série(s) registrada(s).", pesos.length + " registro(s) de peso."],
      weekData: {
        weightChange: pesos.length > 1 ? pesos[pesos.length - 1].weight - pesos[0].weight : 0,
        avgCalories: media("calories"), avgProtein: media("protein"),
        workoutsCompleted: new Set(series.map(serie => chaveDia(new Date(serie.date)))).size,
        avgRPE: series.length ? series.reduce((soma, serie) => soma + serie.rpe, 0) / series.length : 0,
        waterIntake: media("water") / 1000,
      },
    };
    set({ coachAnalyses: [analise, ...s.coachAnalyses] });
  },
}), {
  name: "etec-treino-e-saude",
  storage: createJSONStorage(() => AsyncStorage),
  onRehydrateStorage: () => estado => estado?.syncDay(),
}));
