import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { DispositivoService } from '../../../../core/services/dispositivo.service';
import { Cliente } from '../../../../shared/models/cliente.model';
import { Dispositivo } from '../../../../shared/models/dispositivo.model';
import { CategoriaDispositivo } from '../../../../shared/models/categoria-dispositivo.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalhe-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, FormsModule, NgbModalModule],
  templateUrl: './detalhe-cliente.component.html',
  styleUrls: ['./detalhe-cliente.component.scss']
})
export class DetalheClienteComponent implements OnInit {
  cliente: Cliente | null = null;
  loading = true;
  error = '';

  // Para cadastro de dispositivo
  showDispositivoForm = false;
  novoDispositivo: Omit<Dispositivo, 'id' | 'dataCadastro' | 'categoria'> = {
    clienteId: 0,
    categoriaId: 0,
    marca: '',
    modelo: '',
    numeroSerie: '',
    especificacoes: ''
  };
  categoriasDispositivo: CategoriaDispositivo[] = [];
  savingDispositivo = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private dispositivoService: DispositivoService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const clienteId = +idParam;
      this.novoDispositivo.clienteId = clienteId;
      this.loadClienteDetails(clienteId);
      this.loadCategoriasDispositivo();
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

  loadCategoriasDispositivo(): void {
    this.dispositivoService.getCategoriasDispositivo().subscribe({
      next: (data) => {
        this.categoriasDispositivo = data;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias de dispositivo:', err);
      }
    });
  }

  toggleDispositivoForm(): void {
    this.showDispositivoForm = !this.showDispositivoForm;
    if (!this.showDispositivoForm) {
      this.resetDispositivoForm();
    }
  }

  resetDispositivoForm(): void {
    this.novoDispositivo = {
      clienteId: this.cliente?.id || 0,
      categoriaId: 0,
      marca: '',
      modelo: '',
      numeroSerie: '',
      especificacoes: ''
    };
  }

  salvarDispositivo(): void {
    if (!this.novoDispositivo.marca || !this.novoDispositivo.modelo || !this.novoDispositivo.categoriaId) {
      this.toastr.error('Preencha todos os campos obrigatórios');
      return;
    }

    this.savingDispositivo = true;
    this.dispositivoService.createDispositivo(this.novoDispositivo).subscribe({
      next: (dispositivo) => {
        this.toastr.success('Dispositivo cadastrado com sucesso!');
        this.resetDispositivoForm();
        this.showDispositivoForm = false;
        this.savingDispositivo = false;
        // Recarregar os detalhes do cliente para mostrar o novo dispositivo
        if (this.cliente?.id) {
          this.loadClienteDetails(this.cliente.id);
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao cadastrar dispositivo');
        this.savingDispositivo = false;
        console.error(err);
      }
    });
  }

  confirmarExclusaoDispositivo(dispositivo: Dispositivo): void {
    if (confirm(`Tem certeza que deseja excluir o dispositivo ${dispositivo.marca} ${dispositivo.modelo}?`)) {
      this.excluirDispositivo(dispositivo.id!);
    }
  }

  excluirDispositivo(dispositivoId: number): void {
    this.dispositivoService.deleteDispositivo(dispositivoId).subscribe({
      next: () => {
        this.toastr.success('Dispositivo excluído com sucesso!');
        // Recarregar os detalhes do cliente para atualizar a lista
        if (this.cliente?.id) {
          this.loadClienteDetails(this.cliente.id);
        }
      },
      error: (err) => {
        if (err.error?.message?.includes('chamados vinculados')) {
          this.toastr.error('Não é possível excluir o dispositivo pois existem chamados vinculados a ele');
        } else {
          this.toastr.error('Erro ao excluir dispositivo');
        }
        console.error(err);
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
