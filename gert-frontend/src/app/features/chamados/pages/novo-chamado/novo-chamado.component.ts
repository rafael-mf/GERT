import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ChamadoService } from '../../../../core/services/chamado.service';
import { ClienteService } from '../../../../core/services/cliente.service';

import { Cliente } from '../../../../shared/models/cliente.model';
import { Dispositivo } from '../../../../shared/models/dispositivo.model';
import { Tecnico } from '../../../../shared/models/tecnico.model';
import { Prioridade } from '../../../../shared/models/prioridade.model';
import { CategoriaDispositivo } from '../../../../shared/models/categoria-dispositivo.model';

@Component({
  selector: 'app-novo-chamado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './novo-chamado.component.html',
  styleUrls: ['./novo-chamado.component.scss']
})
export class NovoChamadoComponent implements OnInit {
  chamadoForm: FormGroup;
  newDeviceForm: FormGroup;

  // Arrays para os dropdowns
  clientes: Cliente[] = [];
  dispositivos: Dispositivo[] = [];
  tecnicos: Tecnico[] = [];
  prioridades: Prioridade[] = [];
  categoriasDispositivo: CategoriaDispositivo[] = [];

  // Controle de estado
  loading = false;
  submitted = false;
  showNewDeviceForm = false;

  constructor(
    private fb: FormBuilder,
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Formulário principal do chamado
    this.chamadoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      clienteId: ['', Validators.required],
      dispositivoId: ['', Validators.required],
      prioridadeId: ['', Validators.required],
      tecnicoId: ['']
    });

    // Formulário para cadastrar um novo dispositivo
    this.newDeviceForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      numeroSerie: [''],
      categoriaId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    // Quando o clienteId muda no formulário principal, busca os dispositivos dele
    this.chamadoForm.get('clienteId')?.valueChanges.subscribe(clienteId => {
      this.dispositivos = []; // Limpa a lista de dispositivos anterior
      this.chamadoForm.get('dispositivoId')?.reset(''); // Reseta a seleção
      if (clienteId) {
        this.loadDispositivosDoCliente(clienteId);
      }
    });
  }

  // Carrega todos os dados necessários para os dropdowns da página
  loadInitialData(): void {
    this.chamadoService.getClientes().subscribe(data => this.clientes = data);
    this.chamadoService.getTecnicos().subscribe(data => this.tecnicos = data);
    this.chamadoService.getPrioridades().subscribe(data => this.prioridades = data);
    this.chamadoService.getCategoriasDispositivo().subscribe(data => this.categoriasDispositivo = data);
  }

  // Carrega os dispositivos para um cliente específico
  loadDispositivosDoCliente(clienteId: number): void {
    this.chamadoService.getDispositivosPorCliente(clienteId).subscribe(data => {
      this.dispositivos = data;
    });
  }

  // Salva o chamado principal
  onSubmit(): void {
    this.submitted = true;
    if (this.chamadoForm.invalid) {
      // Adiciona um log para ajudar a depurar qual campo está inválido
      Object.keys(this.chamadoForm.controls).forEach(key => {
        const controlErrors = this.chamadoForm.get(key)?.errors;
        if (controlErrors != null) {
          console.error('Campo com erro:', key, ', Erros:', controlErrors);
        }
      });
      this.toastr.error('Por favor, preencha todos os campos obrigatórios marcados com *.');
      return;
    }

    this.loading = true;
    
    // Preparar dados do formulário, convertendo strings vazias em null
    const dadosChamado = { ...this.chamadoForm.value };
    
    // Se tecnicoId for string vazia, converter para null
    if (dadosChamado.tecnicoId === '' || dadosChamado.tecnicoId === null) {
      delete dadosChamado.tecnicoId; // Remove o campo se não for atribuído
    } else {
      dadosChamado.tecnicoId = Number(dadosChamado.tecnicoId);
    }
    
    // Garantir que os outros IDs sejam números
    dadosChamado.clienteId = Number(dadosChamado.clienteId);
    dadosChamado.dispositivoId = Number(dadosChamado.dispositivoId);
    dadosChamado.prioridadeId = Number(dadosChamado.prioridadeId);
    
    console.log('Dados do formulário:', dadosChamado);
    
    this.chamadoService.createChamado(dadosChamado).subscribe({
      next: () => {
        this.toastr.success('Chamado criado com sucesso!');
        this.router.navigate(['/chamados']);
      },
      error: (err) => {
        // Mostra mensagem de erro específica do backend se disponível
        const errorMessage = err?.error?.message || 'Falha ao criar o chamado. Tente novamente.';
        this.toastr.error(errorMessage);
        console.error('Erro ao criar chamado:', err);
        this.loading = false;
      }
    });
  }

  // **FUNÇÃO CORRIGIDA**
  // Salva o novo dispositivo
  onSaveNewDevice(): void {
    if (this.newDeviceForm.invalid || !this.chamadoForm.get('clienteId')?.value) {
      this.toastr.error('Preencha todos os campos do novo dispositivo e selecione um cliente.');
      return;
    }

    const clienteId = this.chamadoForm.get('clienteId')?.value;
    this.clienteService.createDispositivo(clienteId, this.newDeviceForm.value).subscribe({
      next: (novoDispositivo) => {
        this.toastr.success('Dispositivo cadastrado com sucesso!');
        this.showNewDeviceForm = false;
        this.newDeviceForm.reset();

        // --- LÓGICA CORRIGIDA ---
        // 1. Adiciona o novo dispositivo à lista local imediatamente.
        // O .slice() força a detecção de mudanças do Angular.
        this.dispositivos = [...this.dispositivos, novoDispositivo];

        // 2. Define o valor do dispositivo recém-criado no formulário principal.
        this.chamadoForm.get('dispositivoId')?.setValue(novoDispositivo.id);
      },
      error: (err) => {
        this.toastr.error('Falha ao cadastrar dispositivo.');
        console.error(err);
      }
    });
  }
}
