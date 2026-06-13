import {Routes} from '@angular/router';

const signInForm = () => import('./views/sign-in-form/sign-in-form').then(m => m.SignInForm);

const baseTitle = 'Compra Inteligente';

/**
 * IAM route tree. Rendered outside the {@link Layout} shell (no sidenav).
 */
export const iamRoutes: Routes = [
  {path: 'sign-in', loadComponent: signInForm, title: `${baseTitle} - Ingresar`},
  {path: '', redirectTo: 'sign-in', pathMatch: 'full'}
];
