// File: gert-frontend/src/app/features/clientes/pages/novo-cliente/novo-cliente.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from '../../../../shared/models/cliente.model';

@Component({
  selector: 'app-novo-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './novo-cliente.component.html',
  styleUrls: ['./novo-cliente.component.scss']
})
export class NovoClienteComponent implements OnInit {
  clienteForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
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

  get f() { return this.clienteForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.clienteForm.invalid) {
      this.toastr.error('Verifique os campos do formulário.', 'Formulário Inválido');
      return;
    }

    this.loading = true;
    const novoCliente: Omit<Cliente, 'id' | 'dataCadastro'> = this.clienteForm.value;

    this.clienteService.createCliente(novoCliente).subscribe({
      next: (clienteCriado) => {
        this.toastr.success(`Cliente "${clienteCriado.nome}" criado com sucesso!`);
        this.router.navigate(['/clientes', clienteCriado.id]);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Erro ao criar cliente.');
        console.error(err);
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
