/** @type {import('tailwindcss').Config} */
/**
 * Tailwind CSS v4+ configuration using CSS-first approach.
 * Design tokens are defined in src/styles/design-tokens.css using @theme directive.
 */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './libs/**/*.{html,ts}',
  ],
  // Remove tokens config since we're using CSS-first approach with @theme
}; 