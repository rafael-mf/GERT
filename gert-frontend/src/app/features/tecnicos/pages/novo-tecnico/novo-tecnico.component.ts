import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TecnicoService } from '../../../../core/services/tecnico.service';

@Component({
  selector: 'app-novo-tecnico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './novo-tecnico.component.html',
  styleUrls: ['./novo-tecnico.component.scss']
})
export class NovoTecnicoComponent {
  tecnicoForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private tecnicoService: TecnicoService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.tecnicoForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      especialidade: ['', Validators.required],
      ativo: [true],
      disponivel: [true]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.tecnicoForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.loading = true;
    this.tecnicoService.createTecnico(this.tecnicoForm.value).subscribe({
      next: () => {
        this.toastr.success('Técnico cadastrado com sucesso!');
        this.router.navigate(['/tecnicos']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Erro ao cadastrar técnico.');
        this.loading = false;
      }
    });
  }
}
