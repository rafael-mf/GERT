// gert-frontend/src/app/shared/models/chamado-peca.model.ts
import { Peca } from './peca.model';

export interface ChamadoPeca {
  id?: number;
  chamadoId: number;
  pecaId?: number | null; // Agora opcional para peças específicas do chamado
  quantidade: number;
  valorUnitario: number;
  dataUtilizacao?: Date | string;
  peca?: Peca; // Para incluir informações da peça relacionada

  // Campos para peças específicas do chamado
  nome?: string;
  descricao?: string;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
}