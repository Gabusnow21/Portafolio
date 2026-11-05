import { Component, Input } from '@angular/core';
import { Technology } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  template: `
    <span class="tech-badge" [style.--tech-color]="tech.color">
      <span class="tech-badge__dot" aria-hidden="true"></span>
      {{ tech.name }}
    </span>
  `,
  styles: [`
    .tech-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.6rem;
      border: 1px solid color-mix(in srgb, var(--tech-color) 65%, var(--rpg-text));
      background: color-mix(in srgb, var(--tech-color) 14%, transparent);
      color: var(--rpg-text);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      line-height: 1.4;
      white-space: nowrap;
    }

    .tech-badge__dot {
      width: 8px;
      height: 8px;
      flex: 0 0 auto;
      background: var(--tech-color);
      box-shadow: 1px 1px 0 var(--rpg-shadow);
    }
  `]
})
export class TechBadgeComponent {
  @Input({ required: true }) tech!: Technology;
}
