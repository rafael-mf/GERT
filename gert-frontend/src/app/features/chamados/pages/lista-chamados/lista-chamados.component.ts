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
import { ModalService } from '../../../../shared/services/modal.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AtribuirTecnicoModalComponent } from '../../../../shared/components/atribuir-tecnico-modal/atribuir-tecnico-modal.component';

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

  // Meus Chamados feature
  filtroMeusChamadosAtivo: boolean = false;
  contagemMeusChamados: number = 0;

  // Data for filters
  statusList: StatusChamado[] = [];
  prioridadesList: Prioridade[] = [];
  tecnicosList: Tecnico[] = [];

  constructor(
    private chamadoService: ChamadoService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: ModalService,
    private authService: AuthService,
    private ngbModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadChamados();
    this.loadAuxData();
    this.carregarContagemMeusChamados();
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
    this.filtroMeusChamadosAtivo = false; // Desativar filtro "Meus Chamados"
    this.loadChamados();
  }

  // === MÉTODOS PARA "MEUS CHAMADOS ATIVOS" ===
  carregarContagemMeusChamados(): void {
    const usuario = this.authService.currentUserValue;
    if (!usuario?.id) return;

    // Buscar chamados do técnico que não estão concluídos
    const statusConcluido = this.statusList.find(s => s.nome === 'Concluído');
    const statusCancelado = this.statusList.find(s => s.nome === 'Cancelado');
    const statusEntregue = this.statusList.find(s => s.nome === 'Entregue');
    
    // Filtrar por técnico e status não finalizados
    const statusAtivos = this.statusList
      .filter(s => s.nome !== 'Concluído' && s.nome !== 'Cancelado' && s.nome !== 'Entregue')
      .map(s => s.id)
      .join(',');

    this.chamadoService.getChamados({
      tecnicoId: usuario.id.toString(),
      statusId: statusAtivos,
      limit: 1000 // Buscar todos para contagem
    }).subscribe({
      next: (response) => {
        this.contagemMeusChamados = response.totalItems;
      },
      error: (err) => {
        console.error('Erro ao carregar contagem de chamados:', err);
      }
    });
  }

  filtrarMeusChamados(): void {
    this.filtroMeusChamadosAtivo = !this.filtroMeusChamadosAtivo;

    if (this.filtroMeusChamadosAtivo) {
      const usuario = this.authService.currentUserValue;
      if (!usuario?.id) {
        this.toastr.warning('Usuário não identificado');
        this.filtroMeusChamadosAtivo = false;
        return;
      }

      // Aplicar filtros
      this.tecnicoIdFiltro = usuario.id.toString();
      
      // Filtrar apenas status ativos (não concluídos/cancelados/entregues)
      const statusAtivos = this.statusList
        .filter(s => s.nome !== 'Concluído' && s.nome !== 'Cancelado' && s.nome !== 'Entregue')
        .map(s => s.id)
        .join(',');
      
      this.statusIdFiltro = statusAtivos;
    } else {
      // Limpar filtros de "Meus Chamados"
      this.tecnicoIdFiltro = '';
      this.statusIdFiltro = '';
    }

    this.page = 1;
    this.applyFilters();
  }

  // === INDICADORES VISUAIS PARA CHAMADOS ===
  isChamadoAtrasado(chamado: any): boolean {
    if (!chamado.dataPrevista || chamado.status?.nome === 'Concluído' || chamado.status?.nome === 'Cancelado' || chamado.status?.nome === 'Entregue') {
      return false;
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataPrevista = new Date(chamado.dataPrevista);
    dataPrevista.setHours(0, 0, 0, 0);
    return dataPrevista < hoje;
  }

  isChamadoProximoPrazo(chamado: any): boolean {
    if (!chamado.dataPrevista || chamado.status?.nome === 'Concluído' || chamado.status?.nome === 'Cancelado' || chamado.status?.nome === 'Entregue') {
      return false;
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataPrevista = new Date(chamado.dataPrevista);
    dataPrevista.setHours(0, 0, 0, 0);
    
    const diffTime = dataPrevista.getTime() - hoje.getTime();
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDias >= 0 && diffDias <= 2;
  }

  isChamadoUrgente(chamado: any): boolean {
    const prioridadeNome = chamado.prioridade?.nome?.toLowerCase();
    return prioridadeNome === 'alta' || prioridadeNome === 'crítica' || prioridadeNome === 'critica';
  }

  getDiasRestantes(chamado: any): number {
    if (!chamado.dataPrevista) return 0;
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataPrevista = new Date(chamado.dataPrevista);
    dataPrevista.setHours(0, 0, 0, 0);
    
    const diffTime = dataPrevista.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // === MÉTODO PARA ATRIBUIR TÉCNICO ===
  abrirModalAtribuir(chamado: any): void {
    const modalRef = this.ngbModal.open(AtribuirTecnicoModalComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.chamadoId = chamado.id;
    modalRef.componentInstance.chamadoNumero = `#${chamado.id}`;
    modalRef.componentInstance.tecnicoAtualId = chamado.tecnico?.id;
    modalRef.componentInstance.tecnicosList = this.tecnicosList;

    modalRef.result.then(
      (success) => {
        if (success) {
          // Recarregar lista após atribuição
          this.loadChamados();
          this.carregarContagemMeusChamados();
        }
      },
      () => {
        // Modal foi fechado/cancelado - não faz nada
      }
    );
  }

  viewChamado(id?: number): void {
    if (id) this.router.navigate(['/chamados', id]);
  }

  editChamado(id?: number): void {
     if (id) this.router.navigate(['/chamados', id, 'editar']);
  }

  deleteChamado(id?: number): void {
    if (id) {
      this.modalService.confirmDelete('este chamado').then((confirmed) => {
        if (confirmed) {
          this.loading = true;
          this.chamadoService.deleteChamado(id).subscribe({
            next: () => {
              this.toastr.success('Chamado excluído com sucesso!');
              this.loadChamados(); // Reload the list
              this.loading = false;
            },
            error: (err) => {
              this.toastr.error('Erro ao excluir chamado.');
              console.error('Erro ao excluir chamado:', err);
              this.loading = false;
            }
          });
        }
      }).catch((error) => {
        console.error('Erro no modal de confirmação:', error);
        this.toastr.error('Erro ao processar confirmação');
      });
    } else {
      this.toastr.warning('ID do chamado não encontrado');
    }
  }

  // === MÉTODO PARA PAGINAÇÃO PADRÃO ===
  getPagesArray(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.paginatedChamados.totalPages, this.page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
