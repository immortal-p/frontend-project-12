import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    expect: {
      timeout: 10000, 
    },
  },
  timeout: 60000, 
});