import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {Sidebar} from '../sidebar/sidebar';
import {Header} from '../header/header';
import {FooterContent} from '../footer-content/footer-content';

/**
 * Application shell hosting the sidebar, top bar, routed content and footer.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, MatSidenavModule, Sidebar, Header, FooterContent],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  /** Whether the sidenav is currently expanded. */
  readonly opened = signal(true);

  /** Toggles the sidenav open/closed state. */
  toggle(): void {
    this.opened.update(value => !value);
  }
}
