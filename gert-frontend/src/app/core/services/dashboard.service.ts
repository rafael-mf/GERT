// gert-frontend/src/app/core/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chamado } from '../../shared/models/chamado.model';

// Interface para dados de gráficos
export interface ChartData {
  name: string;
  value: number;
}

export interface DashboardStats {
  chamadosAbertos: number;
  chamadosConcluidos: number;
  chamadosEmAndamento: number;
  totalClientes: number;
  totalFaturamento: number;
  ultimosChamados: Chamado[];
  chamadosPorStatus: ChartData[]; // Novo campo
  faturamentoMensal: ChartData[]; // Novo campo
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getStats(params?: { startDate?: string; endDate?: string }): Observable<DashboardStats> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
      if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
    }
    return this.http.get<DashboardStats>(this.apiUrl, { params: httpParams });
  }
}
