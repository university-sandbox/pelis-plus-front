/**
 * Mock data for UserService.
 * ⚠️ Used only when environment.mock.enabled === true.
 */

import { type UserProfile } from '../models/user.model';

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'mock-user-1',
  name: 'Usuario Demo',
  email: 'demo@pelisplus.com',
  avatar: null,
  membership: null,
  createdAt: '2024-01-15T10:00:00Z',
};
