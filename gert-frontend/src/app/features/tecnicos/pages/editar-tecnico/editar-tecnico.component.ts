import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TecnicoService } from '../../../../core/services/tecnico.service';

@Component({
  selector: 'app-editar-tecnico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-tecnico.component.html',
  styleUrls: ['./editar-tecnico.component.scss']
})
export class EditarTecnicoComponent implements OnInit {
  tecnicoForm: FormGroup;
  loading = false;
  submitted = false;
  tecnicoId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tecnicoService: TecnicoService,
    private toastr: ToastrService
  ) {
    this.tecnicoForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      especialidade: ['', Validators.required],
      ativo: [true],
      disponivel: [true]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.tecnicoId = +idParam;
      this.loadTecnico();
    } else {
      this.toastr.error('ID do técnico não fornecido.');
      this.router.navigate(['/tecnicos']);
    }
  }

  loadTecnico(): void {
    this.loading = true;
    this.tecnicoService.getTecnicoById(this.tecnicoId).subscribe({
      next: (data) => {
        // Preenche o formulário com dados do técnico e do usuário associado
        this.tecnicoForm.patchValue({
          nome: data.usuario?.nome,
          email: data.usuario?.email,
          ativo: data.usuario?.ativo,
          especialidade: data.especialidade,
          disponivel: data.disponivel
        });
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar dados do técnico.');
        this.router.navigate(['/tecnicos']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.tecnicoForm.invalid) {
      return;
    }

    this.loading = true;
    this.tecnicoService.updateTecnico(this.tecnicoId, this.tecnicoForm.value).subscribe({
      next: () => {
        this.toastr.success('Técnico atualizado com sucesso!');
        this.router.navigate(['/tecnicos']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Erro ao atualizar técnico.');
        this.loading = false;
      }
    });
  }
}
