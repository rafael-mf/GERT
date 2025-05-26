// File: gert-frontend/src/app/shared/models/servico.model.ts
export interface Servico {
  id: number;
  nome: string;
  descricao?: string;
  valorBase: number;
  tempoEstimado?: number;
  ativo: boolean;
}
