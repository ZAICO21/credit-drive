import {Routes} from '@angular/router';

const dashboard = () => import('./shared/presentation/views/dashboard/dashboard').then(m => m.Dashboard);
const home = () => import('./shared/presentation/views/home/home').then(m => m.Home);
const about = () => import('./shared/presentation/views/about/about').then(m => m.About);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);

/*
// Bounded-context routes — uncomment as each BC is implemented.
const iamRoutes = () => import('./iam/presentation/iam.routes').then(m => m.iamRoutes);
const clientRoutes = () => import('./client-management/presentation/client.routes').then(m => m.clientRoutes);
const vehicleRoutes = () => import('./vehicle-management/presentation/vehicle.routes').then(m => m.vehicleRoutes);
const simulationRoutes = () => import('./credit-simulation/presentation/simulation.routes').then(m => m.simulationRoutes);
*/

const baseTitle = 'Compra Inteligente';

/**
 * Root route configuration that composes bounded-context routes.
 *
 * @remarks
 * Public version used until IAM is implemented. Once IAM is ready, protected
 * routes will add `canActivate: [iamGuard]` and the `iam` children will be
 * registered for sign-in / sign-up.
 */
export const routes: Routes = [
  {path: 'dashboard', loadComponent: dashboard, title: `${baseTitle} - Dashboard`},
  {path: 'home', loadComponent: home, title: `${baseTitle} - Inicio`},
  {path: 'about', loadComponent: about, title: `${baseTitle} - Acerca de`},

  // {path: 'iam', loadChildren: iamRoutes},
  // {path: 'clients', loadChildren: clientRoutes},
  // {path: 'vehicles', loadChildren: vehicleRoutes},
  // {path: 'simulator', loadChildren: simulationRoutes},

  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '**', loadComponent: pageNotFound, title: `${baseTitle} - No encontrado`}
];
