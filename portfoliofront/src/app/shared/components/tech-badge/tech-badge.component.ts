import { Component, Input } from '@angular/core';
import { Technology } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  template: `
    <span class="badge" [style.background]="tech.color + '20'" [style.color]="tech.color" [style.border-color]="tech.color + '40'">
      {{ tech.name }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid;
      white-space: nowrap;
    }
  `]
})
export class TechBadgeComponent {
  @Input({ required: true }) tech!: Technology;
}
