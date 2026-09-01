import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FiltroChamados } from '../../components/filtro-chamados/filtro-chamados';
import { ListaChamados } from '../../components/lista-chamados/lista-chamados';
import { Chamado, StatusChamado } from '../../models/chamado';
import { ChamadosService } from '../../services/chamados.service';

@Component({
  selector: 'app-chamados-page',
  standalone: true,
  imports: [FiltroChamados, ListaChamados, FormsModule],
  templateUrl: './chamados-page.html',
  styleUrl: './chamados-page.css',
})
export class ChamadosPage implements OnInit {
  private readonly chamadosService = inject(ChamadosService);

  readonly chamados = signal<Chamado[]>([]);

  readonly pesquisa = signal('');

  readonly filtroStatus = signal<StatusChamado | 'todos'>('todos');

  readonly carregando = signal(false);

  readonly erro = signal<string | null>(null);

  readonly exibirFormulario = signal(false);

  novoChamado: Partial<Chamado> = {
    titulo: '',
    descricao: '',
    prioridade: 'media',
    status: 'aberto',
    responsavel: '',
  };

  readonly chamadosFiltrados = computed(() => {
    const termo = this.pesquisa().trim().toLowerCase();

    const status = this.filtroStatus();

    return this.chamados().filter((chamado) => {
      const correspondeTexto =
        termo === '' ||
        chamado.titulo.toLowerCase().includes(termo) ||
        chamado.descricao.toLowerCase().includes(termo);

      const correspondeStatus = status === 'todos' || chamado.status === status;

      return correspondeTexto && correspondeStatus;
    });
  });

  ngOnInit(): void {
    void this.carregarChamados();
  }

  async carregarChamados(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados = await this.chamadosService.listar();

      this.chamados.set(dados);
    } catch {
      this.erro.set('Não foi possível carregar os chamados.');
    } finally {
      this.carregando.set(false);
    }
  }

  atualizarPesquisa(valor: string): void {
    this.pesquisa.set(valor);
  }

  atualizarStatus(valor: StatusChamado | 'todos'): void {
    this.filtroStatus.set(valor);
  }

  alternarFormulario(): void {
    this.exibirFormulario.update((exibir) => !exibir);
  }

  async salvarChamado(): Promise<void> {
    if (!this.novoChamado.titulo || !this.novoChamado.descricao) {
      return;
    }

    this.erro.set(null);

    try {
      await this.chamadosService.adicionar({
        id: Date.now(),
        titulo: this.novoChamado.titulo,
        descricao: this.novoChamado.descricao,
        prioridade: this.novoChamado.prioridade || 'media',
        status: this.novoChamado.status || 'aberto',
        responsavel: this.novoChamado.responsavel || '',
        criadoEm: new Date().toISOString().split('T')[0],
      });

      this.novoChamado = {
        titulo: '',
        descricao: '',
        prioridade: 'media',
        status: 'aberto',
        responsavel: '',
      };
      this.exibirFormulario.set(false);
      await this.carregarChamados();
    } catch {
      this.erro.set('Não foi possível salvar o chamado.');
    }
  }
}
