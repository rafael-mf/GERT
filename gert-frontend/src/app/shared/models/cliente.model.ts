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
}
