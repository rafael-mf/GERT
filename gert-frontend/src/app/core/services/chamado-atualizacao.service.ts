// gert-frontend/src/app/core/services/chamado-atualizacao.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChamadoAtualizacao {
  id: number;
  chamadoId: number;
  usuarioId: number;
  statusAnterior: number | null;
  statusNovo: number | null;
  comentario: string | null;
  dataAtualizacao: Date;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  statusAnteriorObj?: {
    id: number;
    nome: string;
    cor: string;
  };
  statusNovoObj?: {
    id: number;
    nome: string;
    cor: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChamadoAtualizacaoService {
  private apiUrl = `${environment.apiUrl}/chamados`;

  constructor(private http: HttpClient) { }

  getAtualizacoesByChamado(chamadoId: number): Observable<ChamadoAtualizacao[]> {
    return this.http.get<ChamadoAtualizacao[]>(`${this.apiUrl}/${chamadoId}/atualizacoes`);
  }

  registrarAtualizacao(atualizacao: {
    chamadoId: number;
    usuarioId: number;
    statusAnterior?: number;
    statusNovo?: number;
    comentario?: string;
  }): Observable<ChamadoAtualizacao> {
    return this.http.post<ChamadoAtualizacao>(`${this.apiUrl}/atualizacoes`, atualizacao);
  }

  registrarComentario(comentario: {
    chamadoId: number;
    usuarioId: number;
    comentario: string;
  }): Observable<ChamadoAtualizacao> {
    return this.http.post<ChamadoAtualizacao>(`${this.apiUrl}/atualizacoes/comentario`, comentario);
  }
}