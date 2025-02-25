import { RouterModule, Routes } from '@angular/router';

//Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { userGuard } from './services/user/user.guard';

//Routes
export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent), canActivate: [userGuard] },
    { path: '**', redirectTo: '' } // Redirige cualquier ruta no válida a la página principal

];


export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
