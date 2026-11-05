import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { PixelAvatarComponent } from '../../shared/ui/pixel-avatar/pixel-avatar.component';
import { PixelIconComponent } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../shared/ui/rpg-button/rpg-button.directive';
import { RpgWindowComponent } from '../../shared/ui/rpg-window/rpg-window.component';
import { StatBarComponent } from '../../shared/ui/stat-bar/stat-bar.component';
import { CHARACTER_PROFILE } from './about.content';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink,
    PixelAvatarComponent,
    PixelIconComponent,
    RpgButtonDirective,
    RpgWindowComponent,
    StatBarComponent
  ],
  template: `
    <section class="rpg-section about">
      <div class="container">
        <header class="about__head">
          <span class="rpg-section__eyebrow">// FICHA DE PERSONAJE</span>
          <h1 class="rpg-section__title">Sobre mí</h1>
          <p class="rpg-section__lead">
            Un resumen de quién soy, qué herramientas llevo en la mochila y en qué
            tipo de misiones disfruto trabajar.
          </p>
        </header>

        <div class="about__grid">
          <app-rpg-window variant="panel" title="Ficha">
            <div class="character">
              <app-pixel-avatar [size]="148" alt="Retrato pixel art de Gabus" />

              <div class="character__identity">
                <p class="character__alias">{{ profile.alias }}</p>
                <h2 class="character__name">{{ profile.name }}</h2>
                <p class="character__class">{{ profile.className }}</p>
                <span class="rpg-badge rpg-badge--success">
                  <app-pixel-icon name="check" [size]="12" />
                  {{ profile.availability }}
                </span>
              </div>
            </div>

            <dl class="character__meta">
              <div>
                <dt>Clase</dt>
                <dd>{{ profile.title }}</dd>
              </div>
              <div>
                <dt>Nivel</dt>
                <dd>{{ profile.level }} / 20</dd>
              </div>
              <div>
                <dt>Misiones</dt>
                <dd>{{ questCount() ?? '—' }}</dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>{{ profile.location }}</dd>
              </div>
            </dl>

            <div class="character__traits">
              @for (trait of profile.traits; track trait) {
                <span class="rpg-badge rpg-badge--muted">{{ trait }}</span>
              }
            </div>

            <div class="character__actions">
              <a routerLink="/projects" appRpgButton variant="primary">Ver Quest Log</a>
              <a routerLink="/contact" appRpgButton variant="secondary">Contactar</a>
            </div>
          </app-rpg-window>

          <div class="about__main">
            <app-rpg-window variant="dialogue" title="Historia">
              <div class="rpg-prose">
                @for (paragraph of profile.bio; track $index) {
                  <p>{{ paragraph }}</p>
                }
              </div>
            </app-rpg-window>

            <app-rpg-window variant="panel" title="Equipamiento">
              <ul class="equipment">
                @for (item of profile.equipment; track item.name) {
                  <li class="equipment__item">
                    <span class="equipment__icon" aria-hidden="true">
                      <app-pixel-icon [name]="item.icon" [size]="20" />
                    </span>
                    <span>
                      <strong>{{ item.name }}</strong>
                      <small>{{ item.description }}</small>
                    </span>
                  </li>
                }
              </ul>
            </app-rpg-window>
          </div>
        </div>

        <app-rpg-window variant="panel" title="Habilidades" class="about__skills">
          <p class="about__skills-note">
            Los valores son una representación narrativa del dominio percibido,
            no una medición objetiva. La barra siempre incluye el valor textual.
          </p>

          <div class="skill-groups">
            @for (group of profile.skillGroups; track group.key) {
              <section class="skill-group" [attr.aria-labelledby]="'skill-group-' + group.key">
                <h3 [id]="'skill-group-' + group.key" class="skill-group__title">
                  <app-pixel-icon [name]="group.icon" [size]="16" />
                  {{ group.label }}
                </h3>
                <div class="skill-group__bars">
                  @for (skill of group.skills; track skill.name) {
                    <app-stat-bar
                      [label]="skill.name"
                      [value]="skill.value"
                      [tone]="skill.tone"
                      [hint]="skill.hint"
                    />
                  }
                </div>
              </section>
            }
          </div>
        </app-rpg-window>
      </div>
    </section>
  `,
  styles: [`
    .about {
      padding-top: var(--space-12);
    }

    .about__head {
      max-width: 75ch;
      margin-bottom: var(--space-8);
    }

    .about__grid {
      display: grid;
      grid-template-columns: minmax(300px, 380px) minmax(0, 1fr);
      gap: var(--space-6);
      align-items: start;
    }

    .character {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .character__identity {
      display: flex;
      flex: 1;
      min-width: 150px;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.35rem;
    }

    .character__alias {
      color: var(--rpg-gold-bright);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .character__name {
      color: var(--rpg-gold-pale);
      font-size: var(--text-3xl);
      text-transform: uppercase;
    }

    .character__class {
      color: var(--rpg-text-muted);
      font-size: var(--text-sm);
      line-height: 1.45;
    }

    .character__identity .rpg-badge {
      max-width: 100%;
      white-space: normal;
      line-height: 1.35;
    }

    .character__meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
      margin-top: var(--space-5);
      padding-top: var(--space-4);
      border-top: 1px dashed rgba(201, 162, 39, 0.35);
    }

    .character__meta dt {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .character__meta dd {
      color: var(--rpg-text);
      font-family: var(--font-display);
      font-size: var(--text-base);
      line-height: 1.3;
    }

    .character__traits {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-top: var(--space-4);
    }

    .character__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-top: var(--space-5);
    }

    .about__main {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .equipment {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: var(--space-4);
    }

    .equipment__item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
    }

    .equipment__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      flex: 0 0 auto;
      border: 1px solid var(--rpg-gold);
      background: rgba(201, 162, 39, 0.1);
      color: var(--rpg-gold-pale);
    }

    .equipment__item strong {
      display: block;
      color: var(--rpg-text);
      font-family: var(--font-display);
      font-size: var(--text-base);
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .equipment__item small {
      display: block;
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
      line-height: 1.4;
    }

    .about__skills {
      margin-top: var(--space-6);
    }

    .about__skills-note {
      margin-bottom: var(--space-5);
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
      line-height: 1.5;
    }

    .skill-groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: var(--space-6);
    }

    .skill-group__title {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-3);
      padding-bottom: var(--space-2);
      border-bottom: 1px dashed rgba(201, 162, 39, 0.35);
      color: var(--rpg-gold-bright);
      font-size: var(--text-lg);
      text-transform: uppercase;
    }

    .skill-group__bars {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    @media (max-width: 900px) {
      .about__grid {
        grid-template-columns: 1fr;
      }

      .about {
        padding-top: var(--space-8);
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  private readonly projectService = inject(ProjectService);

  readonly profile = CHARACTER_PROFILE;
  readonly questCount = signal<number | null>(null);

  ngOnInit(): void {
    this.projectService.list(0, 1).subscribe({
      next: (res) => this.questCount.set(res.totalElements),
      error: () => this.questCount.set(null)
    });
  }
}
