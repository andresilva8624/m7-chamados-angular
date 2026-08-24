import { Component, input, output } from '@angular/core';
import { StatusChamado } from '../../models/chamado';

@Component({
  selector: 'app-filtro-chamados',
  standalone: true,
  templateUrl: './filtro-chamados.html',
  styleUrl: './filtro-chamados.css',
})
export class FiltroChamados {
  pesquisa = input.required<string>();
  status = input.required<StatusChamado | 'todos'>();

  pesquisaChange = output<string>();
  statusChange = output<StatusChamado | 'todos'>();

  alterarPesquisa(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;

    this.pesquisaChange.emit(valor);
  }

  alterarStatus(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value as StatusChamado | 'todos';

    this.statusChange.emit(valor);
  }
}
