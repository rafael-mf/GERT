// File: gert-frontend/src/app/features/chamados/pages/editar-chamado/editar-chamado.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChamadoService } from '../../../../core/services/chamado.service';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from '../../../../shared/models/chamado.model';
import { Cliente } from '../../../../shared/models/cliente.model';
import { Dispositivo } from '../../../../shared/models/dispositivo.model';
import { Prioridade } from '../../../../shared/models/prioridade.model';
import { StatusChamado } from '../../../../shared/models/status-chamado.model';
import { Tecnico } from '../../../../shared/models/tecnico.model';
import { ChamadoAtualizacaoService } from '../../../../core/services/chamado-atualizacao.service';
import { Servico } from '../../../../shared/models/servico.model';
import { ModalService } from '../../../../shared/services/modal.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-chamado',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DatePipe, FormsModule],
  templateUrl: './editar-chamado.component.html',
  styleUrls: ['./editar-chamado.component.scss']
})
export class EditarChamadoComponent implements OnInit {
  chamadoForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  chamadoId!: number;
  currentChamado: Chamado | null = null;

  clientes: Cliente[] = [];
  dispositivos: Dispositivo[] = [];
  prioridades: Prioridade[] = [];
  statusList: StatusChamado[] = [];
  tecnicos: Tecnico[] = [];

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
  nomePeca = '';
  valorPeca: number | null = null;
  descricaoPeca = '';
  numeroSeriePeca = '';
  garantiaPeca = '';
  addingPeca = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private chamadoService = inject(ChamadoService);
  private toastr = inject(ToastrService);
  private chamadoAtualizacaoService = inject(ChamadoAtualizacaoService);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.toastr.error('ID do chamado não fornecido.');
      this.router.navigate(['/chamados']);
      return;
    }
    this.chamadoId = +idParam;

    this.chamadoForm = this.fb.group({
      clienteId: [{ value: '', disabled: true }, Validators.required], // Non-editable
      dispositivoId: [{ value: '', disabled: true }, Validators.required], // Non-editable
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      prioridadeId: ['', Validators.required],
      statusId: ['', Validators.required],
      tecnicoId: [null],
      diagnostico: [''],
      solucao: [''],
      valorTotal: [{value: 0, disabled: true}], // Typically calculated
      dataPrevista: [null],
      dataFechamento: [null]
    });

    this.loadAuxData();
    this.loadChamado();

    this.chamadoForm.get('clienteId')?.valueChanges.subscribe(clienteId => {
      if (this.chamadoForm.get('clienteId')?.enabled && clienteId) { // only if editable and has value
        this.dispositivos = [];
        this.chamadoForm.get('dispositivoId')?.setValue('');
        this.loadDispositivosPorCliente(clienteId);
      }
    });
  }

  loadAuxData() {
    this.chamadoService.getClientes().subscribe(data => this.clientes = data);
    this.chamadoService.getPrioridades().subscribe(data => this.prioridades = data);
    this.chamadoService.getStatusChamados().subscribe(data => this.statusList = data);
    this.chamadoService.getTecnicos().subscribe(data => this.tecnicos = data);
  }

  loadChamado() {
    this.loading = true;
    this.chamadoService.getChamadoById(this.chamadoId).subscribe({
      next: (data) => {
        this.currentChamado = data;
        // Format dates for input[type=date]
        const formattedData = {
          ...data,
          dataPrevista: data.dataPrevista ? new Date(data.dataPrevista).toISOString().split('T')[0] : null,
          dataFechamento: data.dataFechamento ? new Date(data.dataFechamento).toISOString().split('T')[0] : null,
          tecnicoId: data.tecnicoId || null
        };
        this.chamadoForm.patchValue(formattedData);
        if (data.clienteId) { // Load devices for the current client
            this.loadDispositivosPorCliente(data.clienteId, true);
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar chamado.');
        this.router.navigate(['/chamados']);
        this.loading = false;
      }
    });
  }

  loadDispositivosPorCliente(clienteId: number, editing = false) {
    this.chamadoService.getDispositivosPorCliente(clienteId).subscribe(data => {
      this.dispositivos = data;
       // If editing, ensure the current device is selected
      if (editing && this.currentChamado && this.currentChamado.dispositivoId) {
        this.chamadoForm.get('dispositivoId')?.setValue(this.currentChamado.dispositivoId);
      }
    });
  }

  get f() { return this.chamadoForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.chamadoForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios.', 'Formulário Inválido');
      return;
    }

    this.loading = true;
    // Get raw value to include disabled fields if necessary, but here we only want enabled ones for update
    const dadosAtualizados: Partial<Chamado> = { ...this.chamadoForm.value };
    // Remove fields that should not be updated directly or are disabled
    delete dadosAtualizados.clienteId;
    delete dadosAtualizados.dispositivoId;
    delete dadosAtualizados.valorTotal;


    this.chamadoService.updateChamado(this.chamadoId, dadosAtualizados as Chamado).subscribe({
      next: () => {
        this.toastr.success('Chamado atualizado com sucesso!');
        this.router.navigate(['/chamados', this.chamadoId]);
      },
      error: (err) => {
        this.error = 'Erro ao atualizar chamado.';
        this.toastr.error(this.error);
        console.error(err);
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }

  fecharChamado(): void {
    if (!this.chamadoForm.value.diagnostico || this.chamadoForm.value.diagnostico.trim() === '') {
      this.toastr.error('Diagnóstico é obrigatório para fechar o chamado.');
      return;
    }

    if (!this.chamadoForm.value.solucao || this.chamadoForm.value.solucao.trim() === '') {
      this.toastr.error('Solução é obrigatória para fechar o chamado.');
      return;
    }

    this.modalService.confirmCloseChamado().then(confirmed => {
      if (confirmed) {
        this.loading = true;
        const dadosFechamento = {
          diagnostico: this.chamadoForm.value.diagnostico,
          solucao: this.chamadoForm.value.solucao,
          valorTotal: this.chamadoForm.value.valorTotal
        };

        this.chamadoService.fecharChamado(this.chamadoId, dadosFechamento).subscribe({
          next: () => {
            this.toastr.success('Chamado fechado com sucesso!');
            this.router.navigate(['/chamados', this.chamadoId]);
          },
          error: (err: any) => {
            this.error = 'Erro ao fechar chamado.';
            this.toastr.error(err.error?.message || this.error);
            console.error(err);
            this.loading = false;
          },
          complete: () => this.loading = false
        });
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
        this.loadChamado(); // Recarregar detalhes para atualizar a lista
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
            this.loadChamado(); // Recarregar detalhes para atualizar a lista
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
    this.nomePeca = '';
    this.valorPeca = null;
    this.descricaoPeca = '';
    this.numeroSeriePeca = '';
    this.garantiaPeca = '';
  }

  addPeca(): void {
    if (!this.nomePeca || !this.valorPeca) {
      this.toastr.warning('Preencha pelo menos nome e valor da peça');
      return;
    }

    this.addingPeca = true;
    const pecaData = {
      nome: this.nomePeca,
      valor: this.valorPeca,
      descricao: this.descricaoPeca || undefined,
      numeroSerie: this.numeroSeriePeca || undefined,
      garantia: this.garantiaPeca || undefined
    };

    this.chamadoService.addPecaUsada(this.chamadoId, pecaData).subscribe({
      next: () => {
        this.toastr.success('Peça adicionada com sucesso!');
        this.closePecasModal();
        this.loadChamado(); // Recarregar detalhes para atualizar a lista
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
            this.loadChamado(); // Recarregar detalhes para atualizar a lista
          },
          error: (err: any) => {
            console.error('Erro ao remover peça:', err);
            this.toastr.error('Erro ao remover peça');
          }
        });
      }
    });
  }

  // === MÉTODO PARA VERIFICAR SE PODE FECHAR CHAMADO ===
  podeFecharChamado(): boolean {
    if (!this.currentChamado) return false;

    // Verificar se o chamado tem status que permite fechamento
    const statusFechado = this.statusList.find(s => s.nome.toLowerCase().includes('fechado') || s.nome.toLowerCase().includes('concluído'));
    if (!statusFechado) return false;

    // Não permitir fechar se já estiver fechado
    if (this.currentChamado.statusId === statusFechado.id) return false;

    // Verificar se tem diagnóstico e solução preenchidos
    if (!this.chamadoForm.get('diagnostico')?.value?.trim() || !this.chamadoForm.get('solucao')?.value?.trim()) {
      return false;
    }

    return true;
  }
}
