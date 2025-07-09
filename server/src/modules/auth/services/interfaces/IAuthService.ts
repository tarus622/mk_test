import { User } from "src/modules/users/entities/User"
import { UserData } from "src/modules/users/repositories/types/UserData"
export interface IAuthService {
    validateUser(email: string, password: string): Promise<UserData | null>
    login(user: UserData): Promise<{ access_token: string; refresh_token: string }>
    refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }>
}