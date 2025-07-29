// Mock the config/env.js to avoid import.meta.url issues in Jest
jest.mock('../config/env.js', () => ({
  ACCESS_TOKEN_SECRET: 'test',
  REFRESH_TOKEN_SECRET: 'test',
  ACCESS_TOKEN_EXPIRY: '1h',
  REFRESH_TOKEN_EXPIRY: '1d',
}));

import { createTask } from './task.controller.js';

describe('Task Controller', () => {
  it('should be defined', () => {
    expect(createTask).toBeDefined();
  });

  // Add more tests here as needed
}); 