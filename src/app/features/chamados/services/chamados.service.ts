import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Chamado } from '../models/chamado';

@Injectable({
  providedIn: 'root',
})
export class ChamadosService {
  private readonly http = inject(HttpClient);
  private readonly producaoApiUrl = 'https://m7-a7-chamados-api-ji22.onrender.com/api/chamados';
  private readonly localApiUrl = 'http://localhost:3000/api/chamados';
  private readonly localStorageKey = 'chamados-local';
  private readonly dadosIniciais: Chamado[] = [
    {
      id: 1,
      titulo: 'Erro ao acessar sistema',
      descricao: 'O usuário não consegue realizar login no sistema.',
      prioridade: 'alta',
      status: 'aberto',
      responsavel: 'Andre',
      criadoEm: '2026-08-20',
    },
    {
      id: 2,
      titulo: 'Falha de envio de formulário',
      descricao: 'O formulário de cadastro não envia os dados corretamente.',
      prioridade: 'media',
      status: 'em_andamento',
      responsavel: 'Maria',
      criadoEm: '2026-08-21',
    },
    {
      id: 3,
      titulo: 'Solicitação de suporte',
      descricao: 'Preciso de ajuda para ajustar a configuração do ambiente.',
      prioridade: 'baixa',
      status: 'concluido',
      responsavel: 'João',
      criadoEm: '2026-08-22',
    },
  ];

  resolveApiUrl(hostname?: string): string {
    const currentHost =
      hostname ?? (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
    const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(currentHost);
    return isLocalHost ? this.localApiUrl : this.producaoApiUrl;
  }

  private lerChamadosLocais(): Chamado[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const dados = localStorage.getItem(this.localStorageKey);
      if (!dados) {
        this.salvarChamadosLocais(this.dadosIniciais);
        return this.dadosIniciais;
      }

      return JSON.parse(dados) as Chamado[];
    } catch {
      this.salvarChamadosLocais(this.dadosIniciais);
      return this.dadosIniciais;
    }
  }

  private salvarChamadosLocais(chamados: Chamado[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.localStorageKey, JSON.stringify(chamados));
  }

  async listar(): Promise<Chamado[]> {
    try {
      const dados = await firstValueFrom(this.http.get<Chamado[]>(this.resolveApiUrl()));
      if (dados && dados.length > 0) {
        this.salvarChamadosLocais(dados);
        return dados;
      }

      return this.lerChamadosLocais();
    } catch {
      return this.lerChamadosLocais();
    }
  }

  async adicionar(chamado: Chamado): Promise<Chamado> {
    try {
      return await firstValueFrom(this.http.post<Chamado>(this.resolveApiUrl(), chamado));
    } catch {
      const locais = this.lerChamadosLocais();
      const jaExiste = locais.some((item) => item.id === chamado.id);
      const proximoEstado = jaExiste
        ? locais.map((item) => (item.id === chamado.id ? chamado : item))
        : [...locais, chamado];

      this.salvarChamadosLocais(proximoEstado);
      return chamado;
    }
  }

  async buscarPorId(id: number): Promise<Chamado | undefined> {
    try {
      return await firstValueFrom(this.http.get<Chamado>(`${this.resolveApiUrl()}/${id}`));
    } catch (erro) {
      if (erro instanceof HttpErrorResponse && erro.status === 404) {
        return undefined;
      }

      return this.lerChamadosLocais().find((chamado) => chamado.id === id);
    }
  }
}
