import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/portfolio.models';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { PixelIconComponent } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../shared/ui/rpg-button/rpg-button.directive';
import { RpgWindowComponent } from '../../shared/ui/rpg-window/rpg-window.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    ProjectCardComponent,
    PixelIconComponent,
    RpgButtonDirective,
    RpgWindowComponent
  ],
  template: `
    <section class="rpg-section quests">
      <div class="container">
        <header class="quests__head">
          <span class="rpg-section__eyebrow">// TABLÓN DE MISIONES</span>
          <h1 class="rpg-section__title">Quest Log</h1>
          <p class="rpg-section__lead">
            Proyectos web y móviles donde he trabajado. Filtra por tipo, busca por
            nombre o tecnología y abre cualquier misión para ver el detalle.
          </p>
        </header>

        <app-rpg-window variant="dialogue" title="Filtros">
          <div class="quests__filters">
            <div class="filter-group" role="group" aria-label="Filtrar por tipo de misión">
              <span class="filter-group__label">Tipo</span>
              <button
                type="button"
                appRpgButton
                size="sm"
                [variant]="selectedType === '' ? 'primary' : 'secondary'"
                [attr.aria-pressed]="selectedType === ''"
                (click)="setType('')"
              >
                Todas
              </button>
              <button
                type="button"
                appRpgButton
                size="sm"
                [variant]="selectedType === 'WEB' ? 'primary' : 'secondary'"
                [attr.aria-pressed]="selectedType === 'WEB'"
                (click)="setType('WEB')"
              >
                Web
              </button>
              <button
                type="button"
                appRpgButton
                size="sm"
                [variant]="selectedType === 'MOBILE' ? 'primary' : 'secondary'"
                [attr.aria-pressed]="selectedType === 'MOBILE'"
                (click)="setType('MOBILE')"
              >
                Móvil
              </button>
            </div>

            <div class="filter-group filter-group--search">
              <label for="quest-search" class="filter-group__label">Buscar</label>
              <input
                id="quest-search"
                type="search"
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
                placeholder="Nombre o tecnología..."
              >
              <button type="button" appRpgButton variant="primary" size="sm" (click)="onSearch()">
                <app-pixel-icon name="scroll" [size]="14" />
                Buscar
              </button>
              @if (hasFilters()) {
                <button type="button" appRpgButton variant="ghost" size="sm" (click)="clearFilters()">
                  Limpiar
                </button>
              }
            </div>
          </div>
        </app-rpg-window>

        @if (!loading() && !errorMessage()) {
          <div class="quests__meta">
            <p>
              @if (totalElements() > 0) {
                {{ totalElements() }} {{ totalElements() === 1 ? 'misión registrada' : 'misiones registradas' }}
              } @else {
                Sin misiones que mostrar
              }
            </p>
            @if (totalPages() > 1) {
              <p>Página {{ currentPage() + 1 }} de {{ totalPages() }}</p>
            }
          </div>
        }

        @if (loading()) {
          <app-rpg-window variant="dialogue">
            <p class="rpg-blink quests__state">Cargando misiones...</p>
          </app-rpg-window>
        } @else if (errorMessage()) {
          <app-rpg-window variant="dialogue">
            <div class="quests__state">
              <p>{{ errorMessage() }}</p>
              <button type="button" appRpgButton variant="secondary" size="sm" (click)="loadProjects()">
                Reintentar
              </button>
            </div>
          </app-rpg-window>
        } @else if (projects().length === 0) {
          <app-rpg-window variant="dialogue">
            <div class="quests__state">
              <p>No se encontraron misiones con esos filtros.</p>
              @if (hasFilters()) {
                <button type="button" appRpgButton variant="secondary" size="sm" (click)="clearFilters()">
                  Limpiar filtros
                </button>
              }
            </div>
          </app-rpg-window>
        } @else {
          <div class="projects-grid">
            @for (project of projects(); track project.id) {
              <app-project-card [project]="project" />
            }
          </div>

          @if (totalPages() > 1) {
            <nav class="quests__pagination" aria-label="Paginación de misiones">
              <button
                type="button"
                appRpgButton
                variant="secondary"
                size="sm"
                (click)="prevPage()"
                [disabled]="currentPage() === 0"
              >
                <app-pixel-icon name="arrow-right" [size]="14" class="quests__arrow-back" />
                Anterior
              </button>
              <span class="quests__page">Página {{ currentPage() + 1 }} / {{ totalPages() }}</span>
              <button
                type="button"
                appRpgButton
                variant="secondary"
                size="sm"
                (click)="nextPage()"
                [disabled]="currentPage() >= totalPages() - 1"
              >
                Siguiente
                <app-pixel-icon name="arrow-right" [size]="14" />
              </button>
            </nav>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    .quests {
      padding-top: var(--space-12);
    }

    .quests__head {
      max-width: 75ch;
      margin-bottom: var(--space-6);
    }

    .quests__filters {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-5);
    }

    .filter-group {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .filter-group__label {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .filter-group--search {
      flex: 1;
      min-width: 280px;
    }

    .filter-group--search input {
      flex: 1;
      min-width: 160px;
    }

    .quests__meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin: var(--space-4) 0;
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-6);
    }

    .quests__state {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
      color: var(--rpg-text-muted);
    }

    .quests__pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--space-3);
      margin-top: var(--space-8);
    }

    .quests__page {
      color: var(--rpg-text-muted);
      font-size: var(--text-sm);
    }

    .quests__arrow-back {
      transform: rotate(180deg);
    }

    @media (max-width: 720px) {
      .quests {
        padding-top: var(--space-8);
      }

      .filter-group--search {
        min-width: 100%;
      }
    }
  `]
})
export class ProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);

  projects = signal<Project[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);
  selectedType = '';
  searchQuery = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedType = params['type'] || '';
      this.searchQuery = params['q'] || '';
      this.loadProjects();
    });
  }

  hasFilters(): boolean {
    return this.selectedType !== '' || this.searchQuery.trim() !== '';
  }

  setType(type: string): void {
    this.selectedType = type;
    this.currentPage.set(0);
    this.loadProjects();
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadProjects();
  }

  clearFilters(): void {
    this.selectedType = '';
    this.searchQuery = '';
    this.currentPage.set(0);
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const page = this.currentPage();
    const query = this.searchQuery.trim();

    const request = query
      ? this.projectService.search(query, page)
      : this.selectedType
        ? this.projectService.listByType(this.selectedType, page)
        : this.projectService.list(page);

    request.subscribe({
      next: (res) => {
        this.projects.set(res.content);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.projects.set([]);
        this.totalPages.set(1);
        this.totalElements.set(0);
        this.errorMessage.set('No se pudo cargar el tablón de misiones. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  nextPage(): void {
    this.currentPage.update((page) => page + 1);
    this.loadProjects();
  }

  prevPage(): void {
    this.currentPage.update((page) => Math.max(0, page - 1));
    this.loadProjects();
  }
}
