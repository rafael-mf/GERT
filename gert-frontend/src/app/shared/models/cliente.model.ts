import { Dispositivo } from "./dispositivo.model";
import { Chamado } from "./chamado.model";

export interface Cliente {
  id?: number;
  nome: string;
  cpfCnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  dataCadastro?: Date;
  dispositivos?: Dispositivo[];
  chamados?: Chamado[];
}
