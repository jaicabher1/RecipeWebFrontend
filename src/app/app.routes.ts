import { RouterModule, Routes } from '@angular/router';

//Components
import { userGuard } from './services/user/user.guard';

//Routes
export const routes: Routes = [
    { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent), canActivate: [userGuard] },
    { path: 'recipes', loadComponent: () => import('./components/publication/publication.component').then(m => m.PublicationComponent) },
    { path: '**', redirectTo: '' } // Redirige cualquier ruta no válida a la página principal
    
];


export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
