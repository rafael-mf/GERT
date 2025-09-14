// gert-frontend/src/app/core/services/peca.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Peca } from '../../shared/models/peca.model';
import { environment } from '../../../environments/environment';

export interface PaginatedPecas {
  totalItems: number;
  pecas: Peca[];
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class PecaService {
  private apiUrl = `${environment.apiUrl}/estoque`;

  constructor(private http: HttpClient) { }

  getPecas(params?: any): Observable<PaginatedPecas> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedPecas>(`${this.apiUrl}/pecas`, { params: httpParams });
  }

  getPecaById(id: number): Observable<Peca> {
    return this.http.get<Peca>(`${this.apiUrl}/pecas/${id}`);
  }

  createPeca(peca: Peca): Observable<Peca> {
    return this.http.post<Peca>(`${this.apiUrl}/pecas`, peca);
  }

  updatePeca(id: number, peca: Peca): Observable<Peca> {
    return this.http.put<Peca>(`${this.apiUrl}/pecas/${id}`, peca);
  }

  deletePeca(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pecas/${id}`);
  }

  getPecasPorCategoria(categoriaId: number): Observable<Peca[]> {
    return this.http.get<Peca[]>(`${this.apiUrl}/pecas/categoria/${categoriaId}`);
  }

  getPecasComEstoqueBaixo(): Observable<Peca[]> {
    return this.http.get<Peca[]>(`${this.apiUrl}/pecas/estoque-baixo`);
  }
}
