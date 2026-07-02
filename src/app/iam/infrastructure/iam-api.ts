import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SupabaseService } from '../../shared/infrastructure/supabase.service';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { ResetPasswordCommand } from '../domain/model/reset-password.command';
import { User } from '../domain/model/user.entity';
import { SignInApiEndpoint } from './sign-in-api-endpoint';
import { SignUpApiEndpoint } from './sign-up-api-endpoint';
import { PasswordRecoveryApiEndpoint } from './password-recovery-api-endpoint';
import { SignInAssembler } from './sign-in-assembler';

@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  private readonly signInEndpoint: SignInApiEndpoint;
  private readonly signUpEndpoint: SignUpApiEndpoint;
  private readonly passwordRecoveryEndpoint: PasswordRecoveryApiEndpoint;

  constructor(supabaseService: SupabaseService) {
    super();

    this.signInEndpoint = new SignInApiEndpoint(supabaseService, new SignInAssembler());

    this.signUpEndpoint = new SignUpApiEndpoint(supabaseService);
    this.passwordRecoveryEndpoint = new PasswordRecoveryApiEndpoint(supabaseService);
  }

  signIn(command: SignInCommand): Observable<User> {
    return this.signInEndpoint.signIn(command);
  }

  signUp(command: SignUpCommand): Observable<void> {
    return this.signUpEndpoint.signUp(command);
  }

  resetPassword(command: ResetPasswordCommand): Observable<void> {
    return this.passwordRecoveryEndpoint.resetPassword(command);
  }
}
