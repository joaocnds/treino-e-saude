# Design: Evolução Física & Saúde

## Visão Geral

Um aplicativo mobile-first de rastreamento de treino, nutrição e evolução física com coach inteligente. Design limpo e minimal, inspirado em Apple Health, otimizado para uso com uma mão em portrait (9:16).

---

## Orientação & Dispositivos

- **Orientação**: Portrait (9:16)
- **Uso**: Uma mão (botões/elementos no terço inferior)
- **Plataformas**: iOS (Expo Go) e Web (PWA)
- **Persistência**: localStorage (sem login)

---

## Paleta de Cores

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Primary** | `#10B981` (Verde Esmeralda) | Botões, progresso, sucesso |
| **Background** | `#FFFFFF` (Branco) | Fundo principal |
| **Surface** | `#F9FAFB` (Cinza Muito Claro) | Cards, superfícies elevadas |
| **Foreground** | `#111827` (Cinza Escuro) | Texto principal |
| **Muted** | `#6B7280` (Cinza Médio) | Texto secundário |
| **Border** | `#E5E7EB` (Cinza Claro) | Divisores, bordas |
| **Warning** | `#F59E0B` (Âmbar) | Atenção, alertas |
| **Error** | `#EF4444` (Vermelho) | Erros |
| **Success** | `#10B981` (Verde) | Confirmação |

---

## Tipografia

- **Display**: Inter (sans-serif, limpo)
- **Tamanhos**:
  - Títulos principais: 28px, bold
  - Subtítulos: 18px, semibold
  - Corpo: 16px, regular
  - Labels: 14px, medium
  - Pequeno: 12px, regular

---

## Estrutura de Abas (Bottom Navigation)

5 abas principais, ícones + labels, altura ~60px + safe area:

1. **Hoje** (Home) — Dashboard
2. **Comida** (Food) — Alimentação
3. **Treino** (Dumbbell) — Treino
4. **Evolução** (Chart) — Evolução Física
5. **Coach** (Sparkles) — Coach IA

---

## Telas & Fluxos

### 1. **Hoje (Dashboard)**

**Propósito**: Visão rápida do dia, próximas ações.

**Conteúdo**:
- Cabeçalho: "Hoje, 10 de junho"
- **Cartão de Peso**: Peso atual (70,2kg) → Meta (80kg) com barra de progresso
- **Anéis de Macros** (3 anéis concêntricos):
  - Kcal: 2350 / 3200 (verde se ≥ 80%)
  - Proteína: 145g / 180g
  - Água: 2,8L / 4L
- **Próxima Refeição**: "15h30 - Pré-treino" (com ícone de relógio)
- **Treino do Dia**: "Quarta - Push" (com lista resumida de exercícios)
- **Botão "Pedir Análise ao Coach"** (verde, destaque)

**Interações**:
- Toque no cartão de peso → Ir para "Evolução"
- Toque em "Próxima Refeição" → Ir para "Comida"
- Toque em "Treino do Dia" → Ir para "Treino"

---

### 2. **Comida (Alimentação)**

**Propósito**: Registrar refeições, macros, água.

**Conteúdo**:
- Cabeçalho: "Alimentação" + data
- **Resumo do Dia**: Kcal, Proteína, Carbs, Gordura (cards pequenos)
- **Contador de Água**: Botões "+250ml" e "+500ml", total em litros
- **Plano de Refeições** (lista):
  - Cada refeição com horário, alimentos, macros
  - Checkbox para marcar como consumida (check animado)
  - Cor verde se consumida, cinza se pendente
- **Botão "Adicionar Alimento Avulso"** (verde, flutuante ou fixo)
- **Resumo Diário** (rodapé): Kcal totais, Proteína, Água

**Interações**:
- Toque no checkbox → Marca refeição como consumida (soma macros)
- Toque em "Adicionar Alimento" → Modal com campos (nome, qtd, kcal, P/C/G)
- Toque em refeição → Expande detalhes

---

### 3. **Treino (Treino)**

**Propósito**: Registrar séries, ver sugestões de progressão.

**Conteúdo**:
- Cabeçalho: "Treino de Hoje" + dia da semana
- **Treino do Dia**: Ex. "Quarta - Push"
- **Lista de Exercícios**:
  - Cada exercício com histórico (última sessão)
  - Botão "Registrar Série" (verde)
  - Após registrar: peso, reps, RPE (1-10)
- **Sugestão de Progressão**: "Próximo: 72,5kg x 8" (se RPE ≥ 7)
- **Histórico por Exercício**: Últimas 3-4 sessões (toque para expandir)

**Interações**:
- Toque "Registrar Série" → Modal com campos (peso, reps, RPE)
- Toque em "Histórico" → Expande últimas sessões
- Toque em exercício → Detalhe com gráfico de progressão

---

### 4. **Evolução (Evolução Física)**

**Propósito**: Acompanhar peso, medidas, metas.

**Conteúdo**:
- Cabeçalho: "Evolução Física"
- **Gráfico de Peso**: Linha (últimos 30 dias) com marcadores de meta
- **Registro Rápido de Peso**: Input + botão "Registrar" (verde)
- **Medidas Corporais**:
  - Braços (D/E), Peito, Cintura, Coxa, Panturrilha
  - Cada uma com histórico (últimas 3 medições)
  - Botão "Editar Medidas"
- **Metas**: 75kg → 80kg → 85kg (marcadores no gráfico)

**Interações**:
- Toque no gráfico → Mostra data/valor
- Toque "Editar Medidas" → Modal com campos
- Toque em meta → Edita valor

---

### 5. **Coach (Coach IA)**

**Propósito**: Análise semanal com recomendações.

**Conteúdo**:
- Cabeçalho: "Coach IA"
- **Botão "Análise da Semana"** (verde, destaque)
- **Histórico de Análises** (lista):
  - Data, resumo (ex: "Ganhou 0,1kg → +300 kcal/dia")
  - Toque para expandir análise completa
- **Análise Expandida**:
  - Diagnóstico (parágrafo)
  - 3 ações concretas (lista numerada)

**Interações**:
- Toque "Análise da Semana" → Carrega análise (loading spinner)
- Toque em análise anterior → Expande detalhes

---

## Componentes Reutilizáveis

### Card
- Fundo branco/surface, borda sutil, padding 16px, border-radius 12px
- Sombra leve (shadow-sm)

### Botão Primário
- Fundo verde (#10B981), texto branco
- Padding 12px 24px, border-radius 8px
- Press: scale 0.97, opacity 0.9
- Haptic: Light

### Botão Secundário
- Fundo surface, texto foreground, borda border
- Padding 12px 24px, border-radius 8px
- Press: opacity 0.7

### Input
- Borda border, padding 12px, border-radius 8px
- Foco: borda primary
- Placeholder: muted

### Anel (Macro Ring)
- Círculo com stroke animado
- Cor verde se ≥ 80%, âmbar se 50-79%, vermelho se < 50%
- Texto: valor / meta

### Barra de Progresso
- Altura 8px, border-radius 4px
- Fundo: surface, preenchimento: primary
- Animação suave ao atualizar

---

## Microinterações

- **Check de Refeição**: Checkbox com check animado (fade-in, scale)
- **Série Concluída**: Feedback visual (cor verde, haptic success)
- **Carregamento**: Spinner sutil (não intrusivo)
- **Erro**: Toast no topo (vermelho, auto-dismiss em 3s)
- **Sucesso**: Toast no topo (verde, auto-dismiss em 2s)

---

## Fluxos Principais

### Fluxo 1: Registrar Refeição
1. Usuário abre "Comida"
2. Toca checkbox em refeição planejada
3. Macros são somadas automaticamente
4. Feedback visual: checkbox fica verde, animação

### Fluxo 2: Registrar Série
1. Usuário abre "Treino"
2. Toca "Registrar Série" em exercício
3. Modal com campos: peso, reps, RPE
4. Toca "Salvar"
5. Sugestão de progressão aparece
6. Feedback: série adicionada, histórico atualizado

### Fluxo 3: Pedir Análise ao Coach
1. Usuário abre "Hoje"
2. Toca "Pedir Análise ao Coach"
3. Loading spinner
4. Análise aparece em "Coach"
5. Usuário pode ler diagnóstico + 3 ações

---

## Responsividade

- **Mobile (< 600px)**: Layout padrão (portrait)
- **Tablet (≥ 600px)**: Considerar landscape (futuro)
- **Web**: Mesmo layout, PWA-friendly

---

## Acessibilidade

- Contraste mínimo 4.5:1 (WCAG AA)
- Labels em todos os inputs
- Tamanho mínimo de toque: 44x44pt
- Haptics para feedback (não apenas visual)

---

## Dados Iniciais (Pré-carregados)

- **Meta**: 70 → 80kg
- **Metas Nutricionais**: 3200 kcal, 180g proteína, 4L água
- **Plano de Refeições**: Café, Lanche, Almoço, Pré, Pós, Jantar, Ceia
- **Divisão de Treino**: Seg–Sáb conforme escopo
- **Peso Inicial**: 70,2kg (editável)

---

## Notas de Implementação

- Usar localStorage (Zustand) para persistência
- Sem backend para dados (PWA-first)
- Lovable AI Gateway para Coach (server function)
- Manifest + meta tags para PWA
- Backup: botão exporta JSON
