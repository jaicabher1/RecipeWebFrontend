import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isAuthenticated()) {
    router.navigate(['/']); // Redirige a la página principal si está autenticado
    return false;
  }
  
  return true; // Permite el acceso si NO está autenticado
};
