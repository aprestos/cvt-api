import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.findByEmail(createUserDto.email))
      throw new ConflictException('This is email is already registered');

    const createdUser = new this.userModel({
      email: createUserDto.email,
      name: createUserDto.name,
      // if password is defined create an hash
      ...(createUserDto.password
        ? { password: await this.createHash(createUserDto.password) }
        : undefined),
    });

    try {
      return createdUser.save();
    } catch (error) {
      console.log(JSON.stringify(error));
      throw error;
    }
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  private async createHash(password: string): Promise<string> {
    const bcrypt = require('bcrypt');

    return bcrypt.hash(password, 10);
  }
}
