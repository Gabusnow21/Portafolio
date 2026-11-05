import { Component } from '@angular/core';
import { PixelIconComponent, PixelIconName } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../shared/ui/rpg-button/rpg-button.directive';
import { RpgWindowComponent } from '../../shared/ui/rpg-window/rpg-window.component';
import { StatBarComponent } from '../../shared/ui/stat-bar/stat-bar.component';

interface Swatch {
  name: string;
  value: string;
}

@Component({
  selector: 'app-styleguide',
  standalone: true,
  imports: [PixelIconComponent, RpgButtonDirective, RpgWindowComponent, StatBarComponent],
  template: `
    <section class="rpg-section styleguide">
      <div class="container stack">
        <header class="styleguide__head">
          <span class="rpg-section__eyebrow">// DESIGN SYSTEM</span>
          <h1 class="rpg-section__title">RPG UI Kit</h1>
          <p class="rpg-section__lead">
            Primitivas visuales del portafolio: Golden Sun para la identidad,
            Dragon Quest VII para la legibilidad. Esta página es interna y sirve
            para validar contraste, estados y responsive.
          </p>
        </header>

        <app-rpg-window variant="panel" title="Paleta">
          <div class="swatches">
            @for (swatch of swatches; track swatch.name) {
              <div class="swatch">
                <span [style.background]="swatch.value"></span>
                <code>{{ swatch.name }}</code>
                <small>{{ swatch.value }}</small>
              </div>
            }
          </div>
        </app-rpg-window>

        <app-rpg-window variant="panel" title="Tipografía">
          <div class="type-demo">
            <p class="type-demo__display">Pixelify Sans — Display</p>
            <p class="type-demo__heading">Títulos de sección y menús</p>
            <p class="type-demo__body">
              IBM Plex Mono se usa para párrafos, descripciones y texto de interfaz.
              Mantiene una lectura cómoda incluso en textos largos y a 16px.
            </p>
            <p class="type-demo__small">Texto auxiliar · 12px · alto contraste</p>
          </div>
        </app-rpg-window>

        <div class="demo-grid">
          <app-rpg-window variant="panel" title="Ventana panel">
            <p class="text-muted">
              Identidad Golden Sun: gradiente azul, trim dorado y esquinas marcadas.
              Ideal para secciones y contenedores principales.
            </p>
          </app-rpg-window>

          <app-rpg-window variant="dialogue" title="Ventana diálogo">
            <p class="text-muted">
              Lectura Dragon Quest VII: azul sólido, borde crema y sin adornos.
              Ideal para texto largo, formularios y mensajes del sistema.
            </p>
          </app-rpg-window>

          <app-rpg-window variant="parchment" title="Ventana pergamino">
            <p>
              Pergamino para notas, pistas y contenido narrativo breve. El texto
              oscuro sobre crema mantiene un contraste alto.
            </p>
          </app-rpg-window>
        </div>

        <app-rpg-window variant="panel" title="Botones">
          <div class="button-row">
            <button type="button" appRpgButton variant="primary">Primario</button>
            <button type="button" appRpgButton variant="secondary">Secundario</button>
            <button type="button" appRpgButton variant="ghost">Fantasma</button>
            <button type="button" appRpgButton variant="primary" size="sm">Pequeño</button>
            <button type="button" appRpgButton variant="primary" size="lg">Grande</button>
            <button type="button" appRpgButton variant="primary" disabled>Deshabilitado</button>
          </div>

          <hr class="rpg-divider rpg-divider--dotted demo-divider" />

          <nav class="rpg-menu" aria-label="Menú de ejemplo">
            <a href="#styleguide" appRpgButton variant="menu" aria-current="page">Nueva partida</a>
            <a href="#styleguide" appRpgButton variant="menu">Continuar</a>
            <a href="#styleguide" appRpgButton variant="menu">Opciones</a>
          </nav>
        </app-rpg-window>

        <app-rpg-window variant="panel" title="Barras de estado">
          <div class="stats-demo">
            <app-stat-bar label="Angular" [value]="92" tone="hp" hint="Componentes, signals y arquitectura" />
            <app-stat-bar label="UX/UI" [value]="86" tone="mp" hint="Sistemas de diseño y accesibilidad" />
            <app-stat-bar label="Spring Boot" [value]="74" tone="exp" hint="API REST, JPA y seguridad" />
            <app-stat-bar label="Nivel de aventura" [value]="20" [max]="20" tone="gold" hint="Experiencia acumulada" />
          </div>
        </app-rpg-window>

        <app-rpg-window variant="panel" title="Iconografía pixel">
          <div class="icon-grid">
            @for (icon of icons; track icon) {
              <div class="icon-cell">
                <app-pixel-icon [name]="icon" [size]="24" [label]="icon" />
                <code>{{ icon }}</code>
              </div>
            }
          </div>
        </app-rpg-window>

        <app-rpg-window variant="panel" title="Sellos y badges">
          <div class="button-row">
            <span class="rpg-badge">Completada</span>
            <span class="rpg-badge rpg-badge--success">Disponible</span>
            <span class="rpg-badge rpg-badge--warning">En curso</span>
            <span class="rpg-badge rpg-badge--danger">Bloqueada</span>
            <span class="rpg-badge rpg-badge--muted">Archivada</span>
          </div>
        </app-rpg-window>

        <app-rpg-window variant="panel" title="Controles de formulario">
          <div class="form-demo">
            <div class="form-demo__field">
              <label for="demo-name">Nombre</label>
              <input id="demo-name" type="text" placeholder="Tu nombre">
            </div>
            <div class="form-demo__field">
              <label for="demo-class">Clase</label>
              <select id="demo-class">
                <option>Front-end</option>
                <option>UX/UI</option>
                <option>Full-stack</option>
              </select>
            </div>
            <div class="form-demo__field form-demo__field--full">
              <label for="demo-message">Mensaje</label>
              <textarea id="demo-message" rows="3" placeholder="Cuéntame sobre tu proyecto..."></textarea>
            </div>
          </div>
        </app-rpg-window>
      </div>
    </section>
  `,
  styles: [`
    .styleguide {
      padding-top: var(--space-12);
    }

    .styleguide__head {
      margin-bottom: var(--space-4);
    }

    .swatches {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: var(--space-3);
    }

    .swatch {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      font-size: var(--text-xs);
    }

    .swatch span {
      height: 48px;
      border: 2px solid var(--rpg-gold);
      box-shadow: var(--shadow-hard);
    }

    .swatch code {
      color: var(--rpg-text);
    }

    .swatch small {
      color: var(--rpg-text-dim);
    }

    .type-demo__display {
      color: var(--rpg-gold-pale);
      font-family: var(--font-display);
      font-size: var(--text-4xl);
      letter-spacing: 0.04em;
    }

    .type-demo__heading {
      margin-top: var(--space-2);
      color: var(--rpg-text);
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      text-transform: uppercase;
    }

    .type-demo__body {
      max-width: 70ch;
      margin-top: var(--space-3);
      color: var(--rpg-text-muted);
    }

    .type-demo__small {
      margin-top: var(--space-2);
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--space-4);
    }

    .button-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
    }

    .demo-divider {
      margin: var(--space-5) 0;
    }

    .stats-demo {
      display: grid;
      gap: var(--space-4);
      max-width: 560px;
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
      gap: var(--space-2);
    }

    .icon-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      padding: var(--space-2);
      border: 1px dashed rgba(201, 162, 39, 0.3);
      color: var(--rpg-gold-pale);
    }

    .icon-cell code {
      color: var(--rpg-text-dim);
      font-size: 0.65rem;
    }

    .form-demo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: var(--space-4);
    }

    .form-demo__field {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .form-demo__field--full {
      grid-column: 1 / -1;
    }

    .form-demo label {
      color: var(--rpg-text-muted);
      font-size: var(--text-sm);
    }
  `]
})
export class StyleguideComponent {
  readonly swatches: Swatch[] = [
    { name: 'rpg-ink', value: '#070b1a' },
    { name: 'rpg-ink-2', value: '#0b1026' },
    { name: 'rpg-navy', value: '#0d1b4c' },
    { name: 'rpg-window', value: '#12245c' },
    { name: 'rpg-window-light', value: '#1b3a8f' },
    { name: 'rpg-gold', value: '#c9a227' },
    { name: 'rpg-gold-bright', value: '#e0b64a' },
    { name: 'rpg-parchment', value: '#f1e4c3' },
    { name: 'rpg-text', value: '#f4f1e8' },
    { name: 'rpg-hp', value: '#e05a5a' },
    { name: 'rpg-mp', value: '#5aa9e6' },
    { name: 'rpg-exp', value: '#7bd88f' }
  ];

  readonly icons: PixelIconName[] = [
    'sword', 'shield', 'scroll', 'star', 'heart', 'drop', 'spark', 'arrow-right',
    'chevron-down', 'menu', 'close', 'mail', 'external', 'user', 'map', 'trophy',
    'book', 'code', 'check', 'warning', 'lock', 'save'
  ];
}
