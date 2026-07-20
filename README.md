# Amicro Vue

A Vue 3 + TypeScript port of [Subhan-code/Amicro--Micro-transitions-](https://github.com/Subhan-code/Amicro--Micro-transitions-).

The project preserves the original catalog idea while replacing React-specific code with native Vue single-file components and [Motion for Vue](https://motion.dev/docs/vue).

## Highlights

- 35 button micro-interactions
- Card spreads and 3D carousel demonstrations
- Motion layout animation, spring transitions and `AnimatePresence`
- Dark/light theme, responsive layouts and reduced-motion support
- Copyable Vue SFC examples
- No Tailwind dependency

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
```

## Why the animation feels smooth

1. Spring transitions are interruptible and keep velocity when state changes.
2. Most effects animate `transform`, `opacity` and `filter`, avoiding layout-heavy properties.
3. Motion layout animation uses transform-based visual interpolation when the grid changes.
4. Icons enter and exit through `AnimatePresence`, so state changes preserve visual continuity.
5. Small layered delays and consistent damping create response without visible wobble.
6. `MotionConfig reducedMotion="user"` respects accessibility preferences.

## Attribution

The original design, catalog and React implementation were created by [Syed Subhan](https://github.com/Subhan-code). This repository is an independent Vue port and keeps a direct link to the upstream project.

## License

MIT. See [LICENSE](LICENSE).
