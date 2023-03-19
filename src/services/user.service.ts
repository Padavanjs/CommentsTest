import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  async create(email: string, nUsername: string): Promise<UserModel> {
    const findUser = await this.userModel.findOne({ where: { email } });
    if (findUser && findUser.username !== nUsername) {
      await findUser.update({ username: nUsername });
      return findUser;
    } else if (findUser && findUser.username === nUsername) {
      return findUser;
    } else {
      const user = await this.userModel.create({ email, username: nUsername });
      return user;
    }
  }
}
