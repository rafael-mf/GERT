// File: gert-frontend/src/app/shared/models/chamado-servico.model.ts
import { Servico } from "./servico.model";

export interface ChamadoServico {
  id?: number;
  chamadoId: number;
  servicoId: number;
  valor: number;
  observacoes?: string;
  servico?: Servico; // For displaying service name
}
