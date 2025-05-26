export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  cargo: string;
  ativo: boolean;
  dataCriacao?: Date;
  ultimoAcesso?: Date;
  token?: string; // Adicionado o token necessário para o interceptor
}
