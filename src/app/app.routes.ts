import { RouterModule, Routes } from '@angular/router';

//Components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

//Routes
export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
