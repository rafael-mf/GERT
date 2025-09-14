import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RelatorioService, RelatorioTecnicos } from '../../../../core/services/relatorio.service';
import { FiltrosPeriodoComponent, FiltrosPeriodo } from '../../../../shared/components/filtros-periodo/filtros-periodo.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-relatorio-tecnicos',
  standalone: true,
  imports: [CommonModule, RouterLink, FiltrosPeriodoComponent],
  templateUrl: './relatorio-tecnicos.component.html',
  styleUrl: './relatorio-tecnicos.component.scss'
})
export class RelatorioTecnicosComponent implements OnInit {
  dados: RelatorioTecnicos | null = null;
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
    
    this.relatorioService.getRelatorioTecnicos(filtros).subscribe({
      next: (dados) => {
        this.dados = dados;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados do relatório de técnicos';
        this.loading = false;
        this.toastr.error('Erro ao carregar relatório de técnicos', 'Erro');
        console.error('Erro no relatório de técnicos:', err);
      }
    });
  }
}
