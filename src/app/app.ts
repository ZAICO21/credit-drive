import {Component, inject, signal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Layout} from './shared/presentation/components/layout/layout';

/**
 * Root component. Hosts the application shell ({@link Layout}) and configures
 * the available languages, defaulting to Spanish.
 */
@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('compra-inteligente');

  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['es', 'en']);
    this.translate.use('es');
  }
}
