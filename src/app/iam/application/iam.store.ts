import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IamApi } from '../infrastructure/iam-api';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { ResetPasswordCommand } from '../domain/model/reset-password.command';
import { User, UserProps } from '../domain/model/user.entity';

const SESSION_STORAGE_KEY = 'compra-inteligente.session';

interface StoredSession {
  token: string;
  user: UserProps;
}

@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly iamApi = inject(IamApi);

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);

  private readonly signUpErrorSignal = signal<string | null>(null);
  private readonly signUpSuccessSignal = signal<string | null>(null);

  private readonly resetPasswordErrorSignal = signal<string | null>(null);
  private readonly resetPasswordSuccessSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly currentToken = this.tokenSignal.asReadonly();
  readonly signInError = this.errorSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly isSignedIn = computed(() => this.currentUserSignal() !== null);

  readonly signUpError = this.signUpErrorSignal.asReadonly();
  readonly signUpSuccess = this.signUpSuccessSignal.asReadonly();

  readonly resetPasswordError = this.resetPasswordErrorSignal.asReadonly();
  readonly resetPasswordSuccess = this.resetPasswordSuccessSignal.asReadonly();

  constructor() {
    this.restoreSession();
  }

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
    const stored: StoredSession = {
      token,
      user: user.toProps(),
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stored));
  }

  private clearSession(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
  }

  signIn(command: SignInCommand, router: Router): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.iamApi.signIn(command).subscribe({
      next: (user) => {
        const token = btoa(`${user.id}:${user.email}:${Date.now()}`);

        this.currentUserSignal.set(user);
        this.tokenSignal.set(token);
        this.persistSession(user, token);

        this.loadingSignal.set(false);
        router.navigate(['/dashboard']).then();
      },
      error: (err: Error) => {
        this.clearSession();
        this.errorSignal.set(err.message || 'No se pudo iniciar sesión.');
        this.loadingSignal.set(false);
      },
    });
  }

  signUp(command: SignUpCommand): void {
    this.loadingSignal.set(true);
    this.signUpErrorSignal.set(null);
    this.signUpSuccessSignal.set(null);

    this.iamApi.signUp(command).subscribe({
      next: () => {
        this.signUpSuccessSignal.set('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
        this.loadingSignal.set(false);
      },
      error: (err: Error) => {
        this.signUpErrorSignal.set(err.message || 'No se pudo registrar el usuario.');
        this.loadingSignal.set(false);
      },
    });
  }

  resetPassword(command: ResetPasswordCommand): void {
    this.loadingSignal.set(true);
    this.resetPasswordErrorSignal.set(null);
    this.resetPasswordSuccessSignal.set(null);

    this.iamApi.resetPassword(command).subscribe({
      next: () => {
        this.resetPasswordSuccessSignal.set(
          'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
        );
        this.loadingSignal.set(false);
      },
      error: (err: Error) => {
        this.resetPasswordErrorSignal.set(err.message || 'No se pudo cambiar la contraseña.');
        this.loadingSignal.set(false);
      },
    });
  }

  signOut(router: Router): void {
    this.clearSession();
    router.navigate(['/iam/sign-in']).then();
  }
}
