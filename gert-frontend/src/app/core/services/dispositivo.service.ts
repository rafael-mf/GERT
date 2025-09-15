// File: gert-frontend/src/app/core/services/dispositivo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../../shared/models/dispositivo.model';
import { CategoriaDispositivo } from '../../shared/models/categoria-dispositivo.model';
import { environment } from '../../../environments/environment';

export interface PaginatedDispositivos {
  totalItems: number;
  dispositivos: Dispositivo[];
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {
  private apiUrl = `${environment.apiUrl}/dispositivos`;

  constructor(private http: HttpClient) { }

  getDispositivos(params?: any): Observable<PaginatedDispositivos> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedDispositivos>(this.apiUrl, { params: httpParams });
  }

  getDispositivoById(id: number): Observable<Dispositivo> {
    return this.http.get<Dispositivo>(`${this.apiUrl}/${id}`);
  }

  createDispositivo(dispositivo: Omit<Dispositivo, 'id'>): Observable<Dispositivo> {
    return this.http.post<Dispositivo>(this.apiUrl, dispositivo);
  }

  updateDispositivo(id: number, dispositivo: Partial<Dispositivo>): Observable<Dispositivo> {
    return this.http.put<Dispositivo>(`${this.apiUrl}/${id}`, dispositivo);
  }

  deleteDispositivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDispositivosByCliente(clienteId: number): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  getCategoriasDispositivo(): Observable<CategoriaDispositivo[]> {
    return this.http.get<CategoriaDispositivo[]>(`${environment.apiUrl}/chamados/aux/categorias-dispositivo`);
  }
}