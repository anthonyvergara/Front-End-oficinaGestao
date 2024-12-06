import { Telefone } from './telefone.model';  // Importando a interface Telefone
import { Endereco } from './endereco.model';  // Importando a interface Endereco

export interface Cliente {
  id?: number;
  nome?: string;
  sobrenome?: string;
  dataNascimento?: string | null;
  email?: string;
  numeroDrive?: number;
  numeroPassaporte?: number | null;
  numeroRg?: number;
  telefone?: Telefone[];
  endereco?: Endereco[];
}