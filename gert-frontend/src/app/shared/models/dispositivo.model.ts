// File: gert-frontend/src/app/shared/models/dispositivo.model.ts
export interface Dispositivo {
  id?: number;
  clienteId: number;
  categoriaId: number;
  marca: string;
  modelo: string;
  numeroSerie?: string;
  especificacoes?: string;
  dataCadastro?: Date;
  // categoria?: any; // Already in backend model, consider for frontend if needed
}
