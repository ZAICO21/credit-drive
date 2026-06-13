import {BaseResource} from '../../shared/infrastructure/base-response';

/**
 * Raw `users` collection record as stored in `server/db.json`.
 */
export interface UserResource extends BaseResource {
  id: string;
  role_id: string;
  username: string;
  password: string;
  enabled: boolean;
  name: string;
  last_name: string;
  email: string;
  registration_date: string;
}

/**
 * Raw `roles` collection record as stored in `server/db.json`.
 */
export interface RoleResource extends BaseResource {
  id: string;
  name: string;
  description: string;
}
