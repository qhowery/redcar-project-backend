import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  UnauthorizedException,
  ConflictException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { JwtPayload } from '../../types/jwt-payload';
import * as bcrypt from 'bcrypt';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      return { id: user.id, username: user.username };
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('Username already exists');
      }
      console.error('Registration error:', error);
      throw new UnauthorizedException('Registration failed');
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Get('test')
  getTest() {
    return { message: 'Auth routes are working!' };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: Request) {
    const payload = req.user as JwtPayload; // Type assertion here
    const user = await this.authService.getUserById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return { id: user.id, username: user.username };
  }

  // auth.controller.ts
  @Post('test-hash')
  async testHash(@Body() { password }: { password: string }) {
    const hash = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare(password, hash);
    return { hash, isValid };
  }
}