// File: gert-frontend/src/app/core/services/tecnico.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tecnico } from '../../shared/models/tecnico.model'; // Assegure que este modelo exista
import { Usuario } from '../../shared/models/usuario.model';
import { environment } from '../../../environments/environment';

export interface TecnicoPayload {
  nome: string;
  email: string;
  senha?: string; // Obrigatório na criação
  ativo?: boolean;
  especialidade?: string;
  disponivel?: boolean;
}
export interface PaginatedTecnicos {
  totalItems: number;
  tecnicos: Tecnico[];
  totalPages: number;
  currentPage: number;
}


@Injectable({
  providedIn: 'root'
})
export class TecnicoService {
  private apiUrl = `${environment.apiUrl}/tecnicos`;

  constructor(private http: HttpClient) { }

  getTecnicos(params?: any): Observable<PaginatedTecnicos> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
         if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedTecnicos>(this.apiUrl, { params: httpParams });
  }

  getTecnicoById(id: number): Observable<Tecnico> {
    return this.http.get<Tecnico>(`${this.apiUrl}/${id}`);
  }

  createTecnico(tecnicoData: TecnicoPayload): Observable<Tecnico> {
    return this.http.post<Tecnico>(this.apiUrl, tecnicoData);
  }

  updateTecnico(id: number, tecnicoData: Partial<TecnicoPayload>): Observable<Tecnico> {
    return this.http.put<Tecnico>(`${this.apiUrl}/${id}`, tecnicoData);
  }

  deleteTecnico(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
