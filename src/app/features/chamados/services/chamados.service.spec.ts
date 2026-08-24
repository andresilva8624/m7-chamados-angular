import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChamadosService } from './chamados.service';

describe('ChamadosService', () => {
  let service: ChamadosService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChamadosService);
  });
  it('deve listar os chamados', async () => {
    const chamados = await service.listar();
    expect(chamados).toHaveLength(3);
  });
  it('deve buscar um chamado por id', async () => {
    const chamado = await service.buscarPorId(1);
    expect(chamado?.titulo).toBe('Erro ao acessar sistema');
  });
  it('deve adicionar um novo chamado', async () => {
    const antes = await service.listar();

    service.adicionar({
      id: 4,
      titulo: 'Novo chamado',
      descricao: 'Teste',
      prioridade: 'media',
      responsavel: 'Andre',
      status: 'aberto',
      criadoEm: '2026-08-20'
    });

    const depois = await service.listar();
    expect(depois.length).toBe(antes.length + 1);
  });
});
