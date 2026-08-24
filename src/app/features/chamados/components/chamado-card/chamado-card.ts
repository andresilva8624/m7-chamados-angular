import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chamado } from '../../models/chamado';
@Component({
  selector: 'app-chamado-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './chamado-card.html',
  styleUrl: './chamado-card.css',
})
export class ChamadoCard {
  chamado = input.required<Chamado>();
}
