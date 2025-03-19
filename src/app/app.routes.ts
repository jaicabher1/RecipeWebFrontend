import { RouterModule, Routes } from '@angular/router';

//Components
import { isAuthenticatedGuard, isNotAuthenticatedGuard, profileGuard } from './services/user/user.guard';
import { HomeComponent } from './components/home/home.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { LegalInfoComponent } from './components/home/legal-info/legal-info.component';

//Routes
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'legal/:type', component: LegalInfoComponent },
    { path: 'search', loadComponent: () => import('./components/get-user-profile/get-user-profile.component').then(m => m.GetUserProfileComponent), canActivate: [isNotAuthenticatedGuard] },
    { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [profileGuard] },
    { path: 'profile/:id', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [profileGuard] },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) , canActivate: [isAuthenticatedGuard]},
    { path: 'edit-profile', loadComponent: () => import('./components/edit-profile/edit-profile.component').then(m => m.EditProfileComponent), canActivate: [isNotAuthenticatedGuard] },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent), canActivate: [isAuthenticatedGuard] },
    { path: 'followers', loadComponent: () => import('./components/followers/followers.component').then(m => m.FollowersComponent), canActivate: [isNotAuthenticatedGuard] },
    { path: 'followings', loadComponent: () => import('./components/followings/followings.component').then(m => m.FollowingsComponent), canActivate: [isNotAuthenticatedGuard] },
    { path: 'my-publications', loadComponent: () => import('./components/my-publications/my-publications.component').then(m => m.MyPublicationsComponent), canActivate: [isNotAuthenticatedGuard] },
    { path: 'publications/:userId', loadComponent: () => import('./components/my-publications/my-publications.component').then(m => m.MyPublicationsComponent), canActivate: [isNotAuthenticatedGuard] },
    { path: 'edit-publication/:id', loadComponent: () => import('./components/my-publications/edit-publication/edit-publication.component').then(m => m.EditPublicationComponent), canActivate: [isNotAuthenticatedGuard] },
    { path: 'recipes', loadComponent: () => import('./components/publication/publication.component').then(m => m.PublicationComponent), canActivate: [isNotAuthenticatedGuard] },
    { path: 'messages', loadComponent: () => import('./components/messages/messages.component').then(m => m.MessagesComponent), canActivate: [isNotAuthenticatedGuard] },
    { path: '**', redirectTo: '' } // Redirige cualquier ruta no válida a la página principal

];


export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
