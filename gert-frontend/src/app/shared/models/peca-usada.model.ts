// gert-frontend/src/app/shared/models/peca-usada.model.ts
export interface PecaUsada {
  id?: number;
  chamadoId: number;
  nome: string;
  descricao?: string;
  numeroSerie?: string;
  garantia?: string;
  valor: number;
  dataUtilizacao?: Date | string;
}