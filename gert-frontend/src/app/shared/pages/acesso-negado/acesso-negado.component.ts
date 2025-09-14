import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div class="row w-100 justify-content-center">
        <div class="col-md-6 col-lg-5 col-xl-4">
          <div class="card shadow">
            <div class="card-body text-center p-5">
              <div class="mb-4">
                <i class="fas fa-shield-alt fa-5x text-danger"></i>
              </div>
              <h2 class="text-danger mb-3">Acesso Negado</h2>
              <p class="text-muted mb-4">
                Você não possui permissão para acessar esta funcionalidade. 
                Entre em contato com o administrador do sistema se precisar de acesso.
              </p>
              <div class="d-grid gap-2">
                <button class="btn btn-primary" routerLink="/dashboard">
                  <i class="fas fa-home me-2"></i>Voltar ao Dashboard
                </button>
                <button class="btn btn-outline-secondary" onclick="history.back()">
                  <i class="fas fa-arrow-left me-2"></i>Página Anterior
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      min-height: 100vh;
    }
  `]
})
export class AcessoNegadoComponent { }