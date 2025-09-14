// gert-frontend/src/app/core/services/relatorio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RelatorioChamados {
  periodo: {
    dataInicio: string;
    dataFinal: string;
  };
  estatisticas: {
    totalChamados: number;
    chamadosAbertos: number;
    chamadosFechados: number;
    chamadosEmAndamento: number;
    tempoMedioAtendimento: string;
  };
  chamadosPorPrioridade: { [key: string]: number };
  chamadosPorTecnico: { [key: string]: number };
  chamados: Array<{
    id: number;
    titulo: string;
    cliente: string;
    tecnico: string;
    status: string;
    prioridade: string;
    dataAbertura: Date;
    dataFechamento: Date;
    valorTotal: number;
  }>;
}

export interface RelatorioFinanceiro {
  periodo: {
    dataInicio: string;
    dataFinal: string;
  };
  estatisticas: {
    totalReceita: string;
    mediaPorChamado: string;
    totalChamadosComValor: number;
  };
  receitaPorTecnico: { [key: string]: number };
  chamados: Array<{
    id: number;
    titulo: string;
    cliente: string;
    tecnico: string;
    valorTotal: number;
    dataAbertura: Date;
  }>;
}

export interface RelatorioTecnicos {
  periodo: {
    dataInicio: string;
    dataFinal: string;
  };
  estatisticas: {
    totalTecnicos: number;
    mediaAtendimentoPorTecnico: number;
    totalAtendimentos: number;
  };
  tecnicos: Array<{
    id: number;
    nome: string;
    totalChamados: number;
    chamadosConcluidos: number;
    chamadosAndamento: number;
    chamadosAtrasados: number;
    tempoMedioAtendimento: string;
    avaliacaoMedia: number;
    percentualNoPrazo: number;
  }>;
}



export interface DashboardStats {
  totalChamados: number;
  totalReceita: string;
  chamadosMes: number;
  chamadosPorStatus: Array<{
    status: string;
    count: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private apiUrl = `${environment.apiUrl}/relatorios`;

  constructor(private http: HttpClient) { }

  getRelatorioChamados(filtros?: any): Observable<RelatorioChamados> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<RelatorioChamados>(`${this.apiUrl}/chamados`, { params });
  }

  getRelatorioFinanceiro(filtros?: any): Observable<RelatorioFinanceiro> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<RelatorioFinanceiro>(`${this.apiUrl}/financeiro`, { params });
  }

  getRelatorioTecnicos(filtros?: any): Observable<RelatorioTecnicos> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<RelatorioTecnicos>(`${this.apiUrl}/tecnicos`, { params });
  }



  getDashboardStats(filtros?: any): Observable<DashboardStats> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`, { params });
  }
}
