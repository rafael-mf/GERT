import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RelatorioService, RelatorioFinanceiro } from '../../../../core/services/relatorio.service';
import { FiltrosPeriodoComponent, FiltrosPeriodo } from '../../../../shared/components/filtros-periodo/filtros-periodo.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-relatorio-financeiro',
  standalone: true,
  imports: [CommonModule, RouterLink, FiltrosPeriodoComponent, CurrencyPipe],
  templateUrl: './relatorio-financeiro.component.html',
  styleUrl: './relatorio-financeiro.component.scss'
})
export class RelatorioFinanceiroComponent implements OnInit {
  dados: RelatorioFinanceiro | null = null;
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
    
    this.relatorioService.getRelatorioFinanceiro(filtros).subscribe({
      next: (dados) => {
        this.dados = dados;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados do relatório financeiro';
        this.loading = false;
        this.toastr.error('Erro ao carregar relatório financeiro', 'Erro');
        console.error('Erro no relatório financeiro:', err);
      }
    });
  }

  get receitaPorTecnicoArray() {
    if (!this.dados?.receitaPorTecnico) return [];
    return Object.entries(this.dados.receitaPorTecnico).map(([key, value]) => ({
      tecnico: key,
      receita: value
    }));
  }
}
