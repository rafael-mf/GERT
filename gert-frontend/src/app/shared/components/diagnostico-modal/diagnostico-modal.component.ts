// gert-frontend/src/app/shared/components/diagnostico-modal/diagnostico-modal.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChamadoService } from '../../../core/services/chamado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-diagnostico-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diagnostico-modal.component.html',
  styleUrl: './diagnostico-modal.component.scss'
})
export class DiagnosticoModalComponent {
  @Input() chamadoId!: number;
  @Input() chamadoNumero!: string;
  @Input() diagnosticoAtual: string = '';

  diagnostico: string = '';
  loading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private chamadoService: ChamadoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.diagnostico = this.diagnosticoAtual || '';
  }

  salvarDiagnostico(): void {
    if (!this.diagnostico || this.diagnostico.trim() === '') {
      this.toastr.warning('Por favor, preencha o diagnóstico');
      return;
    }

    this.loading = true;

    this.chamadoService.updateChamado(this.chamadoId, {
      diagnostico: this.diagnostico
    } as any).subscribe({
      next: () => {
        this.toastr.success('Diagnóstico atualizado com sucesso!');
        this.loading = false;
        this.activeModal.close(true); // Retorna true para indicar sucesso
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar diagnóstico');
        console.error('Erro ao atualizar diagnóstico:', err);
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.activeModal.dismiss();
  }
}
