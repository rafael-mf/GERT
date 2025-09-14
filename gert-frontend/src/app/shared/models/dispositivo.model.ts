import { CategoriaDispositivo } from "./categoria-dispositivo.model";

export interface Dispositivo {
  id?: number;
  clienteId: number;
  categoriaId: number;
  marca: string;
  modelo: string;
  numeroSerie?: string;
  especificacoes?: string;
  dataCadastro?: Date;
  categoria?: CategoriaDispositivo;
}
