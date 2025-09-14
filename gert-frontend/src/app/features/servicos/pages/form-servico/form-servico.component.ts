// gert-frontend/src/app/features/servicos/pages/form-servico/form-servico.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicoService } from '../../../../core/services/servico.service';
import { Servico } from '../../../../shared/models/servico.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-servico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-servico.component.html',
  styleUrl: './form-servico.component.scss'
})
export class FormServicoComponent implements OnInit {
  servicoForm!: FormGroup;
  loading = false;
  submitted = false;
  isEditing = false;
  servicoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private servicoService: ServicoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Verificar se é edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.servicoId = +id;
      this.loadServico(this.servicoId);
    }
  }

  initForm(): void {
    this.servicoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      valorBase: [0, [Validators.required, Validators.min(0)]],
      tempoEstimado: [null, [Validators.min(1)]],
      ativo: [true]
    });
  }

  loadServico(id: number): void {
    this.loading = true;
    this.servicoService.getServicoById(id).subscribe({
      next: (servico) => {
        this.servicoForm.patchValue(servico);
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar serviço');
        console.error(err);
        this.router.navigate(['/servicos']);
      }
    });
  }

  get f() {
    return this.servicoForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.servicoForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.loading = true;
    const servicoData: Servico = this.servicoForm.value;

    if (this.isEditing && this.servicoId) {
      this.servicoService.updateServico(this.servicoId, servicoData).subscribe({
        next: () => {
          this.toastr.success('Serviço atualizado com sucesso!');
          this.router.navigate(['/servicos']);
        },
        error: (err) => {
          this.toastr.error('Erro ao atualizar serviço');
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.servicoService.createServico(servicoData).subscribe({
        next: () => {
          this.toastr.success('Serviço criado com sucesso!');
          this.router.navigate(['/servicos']);
        },
        error: (err) => {
          this.toastr.error('Erro ao criar serviço');
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/servicos']);
  }
}