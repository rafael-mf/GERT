// File: gert-frontend/src/app/features/clientes/pages/lista-cliente/lista-cliente.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ClienteService, PaginatedClientes } from '../../../../core/services/cliente.service';
import { Cliente } from '../../../../shared/models/cliente.model';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgbPaginationModule, NgbTooltipModule, DatePipe],
  templateUrl: './lista-cliente.component.html',
  styleUrl: './lista-cliente.component.scss'
})
export class ListaClienteComponent implements OnInit {
  paginatedClientes: PaginatedClientes = { clientes: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  loading = false;
  error = '';
  searchTerm: string = '';
  page: number = 1;
  limit: number = 10;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    const params = {
      page: this.page,
      limit: this.limit,
      searchTerm: this.searchTerm
    };
    this.clienteService.getClientes(params).subscribe({
      next: (data) => {
        this.paginatedClientes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar clientes.';
        this.toastr.error(this.error);
        console.error(err);
        this.loading = false;
      }
    });
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadClientes();
  }

  applyFilters(): void {
    this.page = 1;
    this.loadClientes();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.page = 1;
    this.loadClientes();
  }

  viewCliente(id?: number): void {
    if (id) this.router.navigate(['/clientes', id]);
  }

  editCliente(id?: number): void {
    if (id) this.router.navigate(['/clientes', id, 'editar']);
  }

  deleteCliente(id?: number): void {
    if (id && confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          this.toastr.success('Cliente excluído com sucesso!');
          this.loadClientes();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Erro ao excluir cliente.');
          console.error(err);
        }
      });
    }
  }

  // === MÉTODO PARA PAGINAÇÃO PADRÃO ===
  getPagesArray(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.paginatedClientes.totalPages, this.page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
