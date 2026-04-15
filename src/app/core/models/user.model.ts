import { type ActiveMembership } from './membership.model';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  membership: ActiveMembership | null;
  createdAt: string;
}
