import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgbDropdownModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  collapsed = false;
  pageTitle = 'Dashboard';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Atualizar o título da página com base na rota atual
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = this.router.url;
      this.updatePageTitle(currentUrl);
    });

    // Verificar se está em uma tela pequena para colapsar o menu automaticamente
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private updatePageTitle(url: string): void {
    if (url.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('/chamados')) {
      this.pageTitle = 'Gerenciamento de Chamados';
    } else if (url.includes('/clientes')) {
      this.pageTitle = 'Clientes';
    } else if (url.includes('/estoque')) {
      this.pageTitle = 'Controle de Estoque';
    } else if (url.includes('/tecnicos')) {
      this.pageTitle = 'Equipe Técnica';
    } else if (url.includes('/relatorios')) {
      this.pageTitle = 'Relatórios';
    } else if (url.includes('/perfil')) {
      this.pageTitle = 'Meu Perfil';
    } else if (url.includes('/configuracoes')) {
      this.pageTitle = 'Configurações';
    }
  }

  private checkScreenSize(): void {
    if (window.innerWidth < 768) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
    }
  }
}
