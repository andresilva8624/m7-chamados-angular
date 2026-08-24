import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Chamado } from "../../models/chamado";
import { ChamadosService } from "../../services/chamados.service";
@Component({
selector: "app-chamado-detalhe-page",
standalone: true,
imports: [RouterLink],
templateUrl: "./chamado-detalhe-page.html"
})
export class ChamadoDetalhePage implements OnInit {
private readonly route = inject(ActivatedRoute);
private readonly service = inject(ChamadosService);
readonly chamado = signal<Chamado | undefined>(undefined);
readonly carregando = signal(true);
ngOnInit(): void {
void this.carregar();
}
private async carregar(): Promise<void> {
const id = Number(
this.route.snapshot.paramMap.get("id")
);
const chamado = await this.service.buscarPorId(id);
this.chamado.set(chamado);
this.carregando.set(false);
}
}