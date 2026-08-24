import { Component, input } from '@angular/core';
import { Chamado } from '../../models/chamado';
import { ChamadoCard } from '../chamado-card/chamado-card';
@Component({
  selector: 'app-lista-chamados',
  standalone: true,
  imports: [ChamadoCard],
  templateUrl: './lista-chamados.html',
})
export class ListaChamados {
  chamados = input.required<Chamado[]>();
  carregando = input(false);
  erro = input<string | null>(null);
}
