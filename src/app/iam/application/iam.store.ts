import {Injectable, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {IamApi} from '../infrastructure/iam-api';
import {SignInCommand} from '../domain/model/sign-in.command';
import {User, UserProps} from '../domain/model/user.entity';

const SESSION_STORAGE_KEY = 'compra-inteligente.session';

interface StoredSession {
  token: string;
  user: UserProps;
}

/**
 * Application service holding the IAM session state.
 *
 * @remarks
 * The session (token + user profile) is mirrored to `localStorage` so it
 * survives page reloads — the store rehydrates it on construction. The token
 * is a mock value (json-server has no real auth); it only exists so the
 * {@link iamInterceptor}/{@link iamGuard} pattern works like a real backend.
 */
@Injectable({providedIn: 'root'})
export class IamStore {
  private readonly iamApi = inject(IamApi);

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly currentToken = this.tokenSignal.asReadonly();
  readonly signInError = this.errorSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly isSignedIn = computed(() => this.currentUserSignal() !== null);

  constructor() {
    this.restoreSession();
  }

  /** Rehydrates the session from `localStorage`, if any. */
  private restoreSession(): void {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return;
    try {
      const stored = JSON.parse(raw) as StoredSession;
      this.currentUserSignal.set(new User(stored.user));
      this.tokenSignal.set(stored.token);
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  private persistSession(user: User, token: string): void {
    const stored: StoredSession = {token, user: user.toProps()};
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stored));
  }

  /**
   * Authenticates the user and, on success, persists the session and
   * navigates to the dashboard. On failure, exposes the error message via
   * {@link signInError} for the sign-in form to display.
   */
  signIn(command: SignInCommand, router: Router): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.iamApi.signIn(command).subscribe({
      next: user => {
        const token = btoa(`${user.id}:${user.email}:${Date.now()}`);
        this.currentUserSignal.set(user);
        this.tokenSignal.set(token);
        this.persistSession(user, token);
        this.loadingSignal.set(false);
        router.navigate(['/dashboard']).then();
      },
      error: (err: Error) => {
        this.currentUserSignal.set(null);
        this.tokenSignal.set(null);
        this.errorSignal.set(err.message || 'No se pudo iniciar sesión.');
        this.loadingSignal.set(false);
      }
    });
  }

  /** Clears the session and redirects to the sign-in page. */
  signOut(router: Router): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    router.navigate(['/iam/sign-in']).then();
  }
}
