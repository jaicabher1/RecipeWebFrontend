import { RouterModule, Routes } from '@angular/router';

//Components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

//Routes
export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
    { path: '**', redirectTo: '' } // Redirige cualquier ruta no válida a la página principal

];


export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
