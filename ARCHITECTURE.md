# Архитектура

Проект собран как Vite + React + TypeScript-приложение без серверной части.

- `src/domain/` — доменные типы состояния воронки и значения ответов.
- `src/hooks/` — состояние и переходы квиза, включая восстановление из `localStorage`.
- `src/data/` — декларативные данные вариантов вопросов.
- `src/features/quiz/screens/<Component>/` — экранный компонент и его локальный `<Component>.module.css`.
- `src/shared/ui/<Component>/` — переиспользуемый UI-компонент и его локальные стили.
- `src/app/App.tsx` — только composition root приложения.
- `src/app/App.module.css` — базовые шрифты, reset и CSS-переменные, подключённые через CSS Module.
- `src/app/QuizFlow.tsx` — тонкий оркестратор состояния и маршрутизации; содержимое экранов не хранит.
- `src/app/QuizFlow.module.css` — только стили оболочки потока: тема, экранный контейнер, переходы и нижняя строка первого экрана.

Проверки:

```bash
npm run typecheck
npm run build
```

`work/extracted-site` используется только как эталон и не входит в сборку.
