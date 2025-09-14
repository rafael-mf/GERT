// gert-frontend/src/app/features/chamados/pages/lista-chamados/lista-chamados.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ChamadoService, PaginatedChamados } from '../../../../core/services/chamado.service';
import { Prioridade } from '../../../../shared/models/prioridade.model';
import { StatusChamado } from '../../../../shared/models/status-chamado.model';
import { Tecnico } from '../../../../shared/models/tecnico.model';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-chamados',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgbPaginationModule, NgbTooltipModule, DatePipe],
  templateUrl: './lista-chamados.component.html',
  styleUrls: ['./lista-chamados.component.scss']
})
export class ListaChamadosComponent implements OnInit {
  paginatedChamados: PaginatedChamados = { chamados: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  loading = false;
  error = '';

  // Filter properties
  searchTerm: string = '';
  statusIdFiltro: string = '';
  prioridadeIdFiltro: string = '';
  tecnicoIdFiltro: string = '';
  page: number = 1;
  limit: number = 10;

  // Data for filters
  statusList: StatusChamado[] = [];
  prioridadesList: Prioridade[] = [];
  tecnicosList: Tecnico[] = [];

  constructor(
    private chamadoService: ChamadoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadChamados();
    this.loadAuxData();
  }

  loadChamados(): void {
    this.loading = true;
    const params = {
      page: this.page,
      limit: this.limit,
      searchTerm: this.searchTerm,
      statusId: this.statusIdFiltro,
      prioridadeId: this.prioridadeIdFiltro,
      tecnicoId: this.tecnicoIdFiltro
    };

    this.chamadoService.getChamados(params).subscribe({
      next: (data) => {
        this.paginatedChamados = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar chamados.';
        this.toastr.error(this.error);
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadAuxData(): void {
    this.chamadoService.getStatusChamados().subscribe(data => this.statusList = data);
    this.chamadoService.getPrioridades().subscribe(data => this.prioridadesList = data);
    this.chamadoService.getTecnicos().subscribe(data => this.tecnicosList = data);
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadChamados();
  }

  applyFilters(): void {
    this.page = 1; // Reset to first page on filter change
    this.loadChamados();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusIdFiltro = '';
    this.prioridadeIdFiltro = '';
    this.tecnicoIdFiltro = '';
    this.page = 1;
    this.loadChamados();
  }

  viewChamado(id?: number): void {
    if (id) this.router.navigate(['/chamados', id]);
  }

  editChamado(id?: number): void {
     if (id) this.router.navigate(['/chamados', id, 'editar']);
  }

  deleteChamado(id?: number): void {
    if (id && confirm('Tem certeza que deseja excluir este chamado?')) {
      this.chamadoService.deleteChamado(id).subscribe({
        next: () => {
          this.toastr.success('Chamado excluído com sucesso!');
          this.loadChamados(); // Reload the list
        },
        error: (err) => {
          this.toastr.error('Erro ao excluir chamado.');
          console.error(err);
        }
      });
    }
  }
}
