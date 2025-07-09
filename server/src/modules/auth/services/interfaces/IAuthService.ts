import { User } from "src/modules/users/entities/User"
export interface IAuthService {
    validateUser(email: string, password: string): Promise<User | null>

}