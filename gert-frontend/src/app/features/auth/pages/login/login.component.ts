import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/';
  error = '';
  showPassword = false;

  // Credenciais de teste - Remova em produção
  testCredentials = [
    { role: 'Administrador', email: 'admin@sistema.com', password: 'admin123' },
    { role: 'Técnico', email: 'tecnico@sistema.com', password: 'tecnico123' },
    { role: 'Atendente', email: 'atendente@sistema.com', password: 'atendente123' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // redirecionar para home se já estiver logado
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    // Inicializar o formulário
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      remember: [false]
    });

    // obter URL de retorno dos parâmetros da rota ou ir para '/' por padrão
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Preencher com valores salvos se existirem e estamos no navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) {
        this.loginForm.patchValue({
          email: savedEmail,
          remember: true
        });
      }
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Salvar email se "lembrar-me" estiver marcado e estamos no navegador
    if (isPlatformBrowser(this.platformId) && this.f['remember'].value) {
      localStorage.setItem('savedEmail', this.f['email'].value);
    } else if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('savedEmail');
    }

    this.authService.login(this.f['email'].value, this.f['senha'].value)
      .subscribe({
        next: () => {
          this.toastr.success('Login realizado com sucesso!', 'Bem-vindo');
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          this.error = 'Email ou senha inválidos. Por favor, tente novamente.';
          this.toastr.error('Credenciais inválidas', 'Erro de login');
          this.loading = false;
        }
      });
  }

  // Helper para pré-preencher credenciais de teste (para desenvolvimento apenas)
  preencherCredenciais(role: string) {
    const credencial = this.testCredentials.find(c => c.role === role);
    if (credencial) {
      this.loginForm.patchValue({
        email: credencial.email,
        senha: credencial.password
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
