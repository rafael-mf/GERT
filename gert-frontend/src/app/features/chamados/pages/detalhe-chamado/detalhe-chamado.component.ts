// File: gert-frontend/src/app/features/chamados/pages/detalhe-chamado/detalhe-chamado.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChamadoService } from '../../../../core/services/chamado.service';
import { Chamado } from '../../../../shared/models/chamado.model';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// Import other necessary modules like FormsModule if you add forms here for updates/services

@Component({
  selector: 'app-detalhe-chamado',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, NgbModalModule], // Add FormsModule if needed
  templateUrl: './detalhe-chamado.component.html',
  styleUrls: ['./detalhe-chamado.component.scss']
})
export class DetalheChamadoComponent implements OnInit {
  chamado: Chamado | null = null;
  loading = true;
  error = '';
  chamadoId!: number;

  // For adding services (example)
  // selectedServicoId: number | null = null;
  // servicoValor: number | null = null;
  // servicoObservacoes: string = '';
  // availableServicos: Servico[] = [];


  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chamadoService = inject(ChamadoService);
  private toastr = inject(ToastrService);
  // private modalService = inject(NgbModal);


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.chamadoId = +idParam;
      this.loadChamadoDetails();
      // this.loadAvailableServicos();
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
      },
      error: (err) => {
        this.error = 'Erro ao carregar detalhes do chamado.';
        this.toastr.error(this.error);
        console.error(err);
        this.loading = false;
        if (err.status === 404) {
            this.router.navigate(['/chamados']); // Or a 404 page
        }
      }
    });
  }

  // loadAvailableServicos(): void {
  //   this.chamadoService.getServicos().subscribe(data => this.availableServicos = data);
  // }

  // openAddServicoModal(content: any) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  // }

  // addServico(): void {
  //   if (!this.chamado || !this.selectedServicoId) {
  //     this.toastr.warning('Selecione um serviço.');
  //     return;
  //   }
  //   const servicoData = {
  //     servicoId: this.selectedServicoId,
  //     valor: this.servicoValor ?? undefined, // Envia undefined se null para usar valorBase
  //     observacoes: this.servicoObservacoes
  //   };
  //   this.chamadoService.addServicoAoChamado(this.chamado.id!, servicoData).subscribe({
  //     next: () => {
  //       this.toastr.success('Serviço adicionado com sucesso!');
  //       this.loadChamadoDetails(); // Recarrega os detalhes
  //       this.modalService.dismissAll();
  //       // Reset form
  //       this.selectedServicoId = null;
  //       this.servicoValor = null;
  //       this.servicoObservacoes = '';
  //     },
  //     error: (err) => {
  //       this.toastr.error('Erro ao adicionar serviço.');
  //       console.error(err);
  //     }
  //   });
  // }

  // removeServico(chamadoServicoId?: number): void {
  //   if (chamadoServicoId && this.chamado && confirm('Tem certeza que deseja remover este serviço do chamado?')) {
  //     this.chamadoService.removeServicoDoChamado(this.chamado.id!, chamadoServicoId).subscribe({
  //       next: () => {
  //         this.toastr.success('Serviço removido com sucesso!');
  //         this.loadChamadoDetails();
  //       },
  //       error: (err) => this.toastr.error('Erro ao remover serviço.')
  //     });
  //   }
  // }

  editChamado(): void {
    if (this.chamado?.id) {
      this.router.navigate(['/chamados', this.chamado.id, 'editar']);
    }
  }
}
