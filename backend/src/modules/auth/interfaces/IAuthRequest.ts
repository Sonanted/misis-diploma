import { Request } from 'express';
import { IAuthUser } from './IAuthUser';

export interface IAuthRequest extends Request {
	user: IAuthUser;
}
