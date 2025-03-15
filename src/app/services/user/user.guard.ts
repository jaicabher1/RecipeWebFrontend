import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { inject } from '@angular/core';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isAuthenticated()) {
    router.navigate(['/']); // Redirige a la página principal si está autenticado
    return false;
  }
  
  return true; // Permite el acceso si NO está autenticado
};

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isAuthenticated()) {
    router.navigate(['/']); // Redirige a la página principal si NO está autenticado
    return false;
  }
  
  return true; // Permite el acceso si NO está autenticado
}

export const profileGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isAuthenticated()) {
    router.navigate(['/register']); // Redirige a la página principal si NO está autenticado
    return false;
  }
  
  return true; // Permite el acceso si NO está autenticado
}
