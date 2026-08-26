import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container footer-inner">
        <p>&copy; {{ currentYear }} Portfolio. Desarrollado con Angular y Spring Boot.</p>
        <div class="footer-links">
          <a href="https://github.com/Gabusnow21" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: auto;
      padding: 1.5rem 0;
      border-top: 1px solid var(--border);
      background: var(--bg-secondary);
    }
    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .footer p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .footer-links {
      display: flex;
      gap: 1rem;
    }
    .footer-links a {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .footer-links a:hover {
      color: var(--accent);
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
