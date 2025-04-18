import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/common/database/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private databaseService: PrismaService) {}

  async verifyUser(email: string, password: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('User not found.');
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }

  async create(createUserInput: CreateUserInput) {
    const hash = await argon2.hash(createUserInput.password);
    const newUser = { ...createUserInput, password: hash };
    return await this.databaseService.user.create({
      data: newUser,
    });
  }

  async findAll() {
    return await this.databaseService.user.findMany();
  }

  async findOne(id: number) {
    return await this.databaseService.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return await this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    return await this.databaseService.user.update({
      where: { id },
      data: updateUserInput,
    });
  }

  async remove(id: number) {
    return await this.databaseService.user.delete({
      where: { id },
    });
  }
}
