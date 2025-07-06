export interface IAuthService {
    validateUser(email: string, password: string): any;

}