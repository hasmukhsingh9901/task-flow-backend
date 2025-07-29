jest.mock('../config/env.js', () => ({
  ACCESS_TOKEN_SECRET: 'test',
  REFRESH_TOKEN_SECRET: 'test',
  ACCESS_TOKEN_EXPIRY: '1h',
  REFRESH_TOKEN_EXPIRY: '1d',
}));

import router from './task.routes.js';

describe('Task Routes', () => {
  it('should be defined', () => {
    expect(router).toBeDefined();
  });
}); 