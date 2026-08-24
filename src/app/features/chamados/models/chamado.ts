export type Prioridade = 'baixa' | 'media' | 'alta';
export type StatusChamado = 'aberto' | 'em_andamento' | 'concluido';
export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: string;
  status: string;
  responsavel: string; // ou responsavel: string
  criadoEm?: string;
}
