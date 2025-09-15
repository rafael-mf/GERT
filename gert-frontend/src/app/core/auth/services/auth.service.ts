import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Usuario } from '../../../shared/models/usuario.model';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize with null, then try to load from localStorage only if in browser
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(null);

    // Only access localStorage in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          // Verificar se o token ainda existe e parece válido
          if (user && user.token) {
            this.currentUserSubject.next(user);
            console.log('Token carregado do localStorage');
          } else {
            console.warn('Token inválido encontrado no localStorage, removendo');
            localStorage.removeItem('currentUser');
          }
        } catch (error) {
          console.error('Erro ao parsear usuário do localStorage:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  login(email: string, senha: string): Observable<Usuario> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        map(response => {
          if (response && response.token) {
            const user: Usuario = {
              ...response.usuario,
              token: response.token
            };

            // Only access localStorage in browser environment
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('currentUser', JSON.stringify(user));
            }

            this.currentUserSubject.next(user);
            return user;
          }
          throw new Error('Falha na autenticação');
        })
      );
  }

  logout(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }

    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Verificar se o token ainda é válido fazendo uma requisição de teste
  checkTokenValidity(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return of(false);
    }

    return this.http.get(`${this.apiUrl}/perfil`).pipe(
      map(() => true),
      catchError(() => {
        console.warn('Token inválido, fazendo logout');
        this.logout();
        return of(false);
      })
    );
  }

  hasRole(role: string): boolean {
    const userCargo = this.currentUserValue?.cargo;
    if (!userCargo) return false;
    
    // Mapear cargos do banco para os esperados pelo frontend
    const cargoMapping: { [key: string]: string[] } = {
      'admin': ['Administrador', 'admin'],
      'Administrador': ['Administrador', 'admin'],
      'tecnico': ['Técnico', 'tecnico'],
      'Técnico': ['Técnico', 'tecnico']
    };
    
    const allowedRoles = cargoMapping[userCargo] || [userCargo];
    return allowedRoles.includes(role);
  }

  updateCurrentUser(user: Usuario): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }
}
