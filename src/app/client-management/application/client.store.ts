import {computed, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {Client} from '../domain/model/client.entity';
import {ClientApi} from '../infrastructure/client-api';

@Injectable({providedIn: 'root'})
export class ClientStore {
  private readonly clientsSignal = signal<Client[]>([]);
  readonly clients = this.clientsSignal.asReadonly();
  readonly clientsCount = computed(() => this.clients().length);

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private clientApi: ClientApi) {
    this.loadClients();
  }

  private formatError(error: any, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }

  loadClients(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.clientApi.getClients().pipe(takeUntilDestroyed()).subscribe({
      next: clients => {
        this.clientsSignal.set(clients);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudieron cargar los clientes.'));
        this.loadingSignal.set(false);
      }
    });
  }

  getClientById(id: string): Signal<Client | undefined> {
    return computed(() => this.clients().find(client => client.id === id));
  }

  addClient(client: Client): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.clientApi.createClient(client).pipe(retry(2)).subscribe({
      next: created => {
        this.clientsSignal.update(clients => [...clients, created]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudo crear el cliente.'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateClient(client: Client): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.clientApi.updateClient(client).pipe(retry(2)).subscribe({
      next: updated => {
        this.clientsSignal.update(clients => clients.map(c => c.id === updated.id ? updated : c));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudo actualizar el cliente.'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteClient(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.clientApi.deleteClient(id).pipe(retry(2)).subscribe({
      next: () => {
        this.clientsSignal.update(clients => clients.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudo eliminar el cliente.'));
        this.loadingSignal.set(false);
      }
    });
  }
}
