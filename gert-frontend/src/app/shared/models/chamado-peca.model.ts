// gert-frontend/src/app/shared/models/chamado-peca.model.ts
import { Peca } from './peca.model';

export interface ChamadoPeca {
  id?: number;
  chamadoId: number;
  pecaId: number;
  quantidade: number;
  valorUnitario: number;
  dataUtilizacao?: Date | string;
  peca?: Peca; // Para incluir informações da peça relacionada
}