import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // Verificar validade do token se necessário
      // Por enquanto, apenas verifica se existe usuário autenticado
      // A verificação real será feita pelo interceptor em caso de erro 401

      // Verificar se há restrições de papel/cargo
      if (route.data['roles'] && !route.data['roles'].includes(this.authService.currentUserValue?.cargo)) {
        this.router.navigate(['/acesso-negado']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
