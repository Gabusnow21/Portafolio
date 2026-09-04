export interface Project {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  type: 'WEB' | 'MOBILE';
  status: 'IN_PROGRESS' | 'COMPLETED' | 'MAINTAINED';
  repoUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  startDate?: string;
  endDate?: string;
  viewsCount: number;
  technologies: Technology[];
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  id: number;
  name: string;
  category: string;
  icon?: string;
  color: string;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  archived: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export type ProjectType = 'WEB' | 'MOBILE';
export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED' | 'MAINTAINED';

export interface CreateProjectRequest {
  title: string;
  shortDescription: string;
  description: string;
  type: ProjectType;
  status?: ProjectStatus;
  repoUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  technologyIds: number[];
}

export interface TechnologyRequest {
  name: string;
  category: string;
  icon?: string;
  color?: string;
}
