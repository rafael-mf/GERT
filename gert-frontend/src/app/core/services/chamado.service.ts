// File: gert-frontend/src/app/core/services/chamado.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chamado } from '../../shared/models/chamado.model';
import { Cliente } from '../../shared/models/cliente.model';
import { Dispositivo } from '../../shared/models/dispositivo.model'; // Create this model if needed
import { Prioridade } from '../../shared/models/prioridade.model'; // Create this model
import { StatusChamado } from '../../shared/models/status-chamado.model'; // Create this model
import { Tecnico } from '../../shared/models/tecnico.model'; // Create this model
import { Servico } from '../../shared/models/servico.model'; // Create this model
import { environment } from '../../../environments/environment';
import { CategoriaDispositivo } from '../../shared/models/categoria-dispositivo.model';

export interface PaginatedChamados {
  totalItems: number;
  chamados: Chamado[];
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {
  private apiUrl = `${environment.apiUrl}/chamados`;

  constructor(private http: HttpClient) { }

  getChamados(params?: any): Observable<PaginatedChamados> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<PaginatedChamados>(this.apiUrl, { params: httpParams });
  }

  getChamadoById(id: number): Observable<Chamado> {
    return this.http.get<Chamado>(`${this.apiUrl}/${id}`);
  }

  createChamado(chamado: Chamado): Observable<Chamado> {
    return this.http.post<Chamado>(this.apiUrl, chamado);
  }

  updateChamado(id: number, chamado: Chamado): Observable<Chamado> {
    return this.http.put<Chamado>(`${this.apiUrl}/${id}`, chamado);
  }

  deleteChamado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // --- Métodos para obter dados auxiliares ---
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/aux/clientes`);
  }

  getDispositivosPorCliente(clienteId: number): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(`${this.apiUrl}/aux/dispositivos/cliente/${clienteId}`);
  }

  getPrioridades(): Observable<Prioridade[]> {
    return this.http.get<Prioridade[]>(`${this.apiUrl}/aux/prioridades`);
  }

  getStatusChamados(): Observable<StatusChamado[]> {
    return this.http.get<StatusChamado[]>(`${this.apiUrl}/aux/status`);
  }

  getTecnicos(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(`${this.apiUrl}/aux/tecnicos`);
  }

  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/aux/servicos`);
  }

  addServicoAoChamado(chamadoId: number, servicoData: { servicoId: number; valor?: number; observacoes?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${chamadoId}/servicos`, servicoData);
  }

  removeServicoDoChamado(chamadoId: number, chamadoServicoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${chamadoId}/servicos/${chamadoServicoId}`);
  }

  // === MÉTODOS PARA PEÇAS USADAS ===
  addPecaUsada(chamadoId: number, pecaData: { pecaId?: number; nome?: string; descricao?: string; marca?: string; modelo?: string; numeroSerie?: string; quantidade: number; valorUnitario: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${chamadoId}/pecas-usadas`, pecaData);
  }

  updatePecaUsada(pecaUsadaId: number, pecaData: { pecaId?: number; quantidade?: number; valorUnitario?: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/pecas-usadas/${pecaUsadaId}`, pecaData);
  }

  removePecaUsada(pecaUsadaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pecas-usadas/${pecaUsadaId}`);
  }

  // === MÉTODO PARA FECHAR CHAMADO ===
  fecharChamado(chamadoId: number, dadosFechamento: { diagnostico: string; solucao: string; valorTotal?: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${chamadoId}/fechar`, dadosFechamento);
  }

  // === MÉTODO PARA REABRIR CHAMADO ===
  reabrirChamado(chamadoId: number, comentario?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${chamadoId}/reabrir`, { comentario });
  }

  getCategoriasDispositivo(): Observable<CategoriaDispositivo[]> {
  return this.http.get<CategoriaDispositivo[]>(`${this.apiUrl}/aux/categorias-dispositivo`);
}
}
