import {
  BadRequestException,
  ForbiddenException,
  ImATeapotException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundError } from 'rxjs';
import { SignUpDto } from './dto/sign-up.dto';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);

    if (!user) return null;

    if (!user.password)
      throw new ImATeapotException(
        'Trying to login but password is not defined',
      );

    const bcrypt = require('bcrypt');
    const isPasswordCorrect = await bcrypt.compare(pass, user.password);

    if (isPasswordCorrect) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    await this.usersService.create({
      email: signUpDto.email,
      name: signUpDto.name,
      password: signUpDto.password,
    });
  }
}
