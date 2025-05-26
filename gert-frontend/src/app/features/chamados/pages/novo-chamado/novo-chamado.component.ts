// File: gert-frontend/src/app/features/chamados/pages/novo-chamado/novo-chamado.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-novo-chamado',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DatePipe],
  templateUrl: './novo-chamado.component.html',
  styleUrls: ['./novo-chamado.component.scss']
})
export class NovoChamadoComponent implements OnInit {
  chamadoForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  clientes: Cliente[] = [];
  dispositivos: Dispositivo[] = [];
  prioridades: Prioridade[] = [];
  statusList: StatusChamado[] = []; // Para status inicial, se necessário
  tecnicos: Tecnico[] = [];


  constructor(
    private fb: FormBuilder,
    private chamadoService: ChamadoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.chamadoForm = this.fb.group({
      clienteId: ['', Validators.required],
      dispositivoId: ['', Validators.required],
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      prioridadeId: ['', Validators.required],
      tecnicoId: [null], // Opcional na criação
      // statusId será definido pelo backend ou um valor padrão
      dataPrevista: [null]
    });

    this.loadClientes();
    this.loadPrioridades();
    // this.loadStatus(); // Carregar se o usuário puder definir o status inicial
    this.loadTecnicos();

    this.chamadoForm.get('clienteId')?.valueChanges.subscribe(clienteId => {
      this.dispositivos = [];
      this.chamadoForm.get('dispositivoId')?.setValue('');
      if (clienteId) {
        this.loadDispositivosPorCliente(clienteId);
      }
    });
  }

  loadClientes() {
    this.chamadoService.getClientes().subscribe(data => this.clientes = data);
  }

  loadDispositivosPorCliente(clienteId: number) {
    this.chamadoService.getDispositivosPorCliente(clienteId).subscribe(data => this.dispositivos = data);
  }

  loadPrioridades() {
    this.chamadoService.getPrioridades().subscribe(data => this.prioridades = data);
  }

  // loadStatus() {
  //   this.chamadoService.getStatusChamados().subscribe(data => this.statusList = data);
  // }

  loadTecnicos() {
    this.chamadoService.getTecnicos().subscribe(data => this.tecnicos = data);
  }

  get f() { return this.chamadoForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.chamadoForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios.', 'Formulário Inválido');
      return;
    }

    this.loading = true;
    const novoChamado: Chamado = this.chamadoForm.value;

    this.chamadoService.createChamado(novoChamado).subscribe({
      next: (chamadoCriado) => {
        this.toastr.success(`Chamado #${chamadoCriado.id} criado com sucesso!`);
        this.router.navigate(['/chamados', chamadoCriado.id]);
      },
      error: (err) => {
        this.error = 'Erro ao criar chamado. Verifique os dados e tente novamente.';
        this.toastr.error(this.error);
        console.error(err);
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
