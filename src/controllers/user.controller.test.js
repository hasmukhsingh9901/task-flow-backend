jest.mock('../config/env.js', () => ({
  ACCESS_TOKEN_SECRET: 'test',
  REFRESH_TOKEN_SECRET: 'test',
  ACCESS_TOKEN_EXPIRY: '1h',
  REFRESH_TOKEN_EXPIRY: '1d',
}));

import * as userController from './user.controller.js';

describe('User Controller', () => {
  it('should have registerUser defined', () => {
    expect(userController.registerUser).toBeDefined();
  });
  it('should have loginUser defined', () => {
    expect(userController.loginUser).toBeDefined();
  });
  it('should have refreshToken defined', () => {
    expect(userController.refreshToken).toBeDefined();
  });
  it('should have logoutUser defined', () => {
    expect(userController.logoutUser).toBeDefined();
  });
  it('should have toggleUserRole defined', () => {
    expect(userController.toggleUserRole).toBeDefined();
  });
  it('should have getUserLogs defined', () => {
    expect(userController.getUserLogs).toBeDefined();
  });
  it('should have deleteUserLog defined', () => {
    expect(userController.deleteUserLog).toBeDefined();
  });
  it('should have getUsers defined', () => {
    expect(userController.getUsers).toBeDefined();
  });
}); 