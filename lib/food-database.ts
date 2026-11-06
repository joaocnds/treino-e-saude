export type FoodItem = {
  id: string; name: string; defaultQuantity: number; unit: string;
  calories: number; protein: number; carbs: number; fats: number;
};

// Porções de exemplo para demonstrar o cálculo.
const foods: FoodItem[] = [
  { id: "frango", name: "Peito de frango", defaultQuantity: 100, unit: "g", calories: 165, protein: 31, carbs: 0, fats: 4 },
  { id: "ovo", name: "Ovo", defaultQuantity: 100, unit: "g", calories: 155, protein: 13, carbs: 1, fats: 11 },
  { id: "banana", name: "Banana", defaultQuantity: 100, unit: "g", calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  { id: "aveia", name: "Aveia", defaultQuantity: 100, unit: "g", calories: 389, protein: 16.9, carbs: 66, fats: 7 },
];
export function searchFoods(query: string) {
  const normalizar = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return foods.filter(item => normalizar(item.name).includes(normalizar(query.trim())));
}
export function calculateMacros(item: FoodItem, quantidade: number) {
  const proporcao = Number.isFinite(quantidade) && quantidade > 0 ? quantidade / item.defaultQuantity : 0;
  return { calories: item.calories * proporcao, protein: item.protein * proporcao,
    carbs: item.carbs * proporcao, fats: item.fats * proporcao };
}
