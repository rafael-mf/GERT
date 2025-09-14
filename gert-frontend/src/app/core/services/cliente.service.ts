// File: gert-frontend/src/app/core/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../../shared/models/cliente.model';
import { Dispositivo } from '../../shared/models/dispositivo.model';
import { environment } from '../../../environments/environment';

export interface PaginatedClientes {
  totalItems: number;
  clientes: Cliente[];
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) { }

  getClientes(params?: any): Observable<PaginatedClientes> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedClientes>(this.apiUrl, { params: httpParams });
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  createCliente(cliente: Omit<Cliente, 'id' | 'dataCadastro'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Dentro da classe ClienteService

  createDispositivo(clienteId: number, dispositivo: Omit<Dispositivo, 'id'>): Observable<Dispositivo> {
    return this.http.post<Dispositivo>(`${this.apiUrl}/${clienteId}/dispositivos`, dispositivo);
  }

  // Se precisar buscar dispositivos associados a um cliente específico pelo frontend
  getDispositivosPorCliente(clienteId: number): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(`${environment.apiUrl}/chamados/aux/dispositivos/cliente/${clienteId}`);
    // Alternativamente, crie uma rota /api/clientes/:id/dispositivos no backend
  }
}
