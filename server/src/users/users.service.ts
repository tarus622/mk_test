import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/IUser';

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
        id: "1",
      email: 'test@email.com',
      password: 'testpassword',
    },
  ];

  async findOne(email: string): Promise<IUser | undefined> {
    const user = this.users.find((user: IUser) => user.email === email);

    return user;
  }

  getAll(): IUser[] {
    return this.users;
  }
}
