# Evolução Física & Saúde - Documentação de Implementação

**Versão**: 2.0  
**Data**: 10 de junho de 2026  
**Status**: MVP Completo com Design Dark Mode

---

## 📋 Sumário Executivo

Aplicativo mobile de rastreamento de treino, nutrição e evolução física com coach inteligente. Desenvolvido com **React Native + Expo**, **Zustand** para estado, **localStorage** para persistência, e **design dark mode** inspirado em Apple Health.

**Stack Técnico:**
- React Native 0.81 + Expo 54
- TypeScript 5.9
- Tailwind CSS (NativeWind 4)
- Zustand (state management)
- Vitest (testes)
- Tipografia: SF Pro Display (Apple)

---

## 🎨 Design System

### Paleta de Cores (Dark Mode)

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Background** | `#0F0F0F` | Fundo principal (quase preto) |
| **Surface** | `#1A1A2E` | Cards, superfícies elevadas |
| **Foreground** | `#FFFFFF` | Texto principal |
| **Muted** | `#6B7280` | Texto secundário |
| **Border** | `#2D2D44` | Divisores, bordas |
| **Primary** | `#A855F7` | Roxo/Magenta (acentos) |
| **Secondary** | `#FBBF24` | Amarelo/Ouro (números) |
| **Water** | `#0EA5E9` | Azul (água) |
| **Success** | `#10B981` | Verde (sucesso) |
| **Error** | `#EF4444` | Vermelho (erros) |

### Tipografia

- **Font**: SF Pro Display (Apple system font via `-apple-system` stack)
- **Tamanhos**:
  - Títulos: 28-32px, bold
  - Subtítulos: 18px, semibold
  - Corpo: 16px, regular
  - Labels: 14px, medium
  - Pequeno: 12px, regular

---

## 📱 Estrutura de Telas

### 1. **Dashboard (Hoje)**

**Arquivo**: `app/(tabs)/index.tsx`

**Funcionalidades**:
- Anéis de progresso circulares para calorias e macros
- Circular progress roxo para calorias (centro)
- 3 anéis menores para Proteína (roxo), Carbos (amarelo), Gordura (azul)
- Barra de progresso para água com bolinhas azuis
- Próxima refeição com horário
- Treino do dia com lista resumida
- Botões de ação rápida (Comida, Treino, Evolução)

**Componentes Utilizados**:
- `CircleProgress` (SVG com stroke animado)
- `ScreenContainer` (SafeArea)
- `MaterialIcons` (ícones)

---

### 2. **Comida (Alimentação)**

**Arquivo**: `app/(tabs)/comida.tsx`

**Funcionalidades**:
- Resumo de macros com barras coloridas
- Contador de água com bolinhas (8 bolinhas = 4L)
- Lista de refeições com checkboxes coloridos
- Detalhes de alimentos expandíveis
- Modal para adicionar alimentos avulsos
- Cálculo automático de macros

**Componentes Utilizados**:
- `MacroRing` (barras de macros com cores)
- `FoodSelector` (busca e seleção de alimentos)
- `CircularProgress` (anel de calorias)

**Integração com Food Database**:
```typescript
// 20+ alimentos pré-cadastrados com macros
- Frango (peito): 165 kcal, 31g proteína
- Ovo: 155 kcal, 13g proteína
- Banana: 89 kcal, 1.1g proteína
- Aveia: 389 kcal, 16.9g proteína
// ... mais alimentos
```

---

### 3. **Treino (Treino)**

**Arquivo**: `app/(tabs)/treino.tsx`

**Funcionalidades**:
- Cards de exercícios com última série registrada
- Sugestão automática de progressão baseada em RPE
- Modal para registrar série (peso, reps, RPE 1-10)
- Histórico das últimas 3 séries
- Cronômetro de descanso integrado (90 segundos padrão)
- Modal de conclusão com animação de sucesso
- Feedback visual e haptic ao completar série

**Fluxo de Registro**:
1. Usuário toca "Registrar Série"
2. Modal abre com campos (peso, reps, RPE)
3. Usuário preenche dados
4. Modal de sucesso aparece com animação
5. Botão "Próxima Série" abre cronômetro
6. Cronômetro com contagem regressiva e botões de ajuste

**Componentes Utilizados**:
- `RestTimer` (cronômetro com barra de progresso)
- `ExerciseCompletionModal` (feedback de sucesso)
- `ScreenContainer` (SafeArea)

---

### 4. **Evolução (Evolução Física)**

**Arquivo**: `app/(tabs)/evolucao.tsx`

**Funcionalidades**:
- Gráfico de peso (últimos 30 dias)
- Input rápido para registrar peso
- Medidas corporais (braços D/E, peito, cintura, coxa, panturrilha)
- Histórico de medidas
- Edição de metas

---

### 5. **Coach (Coach IA)**

**Arquivo**: `app/(tabs)/coach.tsx`

**Funcionalidades**:
- Botão "Análise da Semana"
- Histórico de análises com data e resumo
- Análise expandida com diagnóstico e 3 ações
- Placeholder para integração com Lovable AI

---

## 🔧 Componentes Reutilizáveis

### `RestTimer` Component

**Arquivo**: `components/rest-timer.tsx`

**Props**:
```typescript
interface RestTimerProps {
  defaultSeconds?: number; // 90 padrão
  onComplete?: () => void;
  onStart?: () => void;
}
```

**Funcionalidades**:
- Contagem regressiva com display MM:SS
- Botões: Play/Pause, +15s, -15s, Reset
- Barra de progresso animada
- Haptic feedback ao completar
- Mensagem de conclusão

---

### `ExerciseCompletionModal` Component

**Arquivo**: `components/exercise-completion-modal.tsx`

**Props**:
```typescript
interface ExerciseCompletionModalProps {
  visible: boolean;
  exerciseName: string;
  weight: number;
  reps: number;
  rpe: number;
  onClose: () => void;
  onNextSet: () => void;
}
```

**Funcionalidades**:
- Animação de checkmark giratório
- Exibição dos dados (peso, reps, RPE)
- Mensagens motivacionais baseadas em RPE
- Botão "Próxima Série" que abre cronômetro
- Haptic feedback de sucesso

---

### `FoodSelector` Component

**Arquivo**: `components/food-selector.tsx`

**Props**:
```typescript
interface FoodSelectorProps {
  visible: boolean;
  onSelect: (food: FoodItem, quantity: number) => void;
  onClose: () => void;
}
```

**Funcionalidades**:
- Busca inteligente de alimentos
- Seleção com quantidade customizável
- Botões +/- para ajustar quantidade
- Preview de macros em tempo real
- Cálculo automático baseado na quantidade

**Fluxo**:
1. Modal de busca abre
2. Usuário digita nome do alimento
3. Resultados aparecem com macros
4. Usuário seleciona alimento
5. Modal de quantidade abre
6. Usuário ajusta quantidade com +/-
7. Preview de macros atualiza
8. Usuário confirma e alimento é adicionado

---

### `MacroRing` Component

**Arquivo**: `components/macro-ring.tsx`

**Props**:
```typescript
interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  color: string;
}
```

**Funcionalidades**:
- Barra horizontal com progresso
- Cores customizáveis (roxo, amarelo, azul)
- Display de valores (current / target)
- Animação suave ao atualizar

---

### `CircularProgress` Component

**Arquivo**: `components/circular-progress.tsx`

**Funcionalidades**:
- Anel circular com SVG
- Stroke animado baseado em percentual
- Cor customizável
- Texto no centro

---

## 📊 State Management (Zustand Store)

**Arquivo**: `lib/store.ts`

### Estrutura de Dados

```typescript
interface Meal {
  id: string;
  name: string;
  time: string; // HH:mm
  foods: Food[];
  consumed: boolean;
  consumedAt?: string;
}

interface Food {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  rpe: number; // 1-10
  date: string;
}

interface Workout {
  id: string;
  day: string;
  name: string;
  exercises: Exercise[];
}

interface Settings {
  goalWeight: number;
  targetCalories: number;
  targetProtein: number;
  targetWater: number; // em litros
  currentWeight: number;
}
```

### Ações Principais

- `toggleMealConsumed(mealId)` - Marca refeição como consumida
- `addWater(amount)` - Adiciona água (em ml)
- `addExerciseSet(workoutId, exerciseId, set)` - Registra série
- `addFoodToMeal(mealId, food)` - Adiciona alimento a refeição
- `getDailyStats()` - Calcula totais do dia
- `getTodayWorkout()` - Retorna treino de hoje

### Persistência

- **localStorage** com AsyncStorage
- Zustand middleware `persist`
- Sincronização automática ao atualizar estado

---

## 🍔 Food Database

**Arquivo**: `lib/food-database.ts`

### Alimentos Pré-cadastrados (20+)

**Proteínas**:
- Frango (peito): 165 kcal, 31g P
- Ovo: 155 kcal, 13g P
- Atum: 132 kcal, 29.9g P
- Carne vermelha: 250 kcal, 26g P
- Iogurte grego: 59 kcal, 10g P

**Carboidratos**:
- Arroz integral: 111 kcal, 2.6g P
- Batata doce: 86 kcal, 1.6g P
- Banana: 89 kcal, 1.1g P
- Aveia: 389 kcal, 16.9g P
- Pão integral: 265 kcal, 9g P

**Gorduras**:
- Azeite: 884 kcal, 100g G
- Amendoim: 567 kcal, 49.2g G
- Abacate: 160 kcal, 14.7g G

**Frutas/Vegetais**:
- Maçã, Laranja, Brócolis, Alface

**Bebidas**:
- Leite integral, Suco, Café

### Funções Principais

```typescript
searchFoods(query: string): FoodItem[]
getFoodById(id: string): FoodItem | undefined
calculateMacros(food: FoodItem, quantity: number): {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}
```

---

## 🎯 Fluxos Principais

### Fluxo 1: Registrar Refeição

1. Usuário abre aba "Comida"
2. Vê resumo de macros do dia
3. Toca checkbox em refeição planejada
4. Checkbox fica verde com animação
5. Macros são somadas automaticamente
6. Resumo atualiza em tempo real

### Fluxo 2: Registrar Série

1. Usuário abre aba "Treino"
2. Vê exercícios do dia com última série
3. Toca "Registrar Série"
4. Modal abre com campos (peso, reps, RPE)
5. Usuário preenche dados
6. Toca "Salvar Série"
7. Modal de sucesso aparece com animação
8. Toca "Próxima Série"
9. Cronômetro abre com 90 segundos
10. Usuário descansa enquanto cronômetro conta
11. Haptic feedback ao completar tempo

### Fluxo 3: Adicionar Alimento Avulso

1. Usuário abre aba "Comida"
2. Toca "Adicionar Alimento"
3. Modal de busca abre
4. Usuário digita nome (ex: "frango")
5. Resultados aparecem com macros
6. Usuário seleciona alimento
7. Modal de quantidade abre
8. Usuário ajusta quantidade com botões +/-
9. Preview de macros atualiza
10. Usuário confirma
11. Alimento adicionado à refeição
12. Macros do dia atualizam

---

## 🧪 Testes

**Arquivo**: `tests/components.test.ts`

**Testes Implementados** (16 total):
- RestTimer: inicialização, contagem, pausa, reset
- ExerciseCompletionModal: renderização, props, callbacks
- Store: getDailyStats, toggleMeal, addWater, addExerciseSet

**Executar Testes**:
```bash
pnpm test
```

**Resultado**: ✅ 16 testes passando

---

## 🚀 Recursos Implementados

### ✅ Completo

- [x] 5 abas com navegação bottom tab
- [x] Dashboard com anéis de progresso circulares
- [x] Tela de Comida com macros e contador de água
- [x] Tela de Treino com registro de séries
- [x] Cronômetro de descanso com 90 segundos
- [x] Modal de conclusão com animação
- [x] Sistema de alimentos com 20+ pré-cadastrados
- [x] Busca inteligente de alimentos
- [x] Personalização de quantidade de alimentos
- [x] Cálculo automático de macros
- [x] Design dark mode completo
- [x] Tipografia Apple (SF Pro Display)
- [x] Persistência em localStorage
- [x] Haptic feedback
- [x] Testes unitários

### 🔄 Em Progresso

- [ ] Integração com Coach IA (Lovable AI)
- [ ] Gráfico de peso com histórico
- [ ] Medidas corporais
- [ ] Notificações de refeições/treino

### 📋 Planejado

- [ ] Sincronização com backend
- [ ] Autenticação de usuário
- [ ] Compartilhamento de dados
- [ ] Dark/Light mode toggle
- [ ] Customização de plano de treino
- [ ] Customização de metas

---

## 📦 Dependências Principais

```json
{
  "react-native": "0.81.5",
  "expo": "~54.0.29",
  "expo-router": "~6.0.19",
  "nativewind": "^4.2.1",
  "zustand": "^4.x",
  "react-native-svg": "15.12.1",
  "expo-haptics": "~15.0.8",
  "expo-audio": "~1.1.0",
  "@tanstack/react-query": "^5.90.12"
}
```

---

## 🎨 Customização

### Alterar Paleta de Cores

**Arquivo**: `theme.config.js`

```javascript
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#A855F7' },
  background: { light: '#ffffff', dark: '#0F0F0F' },
  surface: { light: '#f5f5f5', dark: '#1A1A2E' },
  // ... mais cores
};
```

### Alterar Metas

**Arquivo**: `lib/store.ts` (initialState)

```typescript
settings: {
  goalWeight: 80,
  targetCalories: 3200,
  targetProtein: 180,
  targetWater: 4, // litros
  currentWeight: 70.2,
}
```

### Adicionar Alimentos

**Arquivo**: `lib/food-database.ts`

```typescript
export const COMMON_FOODS: FoodItem[] = [
  {
    id: 'novo_alimento',
    name: 'Novo Alimento',
    calories: 100,
    protein: 10,
    carbs: 10,
    fats: 5,
    unit: '100g',
    defaultQuantity: 100,
  },
  // ... mais alimentos
];
```

---

## 🔐 Segurança & Performance

- **localStorage**: Dados armazenados localmente (sem servidor)
- **TypeScript**: Type-safe em todo o código
- **Vitest**: Testes automatizados
- **NativeWind**: CSS otimizado para React Native
- **Zustand**: State management eficiente

---

## 📱 Compatibilidade

- **iOS**: ✅ Expo Go + Build
- **Android**: ✅ Expo Go + Build
- **Web**: ✅ PWA-ready
- **Orientação**: Portrait (9:16)
- **Uso**: Uma mão (elementos no terço inferior)

---

## 🎓 Como Usar

### Instalação

```bash
cd treino-saude-app
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

Abra em:
- **iOS/Android**: Escanear QR code com Expo Go
- **Web**: http://localhost:8081

### Testes

```bash
pnpm test
```

### Build

```bash
pnpm build
```

---

## 📝 Notas Importantes

1. **Dados Locais**: Todos os dados são armazenados em localStorage. Não há sincronização com servidor.
2. **Sem Login**: App funciona sem autenticação. Dados são pessoais.
3. **Persistência**: Dados persistem entre sessões automaticamente.
4. **Haptics**: Feedback tátil em ações principais (iOS/Android).
5. **Dark Mode**: Design dark mode é padrão. Light mode pode ser adicionado.

---

## 🤝 Próximos Passos Sugeridos

1. **Coach IA**: Integrar com Lovable AI para análises automáticas
2. **Gráfico de Evolução**: Implementar gráfico de peso com histórico
3. **Notificações**: Adicionar lembretes de refeições e treino
4. **Customização**: Permitir edição de plano de treino e metas
5. **Sincronização**: Adicionar backend para sincronização entre dispositivos

---

**Desenvolvido com ❤️ usando React Native + Expo**
