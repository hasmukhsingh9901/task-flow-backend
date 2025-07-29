jest.mock('../config/env.js', () => ({
  ACCESS_TOKEN_SECRET: 'test',
  REFRESH_TOKEN_SECRET: 'test',
  ACCESS_TOKEN_EXPIRY: '1h',
  REFRESH_TOKEN_EXPIRY: '1d',
}));

import { authMiddleware } from './auth.middleware.js';

describe('Auth Middleware', () => {
  it('should be defined', () => {
    expect(authMiddleware).toBeDefined();
  });
}); 