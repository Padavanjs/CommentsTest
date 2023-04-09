import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { UserModel } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof UserModel,
  ) {}

  async create(email: string, username: string): Promise<UserModel> {
    const findUser = await this.userRepository.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (findUser !== null) {
      await findUser.update({ username, email });
      return findUser;
    }

    const user = await this.userRepository.create({ email, username });

    return user;
  }

  async findByEmail(email: string): Promise<UserModel> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
