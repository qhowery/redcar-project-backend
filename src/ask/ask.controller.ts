// src/ask/ask.controller.ts
import { Controller, Post, Body, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from '../app.service';

@Controller('ask')
export class AskController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // Requires valid JWT
  async askQuestion(@Body('question') question: string) {
    try {
      const answer = await this.appService.processAndStreamData(question);
      return { answer };
    } catch (error) {
      console.error('Ask error:', error);
      throw new InternalServerErrorException('Failed to process question');
    }
  }
}