import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { PixelIconComponent } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../shared/ui/rpg-button/rpg-button.directive';
import { RpgWindowComponent } from '../../shared/ui/rpg-window/rpg-window.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    PixelIconComponent,
    RpgButtonDirective,
    RpgWindowComponent
  ],
  template: `
    <section class="rpg-section contact">
      <div class="container">
        <header class="contact__head">
          <span class="rpg-section__eyebrow">// GREMIO DE AVENTUREROS</span>
          <h1 class="rpg-section__title">Contacto</h1>
          <p class="rpg-section__lead">
            ¿Tienes una misión en mente? Cuéntame el objetivo, el alcance y el plazo
            aproximado. Respondo normalmente en 24–48 horas.
          </p>
        </header>

        <div class="contact__grid">
          <div class="contact__main">
            @if (sent()) {
              <app-rpg-window variant="dialogue" title="Mensaje enviado">
                <div class="contact__success" role="status">
                  <span class="contact__success-icon" aria-hidden="true">
                    <app-pixel-icon name="check" [size]="40" />
                  </span>
                  <h2 class="contact__success-title">¡Misión recibida!</h2>
                  <p class="contact__success-copy">
                    Gracias por escribir. Revisaré tu mensaje y te responderé lo antes
                    posible en el email que me has dejado.
                  </p>
                  <button
                    type="button"
                    appRpgButton
                    variant="secondary"
                    (click)="resetForm()"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              </app-rpg-window>
            } @else {
              <app-rpg-window variant="dialogue" title="Mensaje al gremio">
                <form
                  class="contact__form"
                  [formGroup]="form"
                  (ngSubmit)="onSubmit()"
                  novalidate
                >
                  <div class="contact__row">
                    <div class="contact__field">
                      <label for="name">
                        Nombre <span class="contact__req" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        formControlName="name"
                        autocomplete="name"
                        placeholder="Tu nombre"
                        required
                        [attr.aria-invalid]="fieldError('name') ? 'true' : null"
                        [attr.aria-describedby]="fieldError('name') ? 'name-error' : null"
                      >
                      @if (fieldError('name'); as msg) {
                        <p id="name-error" class="contact__field-error">
                          <app-pixel-icon name="warning" [size]="12" />
                          {{ msg }}
                        </p>
                      }
                    </div>

                    <div class="contact__field">
                      <label for="email">
                        Email <span class="contact__req" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        formControlName="email"
                        autocomplete="email"
                        placeholder="tu@correo.com"
                        required
                        [attr.aria-invalid]="fieldError('email') ? 'true' : null"
                        [attr.aria-describedby]="fieldError('email') ? 'email-error' : null"
                      >
                      @if (fieldError('email'); as msg) {
                        <p id="email-error" class="contact__field-error">
                          <app-pixel-icon name="warning" [size]="12" />
                          {{ msg }}
                        </p>
                      }
                    </div>
                  </div>

                  <div class="contact__field">
                    <label for="subject">
                      Asunto <span class="contact__req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      formControlName="subject"
                      placeholder="¿En qué puedo ayudarte?"
                      required
                      [attr.aria-invalid]="fieldError('subject') ? 'true' : null"
                      [attr.aria-describedby]="fieldError('subject') ? 'subject-error' : null"
                    >
                    @if (fieldError('subject'); as msg) {
                      <p id="subject-error" class="contact__field-error">
                        <app-pixel-icon name="warning" [size]="12" />
                        {{ msg }}
                      </p>
                    }
                  </div>

                  <div class="contact__field">
                    <label for="message">
                      Mensaje <span class="contact__req" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      formControlName="message"
                      rows="7"
                      placeholder="Objetivo, alcance, referencias y plazo aproximado..."
                      required
                      [attr.aria-invalid]="fieldError('message') ? 'true' : null"
                      [attr.aria-describedby]="
                        fieldError('message') ? 'message-error message-hint' : 'message-hint'
                      "
                    ></textarea>
                    @if (fieldError('message'); as msg) {
                      <p id="message-error" class="contact__field-error">
                        <app-pixel-icon name="warning" [size]="12" />
                        {{ msg }}
                      </p>
                    }
                    <p id="message-hint" class="contact__hint">
                      {{ messageLength() }} / 1200 caracteres
                    </p>
                  </div>

                  @if (error()) {
                    <div class="contact__error" role="alert">
                      <app-pixel-icon name="warning" [size]="16" />
                      <span>{{ error() }}</span>
                    </div>
                  }

                  <div class="contact__actions">
                    <button
                      type="submit"
                      appRpgButton
                      variant="primary"
                      size="lg"
                      [disabled]="submitting()"
                    >
                      @if (submitting()) {
                        Enviando mensaje...
                      } @else {
                        <app-pixel-icon name="mail" [size]="18" />
                        Enviar mensaje
                      }
                    </button>
                    <p class="contact__legal">
                      Solo usaré tus datos para responder a este mensaje.
                    </p>
                  </div>
                </form>
              </app-rpg-window>
            }
          </div>

          <aside class="contact__side" aria-label="Información de contacto">
            <app-rpg-window variant="parchment" title="Taberna del gremio">
              <p class="contact__note">
                Prefiero las conversaciones con contexto: qué quieres construir, para
                quién y cuándo lo necesitas. Con eso puedo responderte con una propuesta
                realista.
              </p>

              <dl class="contact__channels">
                <div>
                  <dt>GitHub</dt>
                  <dd>
                    <a href="https://github.com/Gabusnow21" target="_blank" rel="noopener">
                      Gabusnow21
                      <app-pixel-icon name="external" [size]="11" />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Ubicación</dt>
                  <dd>Remoto · Mundo digital</dd>
                </div>
                <div>
                  <dt>Disponibilidad</dt>
                  <dd>
                    <span class="rpg-badge rpg-badge--success">
                      <app-pixel-icon name="check" [size]="12" />
                      Abierto a proyectos
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Respuesta</dt>
                  <dd>24–48 horas</dd>
                </div>
              </dl>
            </app-rpg-window>

            <app-rpg-window variant="dialogue" title="Antes de enviar">
              <ul class="contact__tips">
                <li>Describe el objetivo y el alcance del proyecto.</li>
                <li>Indica si ya tienes referencias visuales o marca.</li>
                <li>Comparte el plazo o la fecha límite aproximada.</li>
              </ul>

              <hr class="rpg-divider rpg-divider--dotted contact__divider" />

              <a routerLink="/projects" appRpgButton variant="secondary" size="sm">
                <app-pixel-icon name="scroll" [size]="14" />
                Ver proyectos
              </a>
            </app-rpg-window>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact {
      padding-top: var(--space-12);
    }

    .contact__head {
      max-width: 72ch;
      margin-bottom: var(--space-8);
    }

    .contact__grid {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
      gap: var(--space-6);
      align-items: start;
    }

    .contact__main,
    .contact__side {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .contact__form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .contact__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .contact__field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .contact__field label {
      color: var(--rpg-gold-pale);
      font-family: var(--font-display);
      font-size: var(--text-base);
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .contact__req {
      color: var(--rpg-danger);
    }

    .contact__field input,
    .contact__field textarea {
      background: var(--rpg-window-deep);
      border-color: var(--rpg-text-dim);
    }

    .contact__field textarea {
      min-height: 160px;
      resize: vertical;
    }

    .contact__field-error {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      color: #ffb0b0;
      font-size: var(--text-xs);
      line-height: 1.4;
    }

    .contact__hint {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    .contact__error {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      padding: var(--space-3);
      border: 2px solid var(--rpg-danger);
      background: rgba(255, 123, 123, 0.12);
      color: #ffd0d0;
      font-size: var(--text-sm);
      line-height: 1.5;
    }

    .contact__actions {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-2);
      margin-top: var(--space-2);
    }

    .contact__legal {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
      text-align: center;
    }

    .contact__success {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-6) var(--space-2);
      text-align: center;
    }

    .contact__success-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border: 2px solid var(--rpg-exp);
      background: rgba(123, 216, 143, 0.12);
      color: var(--rpg-exp);
      box-shadow: var(--shadow-hard);
    }

    .contact__success-title {
      color: var(--rpg-gold-pale);
      font-size: var(--text-2xl);
      text-transform: uppercase;
    }

    .contact__success-copy {
      max-width: 46ch;
      color: var(--rpg-text-muted);
    }

    .contact__note {
      color: #3a2a12;
      font-size: var(--text-sm);
      line-height: 1.55;
    }

    .contact__channels {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px dashed rgba(90, 64, 20, 0.4);
    }

    .contact__channels > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      flex-wrap: wrap;
    }

    .contact__channels dt {
      color: #6b4a12;
      font-size: var(--text-xs);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .contact__channels dd {
      margin: 0;
      color: #241a0e;
      font-size: var(--text-sm);
      text-align: right;
    }

    .contact__channels a {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      color: #6b4a12;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .contact__tips {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      list-style: none;
    }

    .contact__tips li {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      color: var(--rpg-text-muted);
      font-size: var(--text-sm);
      line-height: 1.5;
    }

    .contact__tips li::before {
      content: '▸';
      flex: 0 0 auto;
      color: var(--rpg-gold-bright);
    }

    .contact__divider {
      margin: var(--space-4) 0;
    }

    @media (max-width: 900px) {
      .contact {
        padding-top: var(--space-8);
      }

      .contact__grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 560px) {
      .contact__row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly document = inject(DOCUMENT);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    subject: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1200)]]
  });

  submitting = signal(false);
  sent = signal(false);
  error = signal('');

  messageLength(): number {
    const value = this.form.get('message')?.value;
    return typeof value === 'string' ? value.length : 0;
  }

  fieldError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.touched || control.valid) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control.hasError('email')) {
      return 'Introduce un email válido.';
    }
    if (control.hasError('minlength')) {
      const required = control.getError('minlength')?.requiredLength;
      return `Escribe al menos ${required} caracteres.`;
    }
    if (control.hasError('maxlength')) {
      const required = control.getError('maxlength')?.requiredLength;
      return `No superes los ${required} caracteres.`;
    }

    return 'Revisa este campo.';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    this.contactService.send(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset();
        this.submitting.set(false);
        this.sent.set(true);
      },
      error: (err) => {
        this.error.set(
          err?.message || 'No se pudo enviar el mensaje. Intenta de nuevo en unos minutos.'
        );
        this.submitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.form.reset();
    this.sent.set(false);
    this.error.set('');
  }

  private focusFirstInvalid(): void {
    const order = ['name', 'email', 'subject', 'message'];
    const firstInvalid = order.find((field) => this.form.get(field)?.invalid);
    if (!firstInvalid) {
      return;
    }

    this.document.getElementById(firstInvalid)?.focus();
  }
}
