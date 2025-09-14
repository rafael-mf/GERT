import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-edit.component.html',
  styleUrls: ['./perfil-edit.component.scss']
})
export class PerfilEditComponent implements OnInit {
  perfilForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    console.log('PerfilEditComponent: Construtor executado');
  }

  ngOnInit(): void {
    console.log('PerfilEditComponent: ngOnInit executado');
    this.initForm();
    this.loadUserData();
  }

  private initForm(): void {
    this.perfilForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cargo: [{ value: '', disabled: true }]
    });
  }

  private loadUserData(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.perfilForm.patchValue({
        nome: user.nome,
        email: user.email,
        cargo: user.cargo
      });
    }
  }

  onSubmit(): void {
    if (this.perfilForm.valid) {
      this.loading = true;
      // TODO: Implementar atualização do perfil via API
      this.toastr.success('Perfil atualizado com sucesso!');
      this.loading = false;
    } else {
      this.toastr.error('Preencha todos os campos corretamente');
    }
  }
}