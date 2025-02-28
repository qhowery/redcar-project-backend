import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { JwtPayload } from '../types/jwt-payload';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService
  ) {}

  @Get()
  getHome(): string {
    return 'Welcome to the Redcar API!';
  }

  // Test route to check the authenticated user's details.
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: Request) {
    console.log('Profile endpoint, req.user:', req.user);
    return req.user;
  }

  // Protected /ask endpoint.
  @Post('ask')
  @UseGuards(AuthGuard('jwt'))
  async askQuestion(
    @Body() body: { question: string },
    @Req() req: Request
  ) {
    const user = req.user as JwtPayload;
    if (!user) throw new Error('Unauthorized');
    const answer = await this.appService.processAndStreamData(body.question);

    // added history using UserService
    await this.userService.addHistory(user.sub, {
      question: body.question,
      answer
    });
    return { answer };
  }
}
