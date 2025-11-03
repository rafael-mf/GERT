import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChamadoService } from '../../../core/services/chamado.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finalizar-chamado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finalizar-chamado-modal.component.html',
  styleUrls: ['./finalizar-chamado-modal.component.scss']
})
export class FinalizarChamadoModalComponent {
  @Input() chamadoId!: number;
  @Input() chamadoNumero?: string;
  
  diagnostico: string = '';
  solucao: string = '';
  loading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private chamadoService: ChamadoService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  finalizarChamado() {
    // Validação
    if (!this.diagnostico || this.diagnostico.trim() === '') {
      this.toastr.error('O diagnóstico é obrigatório', 'Erro de Validação');
      return;
    }

    if (!this.solucao || this.solucao.trim() === '') {
      this.toastr.error('A solução é obrigatória', 'Erro de Validação');
      return;
    }

    this.loading = true;

    const dadosFechamento = {
      diagnostico: this.diagnostico.trim(),
      solucao: this.solucao.trim()
    };

    this.chamadoService.fecharChamado(this.chamadoId, dadosFechamento).subscribe({
      next: (response) => {
        this.toastr.success(
          `Chamado ${this.chamadoNumero || '#' + this.chamadoId} finalizado com sucesso!`,
          'Sucesso'
        );
        this.loading = false;
        this.activeModal.close(true); // Retorna true para indicar sucesso
      },
      error: (error) => {
        console.error('Erro ao finalizar chamado:', error);
        const mensagemErro = error?.error?.message || 'Erro ao finalizar chamado. Tente novamente.';
        this.toastr.error(mensagemErro, 'Erro');
        this.loading = false;
      }
    });
  }

  fechar() {
    if (this.loading) return;
    this.activeModal.dismiss();
  }
}
