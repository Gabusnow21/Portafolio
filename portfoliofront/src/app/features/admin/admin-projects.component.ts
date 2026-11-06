import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { TechnologyService } from '../../core/services/technology.service';
import {
  Project, Technology, CreateProjectRequest,
  ProjectType, ProjectStatus
} from '../../core/models/portfolio.models';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <section class="section">
      <div class="container">
        <div class="admin-nav">
          <a routerLink="/admin/dashboard" class="back-link">&larr; Dashboard</a>
          <button class="btn btn-primary" (click)="openCreate()">+ Nuevo Proyecto</button>
        </div>

        <div class="page-head">
          <h1>Gestionar Proyectos</h1>
          <p class="subtitle">Crea, edita y elimina los proyectos de tu portafolio.</p>
        </div>

        @if (error()) {
          <div class="error-banner">{{ error() }}</div>
        }

        <div class="card table-card">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Destacado</th>
                <th class="actions-col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (p of projects(); track p.id) {
                <tr>
                  <td>
                    <strong>{{ p.title }}</strong>
                    <small>{{ p.shortDescription }}</small>
                  </td>
                  <td><span class="badge" [class.mobile]="p.type === 'MOBILE'">{{ p.type }}</span></td>
                  <td>{{ p.status }}</td>
                  <td>{{ p.featured ? 'Sí' : 'No' }}</td>
                  <td class="actions-col">
                    <button class="btn btn-sm" (click)="openEdit(p)">Editar</button>
                    <button class="btn btn-sm btn-danger" (click)="remove(p)">Eliminar</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="5" class="empty">No hay proyectos registrados.</td></tr>
              }
            </tbody>
          </table>
        </div>

        @if (showForm()) {
          <div class="modal-backdrop" (click)="closeForm()">
            <div class="modal" (click)="$event.stopPropagation()">
              <div class="modal-head">
                <h3>{{ editingId() ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h3>
                <button class="modal-close" (click)="closeForm()">&times;</button>
              </div>
              <form [formGroup]="form" (ngSubmit)="save()">
                <div class="form-group">
                  <label>Título *</label>
                  <input type="text" formControlName="title" placeholder="Nombre del proyecto">
                </div>
                <div class="form-group">
                  <label>Descripción corta *</label>
                  <input type="text" formControlName="shortDescription" placeholder="Resumen (máx. 200)">
                </div>
                <div class="form-group">
                  <label>Descripción completa *</label>
                  <textarea formControlName="description" rows="4" placeholder="Detalle del proyecto"></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Tipo *</label>
                    <select formControlName="type">
                      <option value="WEB">Web</option>
                      <option value="MOBILE">Móvil</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Estado</label>
                    <select formControlName="status">
                      <option value="IN_PROGRESS">En progreso</option>
                      <option value="COMPLETED">Completado</option>
                      <option value="MAINTAINED">En mantenimiento</option>
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Repo URL</label>
                    <input type="text" formControlName="repoUrl" placeholder="https://github.com/...">
                  </div>
                  <div class="form-group">
                    <label>Demo URL</label>
                    <input type="text" formControlName="demoUrl" placeholder="https://...">
                  </div>
                </div>
                <div class="form-group">
                  <label>Imagen URL</label>
                  <input type="text" formControlName="imageUrl" placeholder="https://...">
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Fecha inicio</label>
                    <input type="date" formControlName="startDate">
                  </div>
                  <div class="form-group">
                    <label>Fecha fin</label>
                    <input type="date" formControlName="endDate">
                  </div>
                </div>
                <div class="form-group checkbox">
                  <label>
                    <input type="checkbox" formControlName="featured"> Destacado en la portada
                  </label>
                </div>
                <div class="form-group">
                  <label>Tecnologías</label>
                  <div class="tech-picker">
                    @for (t of technologies(); track t.id) {
                      <label class="tech-chip">
                        <input type="checkbox" [value]="t.id" (change)="toggleTech(t.id, $event)">
                        {{ t.name }}
                      </label>
                    } @empty {
                      <span class="empty">No hay tecnologías registradas.</span>
                    }
                  </div>
                </div>

                @if (formError()) {
                  <div class="error-banner">{{ formError() }}</div>
                }

                <div class="modal-actions">
                  <button type="button" class="btn btn-outline" (click)="closeForm()">Cancelar</button>
                  <button type="submit" class="btn btn-primary" [disabled]="saving()">
                    {{ saving() ? 'Guardando...' : 'Guardar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .admin-nav {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;
    }
    .back-link { color: var(--accent); text-decoration: none; font-size: 0.95rem; }
    .page-head h1 { font-size: 1.8rem; margin-bottom: 0.3rem; }
    .subtitle { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .error-banner {
      background: #fef2f2; color: #dc3545; padding: 0.75rem;
      border-radius: var(--radius); font-size: 0.85rem; margin-bottom: 1rem;
    }
    [data-theme='dark'] .error-banner { background: #3b1111; }

    .table-card { padding: 1.25rem; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.75rem 0.5rem; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
    th { color: var(--text-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.03em; }
    td strong { display: block; }
    td small { color: var(--text-muted); font-size: 0.8rem; }
    .actions-col { width: 150px; }
    .badge {
      display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px;
      background: #eef2ff; color: #4f46e5; font-size: 0.75rem; font-weight: 600;
    }
    .badge.mobile { background: #f0fdf4; color: #16a34a; }
    .btn-sm { padding: 0.3rem 0.7rem; font-size: 0.8rem; margin-right: 0.35rem; }
    .btn-danger { background: #dc3545; color: #fff; }
    .btn-danger:hover { background: #c82333; }
    .empty { text-align: center; color: var(--text-muted); padding: 2rem 0; }

    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem; z-index: 100;
    }
    .modal {
      background: var(--bg-primary); border: 1px solid var(--border);
      border-radius: var(--radius-lg); max-width: 640px; width: 100%;
      max-height: 90vh; overflow-y: auto; padding: 1.5rem;
    }
    .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
    .modal-head h3 { font-size: 1.2rem; }
    .modal-close {
      background: none; border: none; font-size: 1.6rem; cursor: pointer;
      color: var(--text-muted); line-height: 1;
    }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-secondary); }
    .form-group input, .form-group textarea, .form-group select {
      width: 100%; padding: 0.6rem 0.75rem;
      border: 1px solid var(--border); border-radius: var(--radius);
      background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem; font-family: inherit;
    }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
      outline: none; border-color: var(--accent);
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group.checkbox label { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); font-weight: 400; }
    .tech-picker { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .tech-chip {
      display: flex; align-items: center; gap: 0.35rem;
      border: 1px solid var(--border); border-radius: 999px;
      padding: 0.35rem 0.75rem; font-size: 0.8rem; cursor: pointer;
    }
    .tech-chip input { width: auto; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
    @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class AdminProjectsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly techService = inject(TechnologyService);

  projects = signal<Project[]>([]);
  technologies = signal<Technology[]>([]);
  selectedTech = new Set<number>();
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);
  error = signal('');
  formError = signal('');

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    shortDescription: ['', Validators.required],
    description: ['', Validators.required],
    type: ['WEB', Validators.required],
    status: ['COMPLETED'],
    repoUrl: [''],
    demoUrl: [''],
    imageUrl: [''],
    startDate: [''],
    endDate: [''],
    featured: [false]
  });

  ngOnInit(): void {
    this.loadProjects();
    this.techService.listAll().subscribe({ next: (t) => this.technologies.set(t) });
  }

  loadProjects(): void {
    this.projectService.list(0, 100).subscribe({
      next: (page) => this.projects.set(page.content)
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.selectedTech.clear();
    this.form.reset({ type: 'WEB', status: 'COMPLETED', featured: false });
    this.formError.set('');
    this.showForm.set(true);
  }

  openEdit(p: Project): void {
    this.editingId.set(p.id);
    this.selectedTech = new Set(p.technologies.map(t => t.id));
    this.form.patchValue({
      title: p.title,
      shortDescription: p.shortDescription,
      description: p.description,
      type: p.type,
      status: p.status,
      repoUrl: p.repoUrl || '',
      demoUrl: p.demoUrl || '',
      imageUrl: p.imageUrl || '',
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      featured: p.featured
    });
    this.formError.set('');
    this.showForm.set(true);
  }

  closeForm(): void {
    if (this.saving()) return;
    this.showForm.set(false);
  }

  toggleTech(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedTech.add(id);
    } else {
      this.selectedTech.delete(id);
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.formError.set('Completa los campos obligatorios.');
      return;
    }

    this.saving.set(true);
    this.formError.set('');

    const request: CreateProjectRequest = {
      ...this.form.value,
      technologyIds: Array.from(this.selectedTech)
    };

    const id = this.editingId();
    const op = id
      ? this.projectService.update(id, request)
      : this.projectService.create(request);

    op.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.loadProjects();
      },
      error: (e) => {
        this.saving.set(false);
        this.formError.set(e?.error?.detail || 'Error al guardar el proyecto.');
      }
    });
  }

  remove(p: Project): void {
    if (!confirm(`¿Eliminar el proyecto "${p.title}"?`)) return;
    this.projectService.delete(p.id).subscribe({
      next: () => this.loadProjects(),
      error: () => this.error.set('Error al eliminar el proyecto.')
    });
  }
}
