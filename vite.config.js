import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables global functions like `describe` and `test`
    environment: 'jsdom', // Simulates the browser environment
    setupFiles: './src/setupTests.js', // Runs before tests (optional)
  },
});