import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TecnicoService } from '../../../../core/services/tecnico.service';
import { ChamadoService, PaginatedChamados } from '../../../../core/services/chamado.service';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from '../../../../shared/models/tecnico.model';
import { Chamado } from '../../../../shared/models/chamado.model';

@Component({
  selector: 'app-detalhe-tecnico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalhe-tecnico.component.html',
  styleUrl: './detalhe-tecnico.component.scss'
})
export class DetalheTecnicoComponent implements OnInit {
  tecnico: Tecnico | null = null;
  chamadosAtivos: any[] = [];
  chamadosConcluidos: any[] = [];
  loading = true;
  loadingChamados = false;
  error = '';
  tecnicoId!: number;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tecnicoService = inject(TecnicoService);
  private chamadoService = inject(ChamadoService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.tecnicoId = +idParam;
      this.loadTecnicoDetails();
    } else {
      this.error = 'ID do técnico não fornecido.';
      this.toastr.error(this.error);
      this.loading = false;
    }
  }

  loadTecnicoDetails(): void {
    this.loading = true;
    this.tecnicoService.getTecnicoById(this.tecnicoId).subscribe({
      next: (data: Tecnico) => {
        this.tecnico = data;
        this.loading = false;
        this.loadChamadosDoTecnico();
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar detalhes do técnico.';
        this.toastr.error(this.error);
        console.error(err);
        this.loading = false;
        if (err.status === 404) {
          this.router.navigate(['/tecnicos']);
        }
      }
    });
  }

  loadChamadosDoTecnico(): void {
    this.loadingChamados = true;
    this.chamadoService.getChamados({ tecnicoId: this.tecnicoId }).subscribe({
      next: (data: PaginatedChamados) => {
        const chamados = data.chamados || [];
        this.chamadosAtivos = chamados.filter((c: Chamado) =>
          c.status?.nome !== 'Concluído' && c.status?.nome !== 'Cancelado'
        );
        this.chamadosConcluidos = chamados.filter((c: Chamado) =>
          c.status?.nome === 'Concluído' || c.status?.nome === 'Cancelado'
        ).slice(0, 10); // Últimos 10 concluídos
        this.loadingChamados = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar chamados:', err);
        this.loadingChamados = false;
      }
    });
  }

  editTecnico(): void {
    if (this.tecnico?.id) {
      this.router.navigate(['/tecnicos', this.tecnico.id, 'editar']);
    }
  }

  getStatusBadgeClass(statusNome: string): string {
    switch (statusNome) {
      case 'Aberto': return 'bg-danger';
      case 'Em análise': return 'bg-warning';
      case 'Em andamento': return 'bg-primary';
      case 'Concluído': return 'bg-success';
      case 'Cancelado': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  getPrioridadeBadgeClass(prioridadeNome: string): string {
    switch (prioridadeNome) {
      case 'Baixa': return 'bg-success';
      case 'Média': return 'bg-warning';
      case 'Alta': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
