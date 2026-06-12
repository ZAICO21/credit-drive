import {Component, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatBadgeModule} from '@angular/material/badge';
import {LanguageSwitcher} from '../language-switcher/language-switcher';

@Component({
  selector: 'app-header',
  imports: [
    TranslatePipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    LanguageSwitcher
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  readonly menuToggle = output<void>();
}
