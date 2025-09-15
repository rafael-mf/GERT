// File: gert-frontend/src/app/features/tecnicos/pages/lista-tecnico/lista-tecnico.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TecnicoService, PaginatedTecnicos } from '../../../../core/services/tecnico.service';
import { Tecnico } from '../../../../shared/models/tecnico.model';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-lista-tecnico',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './lista-tecnico.component.html',
  styleUrl: './lista-tecnico.component.scss'
})
export class ListaTecnicoComponent implements OnInit {
  paginatedTecnicos: PaginatedTecnicos = { tecnicos: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  loading = false;
  error = '';
  searchTerm: string = '';
  filtroDisponivel: string = ''; // 'true', 'false', ou '' para todos
  page: number = 1;
  limit: number = 10;
  isAdmin = false;

  constructor(
    private tecnicoService: TecnicoService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.currentUserValue?.cargo === 'admin';
    this.loadTecnicos();
  }

  loadTecnicos(): void {
    this.loading = true;
    const params: any = {
      page: this.page,
      limit: this.limit,
      searchTerm: this.searchTerm
    };
    if (this.filtroDisponivel !== '') {
      params.disponivel = this.filtroDisponivel;
    }

    this.tecnicoService.getTecnicos(params).subscribe({
      next: (data) => {
        this.paginatedTecnicos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar técnicos.';
        this.toastr.error(this.error);
        console.error(err);
        this.loading = false;
      }
    });
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadTecnicos();
  }

  applyFilters(): void {
    this.page = 1;
    this.loadTecnicos();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filtroDisponivel = '';
    this.page = 1;
    this.loadTecnicos();
  }

  viewTecnico(id?: number): void {
    if (id) this.router.navigate(['/tecnicos', id]);
  }

  editTecnico(id?: number): void {
     if (id) this.router.navigate(['/tecnicos', id, 'editar']);
  }

  deleteTecnico(id?: number): void {
    if (id && confirm('Tem certeza que deseja excluir este técnico? O usuário associado também será afetado.')) {
      this.tecnicoService.deleteTecnico(id).subscribe({
        next: () => {
          this.toastr.success('Técnico excluído com sucesso!');
          this.loadTecnicos();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Erro ao excluir técnico.');
          console.error(err);
        }
      });
    }
  }
}
