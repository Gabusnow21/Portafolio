import { Component, Input } from '@angular/core';

export type RpgWindowVariant = 'panel' | 'dialogue' | 'parchment';

@Component({
  selector: 'app-rpg-window',
  standalone: true,
  template: `
    <div
      class="rpg-window"
      [class.rpg-window--panel]="variant === 'panel'"
      [class.rpg-window--dialogue]="variant === 'dialogue'"
      [class.rpg-window--parchment]="variant === 'parchment'"
    >
      @if (title) {
        @switch (titleLevel) {
          @case (1) {
            <h1 class="rpg-window__title">{{ title }}</h1>
          }
          @case (3) {
            <h3 class="rpg-window__title">{{ title }}</h3>
          }
          @case (4) {
            <h4 class="rpg-window__title">{{ title }}</h4>
          }
          @default {
            <h2 class="rpg-window__title">{{ title }}</h2>
          }
        }
      }
      <div class="rpg-window__body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RpgWindowComponent {
  @Input() variant: RpgWindowVariant = 'panel';
  @Input() title?: string;
  @Input() titleLevel: 1 | 2 | 3 | 4 = 2;
}
