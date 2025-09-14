// gert-frontend/src/app/core/services/fornecedor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Fornecedor {
  id?: number;
  nome: string;
  cnpj?: string;
  contato?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  site?: string;
  observacoes?: string;
  ativo: boolean;
  dataCadastro?: Date;
}

export interface PaginatedFornecedores {
  totalItems: number;
  fornecedores: Fornecedor[];
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private apiUrl = `${environment.apiUrl}/estoque`;

  constructor(private http: HttpClient) { }

  getFornecedores(params?: any): Observable<PaginatedFornecedores> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedFornecedores>(`${this.apiUrl}/fornecedores`, { params: httpParams });
  }

  getFornecedorById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.apiUrl}/fornecedores/${id}`);
  }

  createFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(`${this.apiUrl}/fornecedores`, fornecedor);
  }

  updateFornecedor(id: number, fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.apiUrl}/fornecedores/${id}`, fornecedor);
  }

  deleteFornecedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/fornecedores/${id}`);
  }
}
