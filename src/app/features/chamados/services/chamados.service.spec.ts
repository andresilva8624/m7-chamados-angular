import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChamadosService } from './chamados.service';

describe('ChamadosService', () => {
  let service: ChamadosService;
  let httpClient: HttpClient;

  beforeEach(() => {
    const storage = new Map<string, string>();

    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
        clear: () => storage.clear(),
      },
      configurable: true,
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ChamadosService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('deve usar a API local em ambiente de desenvolvimento', () => {
    expect(service.resolveApiUrl('localhost')).toBe('http://localhost:3000/api/chamados');
    expect(service.resolveApiUrl('127.0.0.1')).toBe('http://localhost:3000/api/chamados');
    expect(service.resolveApiUrl('m7-chamados-angular-azbb.onrender.com')).toBe(
      'https://m7-a7-chamados-api-ji22.onrender.com/api/chamados',
    );
  });

  it('deve devolver dados iniciais quando a API falha e não há lista salva', async () => {
    vi.spyOn(httpClient, 'get').mockReturnValue({
      subscribe: () => {
        throw new Error('forced failure');
      },
      pipe: () => ({}) as any,
    } as any);

    const resultado = await service.listar();

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado[0].titulo).toBe('Erro ao acessar sistema');
  });

  it('deve salvar novo chamado no localStorage quando a API falha', async () => {
    const novoChamado = {
      id: 99,
      titulo: 'Novo chamado',
      descricao: 'Teste',
      prioridade: 'media',
      responsavel: 'Andre',
      status: 'aberto',
      criadoEm: '2026-08-20',
    };

    vi.spyOn(httpClient, 'post').mockReturnValue({
      subscribe: () => {
        throw new Error('forced failure');
      },
      pipe: () => ({}) as any,
    } as any);

    const resultado = await service.adicionar(novoChamado);

    expect(resultado).toEqual(novoChamado);
    expect(JSON.parse(localStorage.getItem('chamados-local') || '[]')).toContainEqual(novoChamado);
  });
});
