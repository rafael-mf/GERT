import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServicoService, PaginatedServicos } from '../../../../core/services/servico.service';
import { Servico } from '../../../../shared/models/servico.model';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-lista-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-servicos.component.html',
  styleUrl: './lista-servicos.component.scss'
})
export class ListaServicosComponent implements OnInit {
  servicos: Servico[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  limit = 10;

  constructor(
    private servicoService: ServicoService,
    private toastr: ToastrService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadServicos();
  }

  loadServicos(): void {
    this.loading = true;
    this.error = '';

    const params = {
      page: this.currentPage,
      limit: this.limit,
      search: this.searchTerm
    };

    this.servicoService.getServicos(params).subscribe({
      next: (response: PaginatedServicos) => {
        this.servicos = response.servicos;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar serviços';
        this.toastr.error(this.error);
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadServicos();
  }

  limparFiltros(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadServicos();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadServicos();
  }

  deleteServico(servico: Servico): void {
    this.modalService.confirmDelete(servico.nome).then(confirmed => {
      if (confirmed) {
        this.servicoService.deleteServico(servico.id!).subscribe({
          next: () => {
            this.toastr.success('Serviço excluído com sucesso!');
            this.loadServicos();
          },
          error: (err: any) => {
            this.error = err.error?.message || 'Erro ao excluir serviço';
            this.toastr.error(this.error);
            console.error(err);
          }
        });
      }
    });
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
