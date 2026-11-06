# Evolução Física & Saúde - TODO

## Fase 1: Setup & Branding
- [x] Gerar logo do app (ícone quadrado, 512x512px)
- [x] Atualizar app.config.ts com nome e logoUrl
- [x] Copiar logo para assets (icon.png, splash-icon.png, favicon.png, android-icon-foreground.png)
- [x] Atualizar theme.config.js com paleta de cores (verde esmeralda #10B981)

## Fase 2: Estrutura Base & Navegação
- [x] Criar store Zustand para persistência (meals, workouts, weights, measures, settings, coach_history)
- [x] Configurar localStorage com Zustand
- [x] Atualizar tab bar com 5 abas (Hoje, Comida, Treino, Evolução, Coach)
- [x] Criar ScreenContainer para cada tela
- [x] Adicionar ícones para abas (home, utensils, dumbbell, chart-line, sparkles)
- [x] Implementar tema claro/escuro com cores do design.md

## Fase 3: Dashboard (Hoje)
- [x] Criar tela Dashboard com cabeçalho de data
- [x] Implementar cartão de peso (atual + meta + barra de progresso)
- [x] Implementar anéis de macros (kcal, proteína, água)
- [x] Mostrar próxima refeição com horário
- [x] Mostrar treino do dia com lista resumida
- [x] Botão "Pedir Análise ao Coach" (verde, destaque)
- [x] Navegação entre abas ao tocar em elementos

## Fase 4: Alimentação (Comida)
- [x] Criar tela de Alimentação
- [x] Implementar resumo diário (kcal, proteína, carbs, gordura)
- [x] Implementar contador de água (+250ml, +500ml)
- [x] Listar plano de refeições pré-cadastrado (7 refeições)
- [x] Checkbox para marcar refeição como consumida (animado)
- [x] Soma automática de macros ao marcar refeição
- [x] Modal para adicionar alimento avulso (nome, qtd, kcal, P/C/G)
- [x] Persistir dados em localStorage

## Fase 5: Treino (Treino)
- [x] Criar tela de Treino
- [x] Mostrar treino do dia (ex: Quarta - Push)
- [x] Listar exercícios com histórico da última sessão
- [x] Botão "Registrar Série" para cada exercício
- [x] Modal para registrar série (peso, reps, RPE 1-10)
- [x] Sugestão de progressão automática (+2.5kg ou +1 rep baseado em RPE)
- [x] Histórico por exercício (últimas 3-4 sessões)
- [x] Persistir dados em localStorage

## Fase 6: Evolução Física (Evolução)
- [x] Criar tela de Evolução Física
- [x] Implementar gráfico de peso (linha, últimos 30 dias)
- [x] Mostrar marcadores de meta no gráfico
- [x] Input para registrar peso rápido
- [x] Listar medidas corporais (braços D/E, peito, cintura, coxa, panturrilha)
- [x] Histórico de medidas (últimas 3 medições)
- [x] Modal para editar medidas
- [x] Editar metas (75kg, 80kg, 85kg)
- [x] Persistir dados em localStorage

## Fase 7: Coach IA (Coach)
- [x] Criar tela do Coach
- [x] Botão "Análise da Semana" (verde, destaque)
- [ ] Integração com Lovable AI (Gemini Flash)
- [ ] Enviar resumo: evolução peso (7d), kcal média, proteína, treinos, RPE médio, água
- [ ] Receber diagnóstico + 3 ações concretas em PT-BR
- [x] Mostrar histórico de análises (data + resumo)
- [x] Expandir análise anterior (diagnóstico completo + 3 ações)
- [x] Loading spinner durante análise
- [x] Persistir histórico em localStorage

## Fase 8: Configurações (Config)
- [ ] Criar tela de Configurações
- [ ] Editar metas (peso alvo, kcal alvo, proteína alvo, água alvo)
- [ ] Editar plano de refeições
- [ ] Editar divisão de treino
- [ ] Botão exportar dados (JSON)
- [ ] Botão importar dados (JSON)
- [ ] Persistir em localStorage

## Fase 9: Dados Iniciais & Pré-carregamento
- [ ] Pré-carregar plano de refeições (Café, Lanche, Almoço, Pré, Pós, Jantar, Ceia)
- [ ] Pré-carregar divisão de treino (Seg–Sáb)
- [ ] Pré-carregar metas (70 → 80kg, 3200 kcal, 180g proteína, 4L água)
- [ ] Pré-carregar peso inicial (70,2kg)

## Fase 10: Microinterações & Polish
- [ ] Animações suaves (check de refeição, série concluída)
- [ ] Feedback visual (cores, haptics)
- [ ] Toasts para sucesso/erro
- [ ] Loading spinners
- [ ] Transições entre telas

## Fase 11: PWA & Backup
- [ ] Configurar manifest.json
- [ ] Meta tags para PWA
- [ ] Botão exportar JSON (backup manual)
- [ ] Botão importar JSON (restaurar backup)

## Fase 12: Testes & Otimizações
- [ ] Testar fluxo de refeição
- [ ] Testar fluxo de treino
- [ ] Testar fluxo de análise do Coach
- [ ] Testar persistência em localStorage
- [ ] Testar responsividade (mobile, tablet, web)
- [ ] Otimizar performance (lazy loading, memoization)
- [ ] Testar no Expo Go (iOS/Android)

## Fase 13: Entrega
- [ ] Criar checkpoint final
- [ ] Documentar instruções de uso
- [ ] Gerar APK (opcional)
- [ ] Entregar ao usuário


## Fase Extra: Cronômetro & Animações
- [x] Criar componente RestTimer (cronômetro reutilizável)
- [x] Integrar cronômetro na tela de Treino
- [x] Animação de sucesso ao concluir série
- [x] Feedback visual com cor verde e checkmark
- [x] Haptic feedback ao completar série
- [ ] Notificação sonora (opcional) quando tempo de descanso acaba
- [ ] Histórico de tempos de descanso por exercício


## Fase Extra: Redesign (Fonte Apple + Cores)
- [x] Integrar fonte SF Pro Display (Apple)
- [x] Atualizar tipografia em todos os componentes
- [x] Atualizar paleta de cores (novo design - dark mode)
- [x] Refatorar componentes UI com novo design system
- [x] Validar novo design em todas as telas


## Fase Extra: Redesign Completo + Sistema de Alimentos
- [x] Redesenhar Dashboard com anéis de progresso circulares
- [x] Redesenhar tela de Treino com novos cards
- [x] Integrar cronômetro visual na tela de Treino
- [x] Criar sistema de entrada/leitura de alimentos
- [x] Permitir personalização de quantidade de alimentos
- [x] Testar todas as funcionalidades
