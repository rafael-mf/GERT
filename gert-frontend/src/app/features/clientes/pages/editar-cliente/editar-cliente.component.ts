import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from '../../../../shared/models/cliente.model';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.scss']
})
export class EditarClienteComponent implements OnInit {
  clienteForm: FormGroup;
  loading = false;
  submitted = false;
  clienteId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      cpfCnpj: [''],
      email: ['', [Validators.email]],
      telefone: [''],
      endereco: [''],
      cidade: [''],
      estado: ['', [Validators.maxLength(2)]],
      cep: [''],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = +idParam;
      this.loadCliente();
    } else {
      this.toastr.error('ID do cliente não fornecido.');
      this.router.navigate(['/clientes']);
    }
  }

  loadCliente(): void {
    this.loading = true;
    this.clienteService.getClienteById(this.clienteId).subscribe({
      next: (data) => {
        this.clienteForm.patchValue(data);
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar dados do cliente.');
        this.router.navigate(['/clientes']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.clienteForm.invalid) {
      this.toastr.error('Por favor, corrija os erros no formulário.');
      return;
    }

    this.loading = true;
    this.clienteService.updateCliente(this.clienteId, this.clienteForm.value).subscribe({
      next: () => {
        this.toastr.success('Cliente atualizado com sucesso!');
        this.router.navigate(['/clientes', this.clienteId]);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Erro ao atualizar cliente.');
        this.loading = false;
      }
    });
  }
}
