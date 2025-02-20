import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  @UseGuards(AuthGuard('jwt'))
  @Post('ask')
  async askQuestion(@Body() payload: { question: string }, @Req() req: Request): Promise<string> {
    console.log('Authorization Header:', req.headers.authorization);
    console.log('Authenticated User:', req.user);
    return this.appService.processAndStreamData(payload.question);
  }
}
