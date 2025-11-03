import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChamadoService } from '../../../core/services/chamado.service';
import { Tecnico } from '../../../shared/models/tecnico.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-atribuir-tecnico-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atribuir-tecnico-modal.component.html',
  styleUrls: ['./atribuir-tecnico-modal.component.scss']
})
export class AtribuirTecnicoModalComponent {
  @Input() chamadoId!: number;
  @Input() chamadoNumero?: string;
  @Input() tecnicoAtualId?: number;
  @Input() tecnicosList: Tecnico[] = [];
  
  tecnicoSelecionadoId: number | null = null;
  loading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private chamadoService: ChamadoService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Se já tem técnico atribuído, selecionar
    if (this.tecnicoAtualId) {
      this.tecnicoSelecionadoId = this.tecnicoAtualId;
    }
  }

  atribuirTecnico() {
    if (!this.tecnicoSelecionadoId) {
      this.toastr.error('Selecione um técnico', 'Erro de Validação');
      return;
    }

    this.loading = true;

    this.chamadoService.updateChamado(this.chamadoId, {
      tecnicoId: this.tecnicoSelecionadoId
    } as any).subscribe({
      next: (response) => {
        const tecnico = this.tecnicosList.find(t => t.id === this.tecnicoSelecionadoId);
        this.toastr.success(
          `Técnico ${tecnico?.usuario?.nome} atribuído ao chamado ${this.chamadoNumero || '#' + this.chamadoId}`,
          'Sucesso'
        );
        this.loading = false;
        this.activeModal.close(true);
      },
      error: (error) => {
        console.error('Erro ao atribuir técnico:', error);
        const mensagemErro = error?.error?.message || 'Erro ao atribuir técnico. Tente novamente.';
        this.toastr.error(mensagemErro, 'Erro');
        this.loading = false;
      }
    });
  }

  removerAtribuicao() {
    if (!this.tecnicoAtualId) {
      this.toastr.warning('Chamado não possui técnico atribuído');
      return;
    }

    this.loading = true;

    this.chamadoService.updateChamado(this.chamadoId, {
      tecnicoId: null
    } as any).subscribe({
      next: (response) => {
        this.toastr.success(
          `Atribuição removida do chamado ${this.chamadoNumero || '#' + this.chamadoId}`,
          'Sucesso'
        );
        this.loading = false;
        this.activeModal.close(true);
      },
      error: (error) => {
        console.error('Erro ao remover atribuição:', error);
        const mensagemErro = error?.error?.message || 'Erro ao remover atribuição. Tente novamente.';
        this.toastr.error(mensagemErro, 'Erro');
        this.loading = false;
      }
    });
  }

  fechar() {
    if (this.loading) return;
    this.activeModal.dismiss();
  }

  getTecnicoAtual(): string {
    if (!this.tecnicoAtualId) return '';
    const tecnico = this.tecnicosList.find(t => t.id === this.tecnicoAtualId);
    return tecnico?.usuario?.nome || 'Desconhecido';
  }
}
