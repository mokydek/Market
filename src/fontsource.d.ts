// The @fontsource-variable packages ship CSS and expose no type declarations.
// Declare them as side-effect only modules so TypeScript 6 accepts the bare
// imports in main.tsx without falling back to per-file /index.css paths.
declare module '@fontsource-variable/inter'
declare module '@fontsource-variable/rubik'
