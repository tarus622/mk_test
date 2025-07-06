import { CreateUserData} from '../types/create-user-data';
import { PublicUserData} from '../types/public-user-data';

export interface IUserService {
  create(data: CreateUserData): Promise<PublicUserData>;
  getAllUsers(): PublicUserData[];
  findPublicByEmail(email: string): PublicUserData | null;
  findPublicById(id: string): PublicUserData | null;
}
