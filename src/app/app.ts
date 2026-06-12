import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

/**
 * Root component. Hosts the routed shell ({@link Layout} for protected
 * routes, IAM sign-in standalone) and configures the available languages,
 * defaulting to Spanish.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
