import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RelatorioService, RelatorioChamados } from '../../../../core/services/relatorio.service';
import { FiltrosPeriodoComponent, FiltrosPeriodo } from '../../../../shared/components/filtros-periodo/filtros-periodo.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-relatorio-chamados',
  standalone: true,
  imports: [CommonModule, RouterLink, FiltrosPeriodoComponent],
  templateUrl: './relatorio-chamados.component.html',
  styleUrl: './relatorio-chamados.component.scss'
})
export class RelatorioChamadosComponent implements OnInit {
  dados: RelatorioChamados | null = null;
  loading = true;
  error = '';

  constructor(
    private relatorioService: RelatorioService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarDados({ periodo: 'thisMonth' });
  }

  onFiltroChange(filtros: FiltrosPeriodo): void {
    this.carregarDados(filtros);
  }

  private carregarDados(filtros: FiltrosPeriodo): void {
    this.loading = true;
    this.error = '';
    
    this.relatorioService.getRelatorioChamados(filtros).subscribe({
      next: (dados) => {
        this.dados = dados;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados do relatório';
        this.loading = false;
        this.toastr.error('Erro ao carregar relatório de chamados', 'Erro');
        console.error('Erro no relatório de chamados:', err);
      }
    });
  }

  get chamadosPorPrioridadeArray() {
    if (!this.dados?.chamadosPorPrioridade) return [];
    return Object.entries(this.dados.chamadosPorPrioridade).map(([key, value]) => ({
      prioridade: key,
      quantidade: value
    }));
  }

  get chamadosPorTecnicoArray() {
    if (!this.dados?.chamadosPorTecnico) return [];
    return Object.entries(this.dados.chamadosPorTecnico).map(([key, value]) => ({
      tecnico: key,
      quantidade: value
    }));
  }
}
