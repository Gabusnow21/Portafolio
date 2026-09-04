import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./features/projects/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/projects',
    loadComponent: () => import('./features/admin/admin-projects.component').then(m => m.AdminProjectsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/technologies',
    loadComponent: () => import('./features/admin/admin-technologies.component').then(m => m.AdminTechnologiesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/messages',
    loadComponent: () => import('./features/admin/admin-messages.component').then(m => m.AdminMessagesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    redirectTo: 'admin/dashboard',
    pathMatch: 'prefix'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
