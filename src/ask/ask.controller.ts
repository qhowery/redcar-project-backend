// src/ask/ask.controller.ts
import { Controller, Post, Body, UseGuards, Req, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from '../app.service';
import { UserService } from '../user/user.service';
import { Request } from 'express';

@Controller('ask')
export class AskController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService // Inject UserService
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async askQuestion(
    @Body('question') question: string,
    @Req() req: Request
  ) {
    try {
      const user = req.user as { sub: number }; // Get user ID from JWT
      const answer = await this.appService.processAndStreamData(question);
      
      // Add to history
      await this.userService.addHistory(user.sub, {
        question,
        answer
      });

      return { answer };
    } catch (error) {
      console.error('Ask error:', error);
      throw new InternalServerErrorException('Failed to process question');
    }
  }
}