import { Component, Input } from '@angular/core';

export type StatTone = 'hp' | 'mp' | 'exp' | 'gold';

@Component({
  selector: 'app-stat-bar',
  standalone: true,
  template: `
    <div class="stat">
      <div class="stat__head">
        <span class="stat__label">{{ label }}</span>
        <span class="stat__value">
          {{ value }}<span class="stat__max">/{{ max }}</span>
        </span>
      </div>

      <div
        class="stat__track"
        role="progressbar"
        [attr.aria-label]="ariaLabel || label + ': ' + value + ' de ' + max"
        [attr.aria-valuenow]="value"
        aria-valuemin="0"
        [attr.aria-valuemax]="max"
        [attr.aria-valuetext]="value + ' de ' + max"
      >
        <span
          class="stat__fill"
          [class.stat__fill--hp]="tone === 'hp'"
          [class.stat__fill--mp]="tone === 'mp'"
          [class.stat__fill--exp]="tone === 'exp'"
          [class.stat__fill--gold]="tone === 'gold'"
          [style.--stat-value]="percent + '%'"
        ></span>
      </div>

      @if (hint) {
        <p class="stat__hint">{{ hint }}</p>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .stat__head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--space-3);
    }

    .stat__label {
      color: var(--rpg-text);
      font-family: var(--font-display);
      font-size: var(--text-base);
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .stat__value {
      color: var(--rpg-gold-pale);
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      font-variant-numeric: tabular-nums;
    }

    .stat__max {
      color: var(--rpg-text-dim);
      font-size: 0.8em;
    }

    .stat__track {
      position: relative;
      height: 14px;
      overflow: hidden;
      border: 2px solid var(--rpg-text-dim);
      background: var(--rpg-ink);
      box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.65);
    }

    .stat__track::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: repeating-linear-gradient(
        90deg,
        transparent 0 12px,
        rgba(0, 0, 0, 0.28) 12px 14px
      );
    }

    .stat__fill {
      display: block;
      width: var(--stat-value);
      height: 100%;
      background-color: var(--rpg-gold);
      background-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.35) 0%,
        rgba(255, 255, 255, 0.08) 40%,
        rgba(0, 0, 0, 0.22) 100%
      );
      box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.28),
        inset 0 -2px 0 rgba(0, 0, 0, 0.35);
      animation: stat-grow 700ms steps(12, end) both;
    }

    .stat__fill--hp { background-color: var(--rpg-hp); }
    .stat__fill--mp { background-color: var(--rpg-mp); }
    .stat__fill--exp { background-color: var(--rpg-exp); }
    .stat__fill--gold { background-color: var(--rpg-gold); }

    .stat__hint {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
      line-height: 1.4;
    }

    @keyframes stat-grow {
      from { width: 0; }
      to { width: var(--stat-value); }
    }
  `]
})
export class StatBarComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number;
  @Input() max = 100;
  @Input() tone: StatTone = 'gold';
  @Input() hint?: string;
  @Input() ariaLabel?: string;

  get percent(): number {
    if (this.max <= 0) return 0;
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }
}
