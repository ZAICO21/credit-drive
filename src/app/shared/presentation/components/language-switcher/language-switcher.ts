import {Component, inject, signal} from '@angular/core';
import {TranslateService, TranslatePipe} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

/**
 * Lets the user switch the active UI language between Spanish and English.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  private readonly translate = inject(TranslateService);

  /** Currently active language code (`es` | `en`). */
  readonly current = signal(this.translate.getCurrentLang() ?? 'es');

  /** Available language codes. */
  readonly languages = ['es', 'en'] as const;

  /**
   * Activates the given language.
   * @param lang - Language code to switch to.
   */
  use(lang: string): void {
    this.translate.use(lang);
    this.current.set(lang);
  }
}
