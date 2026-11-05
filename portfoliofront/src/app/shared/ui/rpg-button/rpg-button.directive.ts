import { Directive, HostBinding, Input } from '@angular/core';

export type RpgButtonVariant = 'primary' | 'secondary' | 'ghost' | 'menu';
export type RpgButtonSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: '[appRpgButton]',
  standalone: true
})
export class RpgButtonDirective {
  @Input() variant: RpgButtonVariant = 'primary';
  @Input() size: RpgButtonSize = 'md';

  @HostBinding('class.rpg-button') readonly baseClass = true;

  @HostBinding('class.rpg-button--primary')
  get isPrimary(): boolean {
    return this.variant === 'primary';
  }

  @HostBinding('class.rpg-button--secondary')
  get isSecondary(): boolean {
    return this.variant === 'secondary';
  }

  @HostBinding('class.rpg-button--ghost')
  get isGhost(): boolean {
    return this.variant === 'ghost';
  }

  @HostBinding('class.rpg-button--menu')
  get isMenu(): boolean {
    return this.variant === 'menu';
  }

  @HostBinding('class.rpg-button--sm')
  get isSmall(): boolean {
    return this.size === 'sm';
  }

  @HostBinding('class.rpg-button--lg')
  get isLarge(): boolean {
    return this.size === 'lg';
  }
}
