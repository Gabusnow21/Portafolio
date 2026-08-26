import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { TechnologyService } from '../../core/services/technology.service';
import { Project, Technology } from '../../core/models/portfolio.models';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, ProjectCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1>Proyectos</h1>
        <p class="subtitle">Explora mis proyectos web y móviles.</p>

        <div class="filters">
          <div class="filter-group">
            <label>Tipo:</label>
            <select [(ngModel)]="selectedType" (change)="onFilterChange()">
              <option value="">Todos</option>
              <option value="WEB">Web</option>
              <option value="MOBILE">Móvil</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Buscar:</label>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar proyecto..." (keyup.enter)="onSearch()">
          </div>
        </div>

        @if (loading()) {
          <div class="loading">Cargando proyectos...</div>
        } @else if (projects().length === 0) {
          <div class="empty">No se encontraron proyectos.</div>
        } @else {
          <div class="projects-grid">
            @for (project of projects(); track project.id) {
              <app-project-card [project]="project" />
            }
          </div>

          @if (totalPages() > 1) {
            <div class="pagination">
              <button class="btn btn-outline" (click)="prevPage()" [disabled]="currentPage() === 0">Anterior</button>
              <span class="page-info">Página {{ currentPage() + 1 }} de {{ totalPages() }}</span>
              <button class="btn btn-outline" (click)="nextPage()" [disabled]="currentPage() >= totalPages() - 1">Siguiente</button>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-secondary); margin-bottom: 2rem; }
    .filters {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .filter-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .filter-group select,
    .filter-group input {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .loading, .empty {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    .page-info {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
  `]
})
export class ProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);

  projects = signal<Project[]>([]);
  loading = signal(true);
  currentPage = signal(0);
  totalPages = signal(1);
  selectedType = '';
  searchQuery = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedType = params['type'] || '';
      this.searchQuery = params['q'] || '';
      this.loadProjects();
    });
  }

  loadProjects(): void {
    this.loading.set(true);
    const page = this.currentPage();

    let request;
    if (this.searchQuery) {
      request = this.projectService.search(this.searchQuery, page);
    } else if (this.selectedType) {
      request = this.projectService.listByType(this.selectedType, page);
    } else {
      request = this.projectService.list(page);
    }

    request.subscribe({
      next: (res) => {
        this.projects.set(res.content);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onFilterChange(): void {
    this.currentPage.set(0);
    this.loadProjects();
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadProjects();
  }

  nextPage(): void {
    this.currentPage.update(p => p + 1);
    this.loadProjects();
  }

  prevPage(): void {
    this.currentPage.update(p => Math.max(0, p - 1));
    this.loadProjects();
  }
}
