import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UpdateProfileData {
  nome: string;
  email: string;
  telefone?: string;
}

export interface ChangePasswordData {
  senhaAtual: string;
  novaSenha: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  updateProfile(data: UpdateProfileData): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, data);
  }

  changePassword(data: ChangePasswordData): Observable<any> {
    return this.http.put(`${this.apiUrl}/alterar-senha`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil`);
  }
}