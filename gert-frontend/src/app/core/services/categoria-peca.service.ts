// gert-frontend/src/app/core/services/categoria-peca.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CategoriaPeca {
  id?: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaPecaService {
  private apiUrl = `${environment.apiUrl}/estoque`;

  constructor(private http: HttpClient) { }

  getAllCategorias(): Observable<CategoriaPeca[]> {
    return this.http.get<CategoriaPeca[]>(`${this.apiUrl}/categorias`);
  }

  getCategoriaById(id: number): Observable<CategoriaPeca> {
    return this.http.get<CategoriaPeca>(`${this.apiUrl}/categorias/${id}`);
  }

  createCategoria(categoria: CategoriaPeca): Observable<CategoriaPeca> {
    return this.http.post<CategoriaPeca>(`${this.apiUrl}/categorias`, categoria);
  }

  updateCategoria(id: number, categoria: CategoriaPeca): Observable<CategoriaPeca> {
    return this.http.put<CategoriaPeca>(`${this.apiUrl}/categorias/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categorias/${id}`);
  }
}
