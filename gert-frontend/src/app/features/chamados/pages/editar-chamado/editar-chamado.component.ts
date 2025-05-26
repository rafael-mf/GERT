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

@Component({
  selector: 'app-editar-chamado',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DatePipe],
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

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private chamadoService = inject(ChamadoService);
  private toastr = inject(ToastrService);

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
}
