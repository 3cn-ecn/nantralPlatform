// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
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
