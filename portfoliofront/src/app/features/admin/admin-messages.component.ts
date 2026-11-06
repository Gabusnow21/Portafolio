import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <section class="section">
      <div class="container">
        <div class="admin-nav">
          <a routerLink="/admin/dashboard" class="back-link">&larr; Dashboard</a>
        </div>

        <div class="page-head">
          <h1>Bandeja de Mensajes</h1>
          <p class="subtitle">
            Mensajes recibidos del formulario de contacto.
            <span class="unread-pill">{{ unread() }} sin leer</span>
          </p>
        </div>

        @if (error()) {
          <div class="error-banner">{{ error() }}</div>
        }

        <div class="messages-list">
          @for (m of messages(); track m.id) {
            <div class="card message-card" [class.unread]="!m.isRead" [class.archived]="m.archived">
              <div class="message-head">
                <div class="message-sender">
                  <span class="avatar">{{ m.name.charAt(0) }}</span>
                  <div>
                    <strong>{{ m.name }}</strong>
                    <a [href]="'mailto:' + m.email" class="email">{{ m.email }}</a>
                  </div>
                </div>
                <span class="date">{{ m.createdAt | date:'d MMM yyyy, HH:mm' }}</span>
              </div>
              <h4>{{ m.subject }}</h4>
              <p class="message-body">{{ m.message }}</p>
              <div class="message-actions">
                @if (!m.isRead) {
                  <button class="btn btn-sm" (click)="markRead(m)">Marcar leído</button>
                }
                @if (!m.archived) {
                  <button class="btn btn-sm btn-outline" (click)="toggleArchive(m)">Archivar</button>
                } @else {
                  <button class="btn btn-sm btn-outline" (click)="toggleArchive(m)">Desarchivar</button>
                }
                <button class="btn btn-sm btn-danger" (click)="remove(m)">Eliminar</button>
              </div>
            </div>
          } @empty {
            <div class="card empty-card">
              <p>No hay mensajes en la bandeja.</p>
            </div>
          }
        </div>

        <div class="pagination">
          <button class="btn btn-outline" [disabled]="page() === 0" (click)="changePage(page() - 1)">&larr; Anterior</button>
          <span class="page-info">Página {{ page() + 1 }} de {{ max(1, pages()) }}</span>
          <button class="btn btn-outline" [disabled]="page() + 1 >= pages()" (click)="changePage(page() + 1)">Siguiente &rarr;</button>
        </div>
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
    .subtitle { color: var(--text-secondary); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .unread-pill {
      display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px;
      background: #eef2ff; color: #4f46e5; font-size: 0.75rem; font-weight: 600;
    }
    .error-banner {
      background: #fef2f2; color: #dc3545; padding: 0.75rem;
      border-radius: var(--radius); font-size: 0.85rem; margin-bottom: 1rem;
    }
    [data-theme='dark'] .error-banner { background: #3b1111; }

    .messages-list { display: flex; flex-direction: column; gap: 1rem; }
    .message-card { padding: 1.25rem; }
    .message-card.unread { border-left: 3px solid var(--accent); }
    .message-card.archived { opacity: 0.6; }
    .message-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;
    }
    .message-sender { display: flex; gap: 0.75rem; align-items: center; }
    .avatar {
      width: 2.5rem; height: 2.5rem; border-radius: 50%;
      background: var(--accent); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700;
    }
    .message-sender strong { display: block; }
    .email { color: var(--text-muted); font-size: 0.85rem; text-decoration: none; }
    .email:hover { color: var(--accent); }
    .date { color: var(--text-muted); font-size: 0.8rem; }
    h4 { font-size: 1rem; margin-bottom: 0.5rem; }
    .message-body { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem; white-space: pre-wrap; }
    .message-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .btn-sm { padding: 0.35rem 0.8rem; font-size: 0.8rem; }
    .btn-danger { background: #dc3545; color: #fff; }
    .btn-danger:hover { background: #c82333; }

    .empty-card { text-align: center; padding: 3rem; color: var(--text-muted); }

    .pagination {
      display: flex; justify-content: center; align-items: center; gap: 1rem;
      margin-top: 2rem;
    }
    .page-info { color: var(--text-muted); font-size: 0.9rem; }
  `]
})
export class AdminMessagesComponent implements OnInit {
  private readonly contactService = inject(ContactService);

  messages = signal<ContactMessage[]>([]);
  page = signal(0);
  pages = signal(0);
  unread = signal(0);
  error = signal('');

  ngOnInit(): void {
    this.loadUnread();
    this.loadMessages();
  }

  loadMessages(): void {
    this.contactService.list(this.page(), 10).subscribe({
      next: (p) => {
        this.messages.set(p.content);
        this.pages.set(p.totalPages);
      },
      error: () => this.error.set('Error al cargar los mensajes.')
    });
  }

  loadUnread(): void {
    this.contactService.countUnread().subscribe({
      next: (n) => this.unread.set(n)
    });
  }

  changePage(p: number): void {
    if (p < 0) return;
    this.page.set(p);
    this.loadMessages();
  }

  markRead(m: ContactMessage): void {
    this.contactService.markAsRead(m.id).subscribe({
      next: () => {
        m.isRead = true;
        this.messages.set([...this.messages()]);
        this.loadUnread();
      }
    });
  }

  toggleArchive(m: ContactMessage): void {
    this.contactService.archive(m.id).subscribe({
      next: () => {
        m.archived = !m.archived;
        this.messages.set([...this.messages()]);
      }
    });
  }

  remove(m: ContactMessage): void {
    if (!confirm(`¿Eliminar el mensaje de "${m.name}"?`)) return;
    this.contactService.delete(m.id).subscribe({
      next: () => {
        this.messages.set(this.messages().filter(x => x.id !== m.id));
        this.loadUnread();
      },
      error: () => this.error.set('Error al eliminar el mensaje.')
    });
  }

  max(a: number, b: number): number {
    return Math.max(a, b);
  }
}