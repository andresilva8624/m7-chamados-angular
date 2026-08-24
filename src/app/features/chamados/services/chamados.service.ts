import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Chamado } from '../models/chamado';
@Injectable({
  providedIn: 'root',
})
export class ChamadosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://m7-a7-chamados-api-ji22.onrender.com/api/chamados';
  // métodos serão adicionados aqui
  listar(): Promise<Chamado[]> {
    return firstValueFrom(this.http.get<Chamado[]>(this.apiUrl));
  }
  adicionar(chamado: Chamado): Promise<Chamado> {
    return firstValueFrom(this.http.post<Chamado>(this.apiUrl, chamado));
  }
  async buscarPorId(id: number): Promise<Chamado | undefined> {
    try {
      return await firstValueFrom(this.http.get<Chamado>(`${this.apiUrl}/${id}`));
    } catch (erro) {
      if (erro instanceof HttpErrorResponse && erro.status === 404) {
        return undefined;
      }
      throw erro;
    }
  }
}
