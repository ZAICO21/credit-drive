import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {SignInCommand} from '../domain/model/sign-in.command';
import {User} from '../domain/model/user.entity';
import {SignInApiEndpoint} from './sign-in-api-endpoint';
import {SignInAssembler} from './sign-in-assembler';

/**
 * Application-facing facade for IAM infrastructure operations.
 */
@Injectable({providedIn: 'root'})
export class IamApi extends BaseApi {
  private readonly signInEndpoint: SignInApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.signInEndpoint = new SignInApiEndpoint(http, new SignInAssembler());
  }

  signIn(command: SignInCommand): Observable<User> {
    return this.signInEndpoint.signIn(command);
  }
}
