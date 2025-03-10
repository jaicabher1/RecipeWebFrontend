import { RouterModule, Routes } from '@angular/router';

//Components
import { userGuard } from './services/user/user.guard';
import { HomeComponent } from './components/home/home.component';

//Routes
export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path: 'search', loadComponent: () => import('./components/get-user-profile/get-user-profile.component').then(m => m.GetUserProfileComponent)},
    { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
    { path: 'profile/:id', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent), canActivate: [userGuard] },
    {path: 'followers', loadComponent: () => import('./components/followers/followers.component').then(m => m.FollowersComponent)},
    {path: 'followings', loadComponent: () => import('./components/followings/followings.component').then(m => m.FollowingsComponent)},
    {path: 'my-publications', loadComponent: () => import('./components/my-publications/my-publications.component').then(m => m.MyPublicationsComponent)},
    { path: 'recipes', loadComponent: () => import('./components/publication/publication.component').then(m => m.PublicationComponent) },
    { path: '**', redirectTo: '' } // Redirige cualquier ruta no válida a la página principal
    
];


export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
