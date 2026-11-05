import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pixel-avatar',
  standalone: true,
  template: `
    <div
      class="avatar"
      [style.--avatar-size]="size + 'px'"
      role="img"
      [attr.aria-label]="alt"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        shape-rendering="crispEdges"
        aria-hidden="true"
        focusable="false"
      >
        <g class="avatar__cloak-dark">
          <rect x="3" y="4" width="2" height="1" />
          <rect x="11" y="4" width="2" height="1" />
          <rect x="2" y="9" width="2" height="1" />
          <rect x="12" y="9" width="2" height="1" />
          <rect x="3" y="13" width="10" height="2" />
        </g>

        <g class="avatar__cloak">
          <rect x="3" y="5" width="2" height="4" />
          <rect x="11" y="5" width="2" height="4" />
          <rect x="4" y="9" width="8" height="1" />
          <rect x="2" y="10" width="12" height="3" />
          <rect x="3" y="12" width="10" height="1" />
        </g>

        <g class="avatar__cloak-light">
          <rect x="4" y="10" width="2" height="3" />
          <rect x="3" y="12" width="1" height="1" />
        </g>

        <g class="avatar__hood">
          <rect x="6" y="1" width="4" height="1" />
          <rect x="5" y="2" width="6" height="1" />
          <rect x="4" y="3" width="8" height="1" />
          <rect x="3" y="4" width="1" height="1" />
          <rect x="12" y="4" width="1" height="1" />
        </g>

        <g class="avatar__skin">
          <rect x="5" y="4" width="6" height="1" />
          <rect x="5" y="5" width="6" height="4" />
        </g>

        <g class="avatar__skin-shadow">
          <rect x="5" y="8" width="6" height="1" />
          <rect x="8" y="7" width="1" height="1" />
        </g>

        <g class="avatar__eye">
          <rect x="6" y="6" width="1" height="1" />
          <rect x="9" y="6" width="1" height="1" />
          <rect x="7" y="8" width="2" height="1" />
        </g>

        <g class="avatar__gold">
          <rect x="7" y="3" width="2" height="1" />
          <rect x="7" y="10" width="2" height="1" />
          <rect x="4" y="10" width="1" height="1" />
          <rect x="11" y="10" width="1" height="1" />
        </g>
      </svg>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .avatar {
      width: var(--avatar-size, 128px);
      aspect-ratio: 1;
      overflow: hidden;
      border: 2px solid var(--rpg-gold);
      background:
        radial-gradient(circle at 50% 38%, #1b3a8f 0%, #0d1b4c 58%, #070b1a 100%);
      box-shadow:
        inset 2px 2px 0 var(--rpg-bevel-light),
        inset -2px -2px 0 var(--rpg-bevel-dark),
        0 0 0 2px var(--rpg-ink),
        var(--shadow-hard);
      image-rendering: pixelated;
    }

    svg {
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
    }

    .avatar__cloak-dark { fill: #101a4a; }
    .avatar__cloak { fill: #2f4aa8; }
    .avatar__cloak-light { fill: #4a6fd4; }
    .avatar__hood { fill: #1b2a6b; }
    .avatar__skin { fill: #e0b68a; }
    .avatar__skin-shadow { fill: #b9865a; }
    .avatar__eye { fill: #070b1a; }
    .avatar__gold { fill: #e0b64a; }
  `]
})
export class PixelAvatarComponent {
  @Input() size = 128;
  @Input() alt = 'Retrato pixel art de Gabus';
}
