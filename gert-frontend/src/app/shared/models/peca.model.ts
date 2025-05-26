export interface Peca {
  id?: number;
  categoriaId: number;
  codigo: string;
  nome: string;
  descricao?: string;
  marca?: string;
  modelo?: string;
  compatibilidade?: string;
  precoCusto?: number;
  precoVenda?: number;
  estoqueMinimo: number;
  estoqueAtual: number;
  localizacao?: string;
  ativo: boolean;
  dataCadastro?: Date;
  ultimoInventario?: Date;
  
  // Propriedade expandida
  categoria?: any;
}
