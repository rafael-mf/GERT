import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servico } from '../../shared/models/servico.model';
import { environment } from '../../../environments/environment';

export interface PaginatedServicos {
  totalItems: number;
  servicos: Servico[];
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private apiUrl = `${environment.apiUrl}/servicos`;

  constructor(private http: HttpClient) { }

  getServicos(params?: any): Observable<PaginatedServicos> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedServicos>(this.apiUrl, { params: httpParams });
  }

  getServicoById(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  createServico(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servico);
  }

  updateServico(id: number, servico: Servico): Observable<Servico> {
    return this.http.put<Servico>(`${this.apiUrl}/${id}`, servico);
  }

  deleteServico(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Método para obter apenas serviços ativos (usado pelos chamados)
  getServicosAtivos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/ativos`);
  }
}
