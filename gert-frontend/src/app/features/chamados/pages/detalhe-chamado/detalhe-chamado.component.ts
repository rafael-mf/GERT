// gert-frontend/src/app/features/chamados/pages/detalhe-chamado/detalhe-chamado.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChamadoService } from '../../../../core/services/chamado.service';
import { ChamadoAtualizacaoService, ChamadoAtualizacao } from '../../../../core/services/chamado-atualizacao.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Chamado } from '../../../../shared/models/chamado.model';
import { Servico } from '../../../../shared/models/servico.model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-detalhe-chamado',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './detalhe-chamado.component.html',
  styleUrls: ['./detalhe-chamado.component.scss']
})
export class DetalheChamadoComponent implements OnInit {
  chamado: Chamado | null = null;
  loading = true;
  error = '';
  chamadoId!: number;
  atualizacoes: ChamadoAtualizacao[] = [];
  loadingAtualizacoes = false;

  // Modal de Serviços
  showServicosModal = false;
  servicosDisponiveis: Servico[] = [];
  loadingServicos = false;
  selectedServicoId: number | null = null;
  valorServico: number | null = null;
  observacoesServico = '';
  addingServico = false;

  // Modal de Peças
  showPecasModal = false;
  loadingPecas = false;
  quantidadePeca: number = 1;
  valorUnitarioPeca: number | null = null;
  addingPeca = false;

  // Campos para peça específica do chamado
  pecaNome: string = '';
  pecaDescricao: string = '';
  pecaMarca: string = '';
  pecaModelo: string = '';
  pecaNumeroSerie: string = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chamadoService = inject(ChamadoService);
  private chamadoAtualizacaoService = inject(ChamadoAtualizacaoService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.chamadoId = +idParam;
      this.loadChamadoDetails();
    } else {
      this.error = 'ID do chamado não fornecido.';
      this.toastr.error(this.error);
      this.loading = false;
    }
  }

  loadChamadoDetails(): void {
    this.loading = true;
    this.chamadoService.getChamadoById(this.chamadoId).subscribe({
      next: (data) => {
        this.chamado = data;
        this.loading = false;
        // Carregar histórico de atualizações
        this.loadAtualizacoes();
      },
      error: (err) => {
        this.error = 'Erro ao carregar detalhes do chamado.';
        this.toastr.error(this.error);
        console.error(err);
        this.loading = false;
        if (err.status === 404) {
            this.router.navigate(['/chamados']);
        }
      }
    });
  }

  loadAtualizacoes(): void {
    this.loadingAtualizacoes = true;
    this.chamadoAtualizacaoService.getAtualizacoesByChamado(this.chamadoId).subscribe({
      next: (data) => {
        this.atualizacoes = data;
        this.loadingAtualizacoes = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico:', err);
        this.loadingAtualizacoes = false;
      }
    });
  }

  editChamado(): void {
    if (this.chamado?.id) {
      this.router.navigate(['/chamados', this.chamado.id, 'editar']);
    }
  }

  // === MÉTODOS PARA MODAL DE SERVIÇOS ===
  openServicosModal(): void {
    this.showServicosModal = true;
    this.loadServicosDisponiveis();
    this.resetServicoForm();
  }

  closeServicosModal(): void {
    this.showServicosModal = false;
    this.resetServicoForm();
  }

  private resetServicoForm(): void {
    this.selectedServicoId = null;
    this.valorServico = null;
    this.observacoesServico = '';
  }

  loadServicosDisponiveis(): void {
    this.loadingServicos = true;
    this.chamadoService.getServicos().subscribe({
      next: (servicos) => {
        this.servicosDisponiveis = servicos;
        this.loadingServicos = false;
      },
      error: (err) => {
        console.error('Erro ao carregar serviços:', err);
        this.toastr.error('Erro ao carregar lista de serviços');
        this.loadingServicos = false;
      }
    });
  }

  onServicoSelected(): void {
    if (this.selectedServicoId) {
      const servico = this.servicosDisponiveis.find(s => s.id === this.selectedServicoId);
      if (servico && !this.valorServico) {
        this.valorServico = servico.valorBase;
      }
    }
  }

  addServico(): void {
    if (!this.selectedServicoId || !this.chamadoId) {
      this.toastr.warning('Selecione um serviço');
      return;
    }

    this.addingServico = true;
    const servicoData = {
      servicoId: this.selectedServicoId,
      valor: this.valorServico || undefined,
      observacoes: this.observacoesServico || undefined
    };

    this.chamadoService.addServicoAoChamado(this.chamadoId, servicoData).subscribe({
      next: () => {
        this.toastr.success('Serviço adicionado com sucesso!');
        this.closeServicosModal();
        this.loadChamadoDetails(); // Recarregar detalhes para atualizar a lista
        this.addingServico = false;
      },
      error: (err) => {
        console.error('Erro ao adicionar serviço:', err);
        this.toastr.error('Erro ao adicionar serviço');
        this.addingServico = false;
      }
    });
  }

  removeServico(chamadoServicoId: number): void {
    this.modalService.confirmDelete('este serviço').then(confirmed => {
      if (confirmed) {
        this.chamadoService.removeServicoDoChamado(this.chamadoId, chamadoServicoId).subscribe({
          next: () => {
            this.toastr.success('Serviço removido com sucesso!');
            this.loadChamadoDetails(); // Recarregar detalhes para atualizar a lista
          },
          error: (err: any) => {
            console.error('Erro ao remover serviço:', err);
            this.toastr.error('Erro ao remover serviço');
          }
        });
      }
    });
  }

  // === MÉTODOS PARA MODAL DE PEÇAS ===
  openPecasModal(): void {
    this.showPecasModal = true;
    this.resetPecaForm();
  }

  closePecasModal(): void {
    this.showPecasModal = false;
    this.resetPecaForm();
  }

  private resetPecaForm(): void {
    this.quantidadePeca = 1;
    this.valorUnitarioPeca = null;
    // Reset dos campos da peça específica
    this.pecaNome = '';
    this.pecaDescricao = '';
    this.pecaMarca = '';
    this.pecaModelo = '';
    this.pecaNumeroSerie = '';
  }

  addPeca(): void {
    if (!this.pecaNome.trim()) {
      this.toastr.warning('Digite o nome da peça');
      return;
    }

    if (!this.valorUnitarioPeca) {
      this.toastr.warning('Defina o valor unitário da peça');
      return;
    }

    this.addingPeca = true;

    const pecaData = {
      nome: this.pecaNome.trim(),
      descricao: this.pecaDescricao.trim(),
      marca: this.pecaMarca.trim(),
      modelo: this.pecaModelo.trim(),
      numeroSerie: this.pecaNumeroSerie.trim(),
      quantidade: this.quantidadePeca,
      valorUnitario: this.valorUnitarioPeca
    };

    this.chamadoService.addPecaUsada(this.chamadoId, pecaData).subscribe({
      next: () => {
        this.toastr.success('Peça adicionada com sucesso!');
        this.closePecasModal();
        this.loadChamadoDetails(); // Recarregar detalhes para atualizar a lista
        this.addingPeca = false;
      },
      error: (err: any) => {
        console.error('Erro ao adicionar peça:', err);
        this.toastr.error('Erro ao adicionar peça');
        this.addingPeca = false;
      }
    });
  }

  removePeca(pecaUsadaId: number): void {
    this.modalService.confirmDelete('esta peça').then(confirmed => {
      if (confirmed) {
        this.chamadoService.removePecaUsada(pecaUsadaId).subscribe({
          next: () => {
            this.toastr.success('Peça removida com sucesso!');
            this.loadChamadoDetails(); // Recarregar detalhes para atualizar a lista
          },
          error: (err: any) => {
            console.error('Erro ao remover peça:', err);
            this.toastr.error('Erro ao remover peça');
          }
        });
      }
    });
  }

  // === MÉTODOS PARA AÇÕES DO CHAMADO ===
  fecharChamado(): void {
    if (!this.chamado) return;

    // Verificar se tem diagnóstico e solução preenchidos
    if (!this.chamado.diagnostico?.trim() || !this.chamado.solucao?.trim()) {
      this.toastr.warning('Diagnóstico e solução são obrigatórios para fechar o chamado');
      return;
    }

    this.modalService.confirmCloseChamado().then(confirmed => {
      if (confirmed) {
        this.chamadoService.fecharChamado(this.chamadoId, {
          diagnostico: this.chamado!.diagnostico!,
          solucao: this.chamado!.solucao!,
          valorTotal: this.chamado!.valorTotal
        }).subscribe({
          next: () => {
            this.toastr.success('Chamado fechado com sucesso!');
            this.loadChamadoDetails();
          },
          error: (err: any) => {
            console.error('Erro ao fechar chamado:', err);
            this.toastr.error(err.error?.message || 'Erro ao fechar chamado');
          }
        });
      }
    });
  }

  reabrirChamado(): void {
    if (!this.chamado) return;

    this.modalService.confirm({
      title: 'Reabrir Chamado',
      message: 'Tem certeza que deseja reabrir este chamado?',
      confirmText: 'Reabrir',
      cancelText: 'Cancelar',
      confirmClass: 'warning'
    }).then(confirmed => {
      if (confirmed) {
        const comentario = prompt('Motivo para reabrir o chamado (opcional):');

        this.chamadoService.reabrirChamado(this.chamadoId, comentario || undefined).subscribe({
          next: () => {
            this.toastr.success('Chamado reaberto com sucesso!');
            this.loadChamadoDetails();
          },
          error: (err: any) => {
            console.error('Erro ao reabrir chamado:', err);
            this.toastr.error(err.error?.message || 'Erro ao reabrir chamado');
          }
        });
      }
    });
  }

  adicionarComentario(): void {
    this.modalService.addComment().then(comentario => {
      if (comentario.trim()) {
        // Usar o serviço de atualizações para adicionar comentário
        const usuarioLogado = this.authService.currentUserValue;
        if (!usuarioLogado?.id) {
          this.toastr.error('Usuário não autenticado');
          return;
        }
        
        this.chamadoAtualizacaoService.registrarComentario({
          chamadoId: this.chamadoId,
          usuarioId: usuarioLogado.id,
          comentario: comentario.trim()
        }).subscribe({
          next: () => {
            this.toastr.success('Comentário adicionado com sucesso!');
            this.loadAtualizacoes();
          },
          error: (err: any) => {
            console.error('Erro ao adicionar comentário:', err);
            this.toastr.error('Erro ao adicionar comentário');
          }
        });
      }
    });
  }
}
