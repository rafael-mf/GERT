// gert-frontend/src/app/features/chamados/pages/detalhe-chamado/detalhe-chamado.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChamadoService } from '../../../../core/services/chamado.service';
import { ChamadoAtualizacaoService, ChamadoAtualizacao } from '../../../../core/services/chamado-atualizacao.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Chamado } from '../../../../shared/models/chamado.model';
import { Servico } from '../../../../shared/models/servico.model';
import { StatusChamado } from '../../../../shared/models/status-chamado.model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../../shared/services/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FinalizarChamadoModalComponent } from '../../../../shared/components/finalizar-chamado-modal/finalizar-chamado-modal.component';
import { AtribuirTecnicoModalComponent } from '../../../../shared/components/atribuir-tecnico-modal/atribuir-tecnico-modal.component';
import { DiagnosticoModalComponent } from '../../../../shared/components/diagnostico-modal/diagnostico-modal.component';

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

  // Status inline
  statusList: StatusChamado[] = [];
  statusSelecionado: number = 0;
  loadingStatus = false;

  // Lista de técnicos para atribuição
  tecnicosList: any[] = [];

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
  private ngbModal = inject(NgbModal);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.chamadoId = +idParam;
      this.loadChamadoDetails();
      this.loadStatusList();
      this.loadTecnicosList();
    } else {
      this.error = 'ID do chamado não fornecido.';
      this.toastr.error(this.error);
      this.loading = false;
    }
  }

  loadStatusList(): void {
    this.chamadoService.getStatusChamados().subscribe({
      next: (data) => {
        this.statusList = data;
      },
      error: (err) => {
        console.error('Erro ao carregar status:', err);
      }
    });
  }

  loadTecnicosList(): void {
    this.chamadoService.getTecnicos().subscribe({
      next: (data) => {
        this.tecnicosList = data;
      },
      error: (err) => {
        console.error('Erro ao carregar técnicos:', err);
      }
    });
  }

  loadChamadoDetails(): void {
    this.loading = true;
    this.chamadoService.getChamadoById(this.chamadoId).subscribe({
      next: (data) => {
        this.chamado = data;
        this.statusSelecionado = data.status?.id || 0; // Sincronizar status selecionado
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

  // === MÉTODO PARA MODAL DE FINALIZAÇÃO RÁPIDA ===
  abrirModalFinalizacao(): void {
    const modalRef = this.ngbModal.open(FinalizarChamadoModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.chamadoId = this.chamadoId;
    modalRef.componentInstance.chamadoNumero = `#${this.chamado?.id}`;

    modalRef.result.then(
      (success) => {
        if (success) {
          // Recarregar detalhes do chamado após finalização
          this.loadChamadoDetails();
        }
      },
      () => {
        // Modal foi fechado/cancelado - não faz nada
      }
    );
  }

  // Verifica se pode finalizar o chamado
  podeFinalizarChamado(): boolean {
    if (!this.chamado) return false;
    
    const statusNaoFinalizados = ['Concluído', 'Cancelado', 'Entregue'];
    return !statusNaoFinalizados.includes(this.chamado.status?.nome || '');
  }

  // === MÉTODO PARA ATRIBUIR TÉCNICO ===
  abrirModalAtribuir(): void {
    const modalRef = this.ngbModal.open(AtribuirTecnicoModalComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.chamadoId = this.chamadoId;
    modalRef.componentInstance.chamadoNumero = `#${this.chamado?.id}`;
    modalRef.componentInstance.tecnicoAtualId = this.chamado?.tecnico?.id;
    modalRef.componentInstance.tecnicosList = this.tecnicosList;

    modalRef.result.then(
      (success) => {
        if (success) {
          // Recarregar detalhes após atribuição
          this.loadChamadoDetails();
        }
      },
      () => {
        // Modal foi fechado/cancelado - não faz nada
      }
    );
  }

  // === MÉTODO PARA EDITAR DIAGNÓSTICO ===
  abrirModalDiagnostico(): void {
    const modalRef = this.ngbModal.open(DiagnosticoModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.chamadoId = this.chamadoId;
    modalRef.componentInstance.chamadoNumero = `#${this.chamado?.id}`;
    modalRef.componentInstance.diagnosticoAtual = this.chamado?.diagnostico || '';

    modalRef.result.then(
      (success) => {
        if (success) {
          // Recarregar detalhes após salvar diagnóstico
          this.loadChamadoDetails();
        }
      },
      () => {
        // Modal foi fechado/cancelado - não faz nada
      }
    );
  }

  // Verifica se o chamado está finalizado
  chamadoFinalizado(): boolean {
    if (!this.chamado) return false;
    const statusFinalizados = ['Concluído', 'Cancelado', 'Entregue'];
    return statusFinalizados.includes(this.chamado.status?.nome || '');
  }

  // === MÉTODOS PARA ATUALIZAÇÃO DE STATUS INLINE ===
  confirmarMudancaStatus(): void {
    if (this.loadingStatus) return;

    const novoStatus = this.statusList.find(s => s.id === this.statusSelecionado);
    const statusAtual = this.chamado?.status;

    if (!novoStatus || !statusAtual) return;

    // Se não houve mudança real, não faz nada
    if (novoStatus.id === statusAtual.id) return;

    // Confirmação com modal
    this.modalService.confirm({
      title: 'Confirmar Mudança de Status',
      message: `Tem certeza que deseja alterar o status de "${statusAtual.nome}" para "${novoStatus.nome}"?`,
      confirmText: 'Confirmar',
      confirmClass: 'primary'
    }).then((confirmed) => {
      if (confirmed) {
        this.atualizarStatus(this.statusSelecionado, statusAtual.id);
      } else {
        // Reverter seleção se cancelado
        this.statusSelecionado = statusAtual.id;
      }
    }).catch(() => {
      // Reverter seleção em caso de erro
      this.statusSelecionado = statusAtual.id;
    });
  }

  atualizarStatus(novoStatusId: number, statusAnteriorId: number): void {
    this.loadingStatus = true;
    
    this.chamadoService.updateChamado(this.chamadoId, { statusId: novoStatusId } as any).subscribe({
      next: () => {
        const novoStatus = this.statusList.find(s => s.id === novoStatusId);
        this.toastr.success(`Status atualizado para "${novoStatus?.nome}"`, 'Sucesso');
        
        // Registrar no histórico
        const usuario = this.authService.currentUserValue;
        if (usuario && usuario.id) {
          const statusAnterior = this.statusList.find(s => s.id === statusAnteriorId);
          this.chamadoAtualizacaoService.registrarComentario({
            chamadoId: this.chamadoId,
            usuarioId: usuario.id,
            comentario: `Status alterado de "${statusAnterior?.nome}" para "${novoStatus?.nome}"`
          }).subscribe({
            next: () => {
              // Recarregar histórico
              this.loadAtualizacoes();
            }
          });
        }
        
        // Recarregar chamado
        this.loadChamadoDetails();
        this.loadingStatus = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar status:', err);
        this.toastr.error('Erro ao atualizar status', 'Erro');
        this.statusSelecionado = statusAnteriorId; // Reverter
        this.loadingStatus = false;
      }
    });
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
