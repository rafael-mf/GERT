export interface Chamado {
  id?: number;
  clienteId: number;
  dispositivoId: number;
  tecnicoId?: number;
  prioridadeId: number;
  statusId: number;
  titulo: string;
  descricao: string;
  diagnostico?: string;
  solucao?: string;
  valorTotal?: number;
  dataAbertura?: Date;
  dataPrevista?: Date;
  dataFechamento?: Date;
  
  // Propriedades expandidas (para exibição)
  cliente?: any;
  dispositivo?: any;
  tecnico?: any;
  prioridade?: any;
  status?: any;
  servicos?: any[];
  pecas?: any[];
}
