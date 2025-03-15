#!/bin/bash

# Script para configurar o sistema de login
# Deve ser executado na pasta raiz do projeto onde estão as pastas gert-backend e gert-frontend

echo "Iniciando configuração do sistema de login..."

# 1. Configuração do Backend
echo "===== Configurando Backend ====="

# Criar pasta scripts se não existir
mkdir -p gert-backend/src/scripts

# Criar o script de seed para usuários
cat > gert-backend/src/scripts/seed-users.js << 'EOL'
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { Usuario } = require('../models/usuario.model');
const { Tecnico } = require('../models/tecnico.model');

async function seedUsers() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Criar usuários de teste
    const adminPassword = await bcrypt.hash('admin123', 10);
    const tecnicoPassword = await bcrypt.hash('tecnico123', 10);
    const atendentePassword = await bcrypt.hash('atendente123', 10);

    // Verificar se já existe o admin
    const adminExists = await Usuario.findOne({ where: { email: 'admin@sistema.com' } });
    
    if (!adminExists) {
      await Usuario.create({
        nome: 'Administrador',
        email: 'admin@sistema.com',
        senha: adminPassword,
        cargo: 'Administrador',
        ativo: true,
        dataCriacao: new Date(),
        ultimoAcesso: null
      });
      console.log('Usuário administrador criado com sucesso.');
    } else {
      console.log('Usuário administrador já existe.');
    }

    // Criar usuário técnico
    const tecnicoExists = await Usuario.findOne({ where: { email: 'tecnico@sistema.com' } });
    
    if (!tecnicoExists) {
      const novoTecnico = await Usuario.create({
        nome: 'Técnico Teste',
        email: 'tecnico@sistema.com',
        senha: tecnicoPassword,
        cargo: 'Técnico',
        ativo: true,
        dataCriacao: new Date(),
        ultimoAcesso: null
      });
      
      // Criar registro na tabela de técnicos
      await Tecnico.create({
        usuarioId: novoTecnico.id,
        especialidade: 'Manutenção de Smartphones',
        disponivel: true
      });
      
      console.log('Usuário técnico criado com sucesso.');
    } else {
      console.log('Usuário técnico já existe.');
    }

    // Criar usuário atendente
    const atendenteExists = await Usuario.findOne({ where: { email: 'atendente@sistema.com' } });
    
    if (!atendenteExists) {
      await Usuario.create({
        nome: 'Atendente Teste',
        email: 'atendente@sistema.com',
        senha: atendentePassword,
        cargo: 'Atendente',
        ativo: true,
        dataCriacao: new Date(),
        ultimoAcesso: null
      });
      console.log('Usuário atendente criado com sucesso.');
    } else {
      console.log('Usuário atendente já existe.');
    }

    console.log('Usuários de teste criados com sucesso!');
    console.log('===============================');
    console.log('Credenciais:');
    console.log('Admin: admin@sistema.com / admin123');
    console.log('Técnico: tecnico@sistema.com / tecnico123');
    console.log('Atendente: atendente@sistema.com / atendente123');
    console.log('===============================');

  } catch (error) {
    console.error('Erro ao criar usuários de teste:', error);
  } finally {
    process.exit();
  }
}

// Executar o script
seedUsers();
EOL

echo "Script de seed de usuários criado em gert-backend/src/scripts/seed-users.js"

# 2. Configuração do Frontend
echo "===== Configurando Frontend ====="

# Atualizar o componente de login
cat > gert-frontend/src/app/features/auth/pages/login/login.component.ts << 'EOL'
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

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
    private toastr: ToastrService
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

    // Preencher com valores salvos se existirem
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        remember: true
      });
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Salvar email se "lembrar-me" estiver marcado
    if (this.f['remember'].value) {
      localStorage.setItem('savedEmail', this.f['email'].value);
    } else {
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
EOL

echo "Componente de login atualizado em gert-frontend/src/app/features/auth/pages/login/login.component.ts"

# Fazer backup do arquivo HTML original
cp gert-frontend/src/app/features/auth/pages/login/login.component.html gert-frontend/src/app/features/auth/pages/login/login.component.html.bak

# Adicionar os botões de desenvolvimento ao arquivo HTML
if grep -q "login-footer" gert-frontend/src/app/features/auth/pages/login/login.component.html; then
  echo "Botões de desenvolvimento já existem no arquivo HTML"
else
  # Encontrar a última tag de fechamento div
  LAST_DIV_LINE=$(grep -n "</div>" gert-frontend/src/app/features/auth/pages/login/login.component.html | tail -1 | cut -d: -f1)
  
  # Inserir os botões de desenvolvimento antes da última div
  sed -i "${LAST_DIV_LINE}i\\
<div class=\"login-footer\">\\
  <div class=\"dev-options mt-4 text-center\">\\
    <small class=\"text-muted mb-2 d-block\">Opções de desenvolvimento:</small>\\
    <div class=\"btn-group btn-group-sm\">\\
      <button type=\"button\" class=\"btn btn-outline-secondary\" (click)=\"preencherCredenciais('Administrador')\">\\
        Admin\\
      </button>\\
      <button type=\"button\" class=\"btn btn-outline-secondary\" (click)=\"preencherCredenciais('Técnico')\">\\
        Técnico\\
      </button>\\
      <button type=\"button\" class=\"btn btn-outline-secondary\" (click)=\"preencherCredenciais('Atendente')\">\\
        Atendente\\
      </button>\\
    </div>\\
  </div>\\
</div>
" gert-frontend/src/app/features/auth/pages/login/login.component.html
  
  echo "Botões de desenvolvimento adicionados ao arquivo HTML"
fi

echo "===== Configuração concluída! ====="
echo ""
echo "Agora você deve:"
echo "1. Verificar se o banco de dados está em execução"
echo "2. Configurar o arquivo .env no backend (baseado no .env.example)"
echo "3. Executar o script de seed para criar os usuários:"
echo "   cd gert-backend"
echo "   node src/scripts/seed-users.js"
echo ""
echo "Credenciais de teste:"
echo "Admin: admin@sistema.com / admin123"
echo "Técnico: tecnico@sistema.com / tecnico123"
echo "Atendente: atendente@sistema.com / atendente123"
