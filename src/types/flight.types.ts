import * as React from 'react';
import {
  Brand,
  ISODateString,
  EmailAddress,
  UserId,
} from './index';

// Define missing types that should be exported from ./index
export type Url = string;
export type GitHubUsername = string;
export interface GitHubRepository {
  id: string;
  githubId: number;
  name: string;
  fullName: GitHubUsername;
  description?: string;
  url: Url;
  stars: number;
  forks: number;
  language?: string;
  createdAt: ISODateString;
  isArchived: boolean;
}

export interface UserProfile {
  id: UserId;
  username: GitHubUsername;
  avatarUrl: Url;
  repositoryCount: number;
  starCount: number;
  followers: number;
  following: number;
  email: EmailAddress;
  bio?: string;
  location?: string;
  company?: string;
  blog?: Url;
}

export interface Connection {
  requesterId: UserId;
  requesteeId: UserId;
  status: 'pending' | 'connected' | 'rejected';
  createdAt: ISODateString;
}

export type Skill = Brand<string, 'Skill'>;
export type Interest = Brand<string, 'Interest'>;
