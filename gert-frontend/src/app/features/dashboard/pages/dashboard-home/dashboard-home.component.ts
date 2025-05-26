import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  // Dados de exemplo para o dashboard
  chamadosAbertos = 0;
  chamadosConcluidos = 0;
  chamadosEmAndamento = 0;
  totalClientes = 0;
  totalFaturamento = 0;
  totalPecasEstoque = 0;

  // Dados para gráficos
  chamadosPorStatus = {
    labels: ['Aberto', 'Em análise', 'Aguardando aprovação', 'Em andamento', 'Aguardando peça', 'Concluído', 'Cancelado'],
    data: [30, 15, 10, 25, 5, 40, 5]
  };

  faturamentoPorMes = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    data: [12000, 15000, 18000, 14000, 21000, 22000]
  };

  constructor() { }

  ngOnInit(): void {
    // Aqui seria feita a chamada para a API para obter os dados reais
    this.carregarDadosMock();
  }

  carregarDadosMock(): void {
    this.chamadosAbertos = 45;
    this.chamadosConcluidos = 220;
    this.chamadosEmAndamento = 35;
    this.totalClientes = 180;
    this.totalFaturamento = 85000;
    this.totalPecasEstoque = 540;
  }
}
