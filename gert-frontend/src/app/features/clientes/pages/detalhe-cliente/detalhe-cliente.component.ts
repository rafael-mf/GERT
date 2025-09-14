import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Cliente } from '../../../../shared/models/cliente.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalhe-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './detalhe-cliente.component.html',
  styleUrls: ['./detalhe-cliente.component.scss']
})
export class DetalheClienteComponent implements OnInit {
  cliente: Cliente | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const clienteId = +idParam;
      this.loadClienteDetails(clienteId);
    } else {
      this.handleError('ID do cliente não fornecido na rota.');
    }
  }

  loadClienteDetails(id: number): void {
    this.loading = true;
    this.clienteService.getClienteById(id).subscribe({
      next: (data) => {
        this.cliente = data;
        this.loading = false;
      },
      error: (err) => {
        this.handleError('Erro ao carregar os detalhes do cliente.', err);
        if (err.status === 404) {
          this.router.navigate(['/clientes']);
        }
      }
    });
  }

  private handleError(message: string, error?: any): void {
    this.error = message;
    this.toastr.error(message);
    this.loading = false;
    if (error) {
      console.error(error);
    }
  }

  editCliente(): void {
    if (this.cliente?.id) {
      this.router.navigate(['/clientes', this.cliente.id, 'editar']);
    }
  }
}
