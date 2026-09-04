import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnologyService } from '../../core/services/technology.service';
import { Technology } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-admin-technologies',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <section class="section">
      <div class="container">
        <div class="admin-nav">
          <a routerLink="/admin/dashboard" class="back-link">&larr; Dashboard</a>
          <button class="btn btn-primary" (click)="openCreate()">+ Nueva Tecnología</button>
        </div>

        <div class="page-head">
          <h1>Gestionar Tecnologías</h1>
          <p class="subtitle">Administra las tecnologías del stack de tu portafolio.</p>
        </div>

        @if (error()) {
          <div class="error-banner">{{ error() }}</div>
        }

        <div class="card table-card">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Icono</th>
                <th>Color</th>
                <th class="actions-col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (t of technologies(); track t.id) {
                <tr>
                  <td>
                    <span class="dot" [style.background]="t.color"></span>
                    <strong>{{ t.name }}</strong>
                  </td>
                  <td><span class="badge">{{ t.category }}</span></td>
                  <td><code>{{ t.icon || '—' }}</code></td>
                  <td><code>{{ t.color }}</code></td>
                  <td class="actions-col">
                    <button class="btn btn-sm" (click)="openEdit(t)">Editar</button>
                    <button class="btn btn-sm btn-danger" (click)="remove(t)">Eliminar</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="5" class="empty">No hay tecnologías registradas.</td></tr>
              }
            </tbody>
          </table>
        </div>

        @if (showForm()) {
          <div class="modal-backdrop" (click)="closeForm()">
            <div class="modal" (click)="$event.stopPropagation()">
              <div class="modal-head">
                <h3>{{ editingId() ? 'Editar Tecnología' : 'Nueva Tecnología' }}</h3>
                <button class="modal-close" (click)="closeForm()">&times;</button>
              </div>
              <form [formGroup]="form" (ngSubmit)="save()">
                <div class="form-group">
                  <label>Nombre *</label>
                  <input type="text" formControlName="name" placeholder="Ej: Angular">
                </div>
                <div class="form-group">
                  <label>Categoría *</label>
                  <select formControlName="category">
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="mobile">Móvil</option>
                    <option value="db">Base de datos</option>
                    <option value="devops">DevOps</option>
                    <option value="tool">Herramienta</option>
                  </select>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Icono</label>
                    <input type="text" formControlName="icon" placeholder="angular.svg">
                  </div>
                  <div class="form-group">
                    <label>Color</label>
                    <input type="text" formControlName="color" placeholder="#DD0031">
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
    td strong { margin-left: 0.4rem; }
    td code { background: var(--bg-secondary); padding: 0.15rem 0.4rem; border-radius: var(--radius-sm, 4px); font-size: 0.8rem; }
    .dot { display: inline-block; width: 0.7rem; height: 0.7rem; border-radius: 50%; vertical-align: middle; }
    .badge {
      display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px;
      background: #eef2ff; color: #4f46e5; font-size: 0.75rem; font-weight: 600;
    }
    .actions-col { width: 150px; }
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
      border-radius: var(--radius-lg); max-width: 480px; width: 100%;
      padding: 1.5rem;
    }
    .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
    .modal-head h3 { font-size: 1.2rem; }
    .modal-close {
      background: none; border: none; font-size: 1.6rem; cursor: pointer;
      color: var(--text-muted); line-height: 1;
    }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.35rem; color: var(--text-secondary); }
    .form-group input, .form-group select {
      width: 100%; padding: 0.6rem 0.75rem;
      border: 1px solid var(--border); border-radius: var(--radius);
      background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem; font-family: inherit;
    }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--accent); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
    @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class AdminTechnologiesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly techService = inject(TechnologyService);

  technologies = signal<Technology[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);
  error = signal('');
  formError = signal('');

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: ['frontend', Validators.required],
    icon: [''],
    color: ['#888888']
  });

  ngOnInit(): void {
    this.loadTechnologies();
  }

  loadTechnologies(): void {
    this.techService.listAll().subscribe({
      next: (t) => this.technologies.set(t)
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ category: 'frontend', color: '#888888' });
    this.formError.set('');
    this.showForm.set(true);
  }

  openEdit(t: Technology): void {
    this.editingId.set(t.id);
    this.form.patchValue({
      name: t.name,
      category: t.category,
      icon: t.icon || '',
      color: t.color
    });
    this.formError.set('');
    this.showForm.set(true);
  }

  closeForm(): void {
    if (this.saving()) return;
    this.showForm.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.formError.set('Completa los campos obligatorios.');
      return;
    }

    this.saving.set(true);
    this.formError.set('');

    const id = this.editingId();
    const op = id
      ? this.techService.update(id, this.form.value)
      : this.techService.create(this.form.value);

    op.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.loadTechnologies();
      },
      error: (e) => {
        this.saving.set(false);
        this.formError.set(e?.error?.detail || 'Error al guardar la tecnología.');
      }
    });
  }

  remove(t: Technology): void {
    if (!confirm(`¿Eliminar la tecnología "${t.name}"?`)) return;
    this.techService.delete(t.id).subscribe({
      next: () => this.loadTechnologies(),
      error: () => this.error.set('Error al eliminar la tecnología.')
    });
  }
}
