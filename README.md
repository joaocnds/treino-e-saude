# Treino e Saúde

App mobile para registro diário de treinos, refeições, hidratação e medidas corporais, com resumo semanal via aba Coach.

## Funcionalidades

- Registro de séries, exercícios, peso e repetições
- Controle de refeições com porções
- Acompanhamento de consumo de água
- Registro de peso e medidas corporais
- Coach semanal com resumo dos registros
- Persistência local no dispositivo

## Stack

- **React Native** com **Expo**
- **TypeScript**
- **Zustand** para gerenciamento de estado
- **Drizzle** para persistência local

## Como rodar

```bash
pnpm install --frozen-lockfile
pnpm dev          # Expo dev server
pnpm android      # Android via Expo
pnpm build        # Export web
```

## Documentação

- [Implementação de origem](IMPLEMENTATION.md)
- [Design system](design.md)

## Autor

**João Vitor Cassiano** — [@joaocnds](https://github.com/joaocnds)
