import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http.js';
import { randomUUID } from 'crypto';

axios.defaults.adapter = httpAdapter;

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
    clear: () => null,
  },
});

// Polyfill for crypto.randomUUID in jsdom environment
if (!globalThis.crypto || !globalThis.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID,
    },
  });
}
