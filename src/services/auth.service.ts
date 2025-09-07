import { UserRepository } from '@/repositories/user.repository';

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async login() {}
}
