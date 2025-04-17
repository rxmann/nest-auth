import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private databaseService: PrismaService) {}

  create(createUserInput: CreateUserInput) {
    return this.databaseService.user.create({
      data: createUserInput,
    });
  }

  findAll() {
    return this.databaseService.user.findMany();
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return this.databaseService.user.update({
      where: { id },
      data: updateUserInput,
    });
  }

  remove(id: number) {
    return this.databaseService.user.delete({
      where: { id },
    });
  }
}
