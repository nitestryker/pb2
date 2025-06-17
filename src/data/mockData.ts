import { Paste, Project, Issue, User, Notification, AISummary } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@pasteforge.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
    bio: 'Platform Administrator & Full-Stack Developer',
    website: 'https://pasteforge.com',
    location: 'San Francisco, CA',
    joinDate: '2024-01-01',
    isAdmin: true,
    followers: 1250,
    following: 89,
    pasteCount: 156,
    projectCount: 23,
  },
  {
    id: '2',
    username: 'developer',
    email: 'dev@example.com',
    avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?w=150',
    bio: 'Full-stack developer passionate about clean code and modern web technologies',
    website: 'https://devportfolio.com',
    location: 'New York, NY',
    joinDate: '2024-01-15',
    isAdmin: false,
    followers: 892,
    following: 234,
    pasteCount: 445,
    projectCount: 18,
  },
  {
    id: '3',
    username: 'codemaster',
    email: 'master@code.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=150',
    bio: 'Senior Software Engineer specializing in backend systems',
    location: 'Seattle, WA',
    joinDate: '2024-02-01',
    isAdmin: false,
    followers: 567,
    following: 123,
    pasteCount: 289,
    projectCount: 12,
  },
];

// Mock pastes
export const mockPastes: Paste[] = [
  {
    id: '1',
    title: 'React Hook for API Calls',
    content: `import { useState, useEffect } from 'react';

export const useApiCall = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};`,
    language: 'javascript',
    author: mockUsers[1],
    createdAt: '2024-12-20T10:30:00Z',
    updatedAt: '2024-12-20T10:30:00Z',
    isPublic: true,
    views: 1247,
    forks: 23,
    stars: 89,
    tags: ['react', 'hooks', 'api', 'javascript'],
    version: 1,
    versions: [],
  },
  {
    id: '2',
    title: 'Python Data Processing Script',
    content: `import pandas as pd
import numpy as np
from datetime import datetime

def process_data(file_path):
    """Process CSV data and return cleaned DataFrame"""
    
    # Read the CSV file
    df = pd.read_csv(file_path)
    
    # Clean data
    df = df.dropna()  # Remove null values
    df['date'] = pd.to_datetime(df['date'])  # Convert date column
    
    # Add calculated columns
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    
    # Group by month and calculate statistics
    monthly_stats = df.groupby('month').agg({
        'value': ['mean', 'sum', 'count'],
        'category': 'nunique'
    }).round(2)
    
    return df, monthly_stats

# Example usage
if __name__ == "__main__":
    data, stats = process_data('data.csv')
    print("Data processed successfully!")
    print(f"Total rows: {len(data)}")
    print("Monthly statistics:")
    print(stats)`,
    language: 'python',
    author: mockUsers[2],
    createdAt: '2024-12-19T15:45:00Z',
    updatedAt: '2024-12-19T15:45:00Z',
    isPublic: true,
    views: 856,
    forks: 12,
    stars: 67,
    tags: ['python', 'pandas', 'data-processing', 'csv'],
    version: 1,
    versions: [],
  },
  {
    id: '3',
    title: 'TypeScript Interface Definitions',
    content: `// User management interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Utility types
export type UserWithoutId = Omit<User, 'id'>;
export type CreateUserRequest = Pick<User, 'username' | 'email' | 'bio'>;
export type UpdateUserRequest = Partial<CreateUserRequest>;`,
    language: 'typescript',
    author: mockUsers[0],
    createdAt: '2024-12-18T09:20:00Z',
    updatedAt: '2024-12-18T09:20:00Z',
    isPublic: true,
    views: 1456,
    forks: 34,
    stars: 123,
    tags: ['typescript', 'interfaces', 'types', 'api'],
    version: 1,
    versions: [],
  },
];

// Mock projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Web Components Library',
    description: 'A comprehensive library of reusable web components built with modern web standards',
    author: mockUsers[0],
    createdAt: '2024-11-15T00:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z',
    isPublic: true,
    branches: [
      {
        id: '1',
        name: 'main',
        projectId: '1',
        createdAt: '2024-11-15T00:00:00Z',
        lastCommit: '2024-12-20T10:00:00Z',
        pastes: [mockPastes[0]],
      },
    ],
    collaborators: [mockUsers[1], mockUsers[2]],
    readme: '# Web Components Library\n\nA modern, accessible web components library...',
    license: 'MIT',
    tags: ['web-components', 'javascript', 'library', 'frontend'],
    stars: 234,
    forks: 45,
    issues: [],
    milestones: [],
  },
  {
    id: '2',
    name: 'Data Analytics Dashboard',
    description: 'Real-time data visualization dashboard with interactive charts and reports',
    author: mockUsers[1],
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-12-19T16:00:00Z',
    isPublic: true,
    branches: [
      {
        id: '2',
        name: 'main',
        projectId: '2',
        createdAt: '2024-10-01T00:00:00Z',
        lastCommit: '2024-12-19T16:00:00Z',
        pastes: [mockPastes[1]],
      },
    ],
    collaborators: [mockUsers[2]],
    readme: '# Data Analytics Dashboard\n\nPowerful analytics platform...',
    license: 'Apache-2.0',
    tags: ['analytics', 'dashboard', 'python', 'data-viz'],
    stars: 189,
    forks: 28,
    issues: [],
    milestones: [],
  },
];

// Mock issues
export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Add dark mode support',
    description: 'Implement dark mode toggle functionality with theme persistence',
    status: 'open',
    priority: 'medium',
    labels: ['enhancement', 'ui'],
    author: mockUsers[1],
    createdAt: '2024-12-18T14:30:00Z',
    updatedAt: '2024-12-18T14:30:00Z',
    projectId: '1',
    comments: [],
  },
  {
    id: '2',
    title: 'Performance optimization needed',
    description: 'Dashboard loading time is too slow with large datasets',
    status: 'open',
    priority: 'high',
    labels: ['bug', 'performance'],
    assignee: mockUsers[2],
    author: mockUsers[0],
    createdAt: '2024-12-17T11:15:00Z',
    updatedAt: '2024-12-17T11:15:00Z',
    projectId: '2',
    comments: [],
  },
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'paste',
    title: 'New paste created',
    message: 'developer created a new paste: "React Hook for API Calls"',
    read: false,
    createdAt: '2024-12-20T10:30:00Z',
    userId: '1',
    relatedId: '1',
  },
  {
    id: '2',
    type: 'issue',
    title: 'Issue assigned',
    message: 'You have been assigned to issue "Performance optimization needed"',
    read: false,
    createdAt: '2024-12-17T11:15:00Z',
    userId: '2',
    relatedId: '2',
  },
];