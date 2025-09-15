// File: gert-frontend/src/app/shared/models/chamado.model.ts
import { Cliente } from './cliente.model';
import { Dispositivo } from './dispositivo.model';
import { Prioridade } from './prioridade.model';
import { StatusChamado } from './status-chamado.model';
import { Tecnico } from './tecnico.model';
import { ChamadoServico } from './chamado-servico.model';
import { ChamadoPeca } from './chamado-peca.model'; // Substituído por ChamadoPeca


export interface Chamado {
  id?: number;
  clienteId: number;
  dispositivoId: number;
  tecnicoId?: number | null; // Allow null for unassigned
  prioridadeId: number;
  statusId: number;
  titulo: string;
  descricao: string;
  diagnostico?: string;
  solucao?: string;
  valorTotal?: number;
  dataAbertura?: Date | string;
  dataPrevista?: Date | string | null;
  dataFechamento?: Date | string | null;

  // Propriedades expandidas (para exibição)
  cliente?: Cliente;
  dispositivo?: Dispositivo;
  tecnico?: Tecnico;
  prioridade?: Prioridade;
  status?: StatusChamado;
  servicos?: ChamadoServico[]; // Changed from any[]
  pecas?: ChamadoPeca[]; // Peças utilizadas no chamado (usando modelo correto)
  // pecas?: any[]; // Estoque is ignored for now
}
