// File: gert-frontend/src/app/shared/models/tecnico.model.ts
import { Usuario } from './usuario.model';

export interface Tecnico {
  id: number;
  usuarioId: number;
  especialidade?: string;
  disponivel?: boolean;
  usuario?: Partial<Usuario>; // To hold user's name
}
