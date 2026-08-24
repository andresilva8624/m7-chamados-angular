import { Routes } from '@angular/router';
import { ChamadosPage } from './features/chamados/pages/chamados-page/chamados-page';
import { ChamadoDetalhePage } from './features/chamados/pages/chamado-detalhe-page/chamado-detalhe-page';
export const routes: Routes = [
  { path: '', redirectTo: 'chamados', pathMatch: 'full' },
  { path: 'chamados', component: ChamadosPage },
  { path: 'chamados/:id', component: ChamadoDetalhePage },
];
