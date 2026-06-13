import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, switchMap, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {SignInCommand} from '../domain/model/sign-in.command';
import {User} from '../domain/model/user.entity';
import {SignInAssembler} from './sign-in-assembler';
import {RoleResource, UserResource} from './users-response';

const usersUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderUsersEndpointPath}`;
const rolesUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderRolesEndpointPath}`;

/**
 * Mock authentication endpoint.
 *
 * @remarks
 * json-server has no real auth, so sign-in is emulated as:
 * 1. `GET /users?email=...&password=...` — credential lookup.
 * 2. `GET /roles/:id` — resolve the role name for the matched user.
 *
 * Invalid-credential and disabled-account cases are surfaced as plain
 * `Error`s (not wrapped by {@link handleError}) so the store can show the
 * specific message to the user instead of a generic HTTP error.
 */
export class SignInApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient, private assembler: SignInAssembler) {
    super();
  }

  signIn(command: SignInCommand): Observable<User> {
    const params = new HttpParams()
      .set('email', command.email)
      .set('password', command.password);

    return this.http.get<UserResource[]>(usersUrl, {params}).pipe(
      catchError(this.handleError('Failed to sign-in')),
      switchMap(users => {
        const userResource = users[0];
        if (!userResource) {
          return throwError(() => new Error('Correo o contraseña incorrectos.'));
        }
        if (!userResource.enabled) {
          return throwError(() => new Error('Esta cuenta se encuentra deshabilitada.'));
        }
        return this.http.get<RoleResource>(`${rolesUrl}/${userResource.role_id}`).pipe(
          catchError(this.handleError('Failed to fetch role')),
          map(roleResource => this.assembler.toEntity(userResource, roleResource))
        );
      })
    );
  }
}
