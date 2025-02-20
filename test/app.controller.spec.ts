/// <reference types="jest" />

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import axios from 'axios';

jest.mock('axios');

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getHome', () => {
    it('should return welcome message', () => {
      // If you added getHome() in your controller, it should return the welcome string
      expect(appController.getHome()).toBe('Welcome to the Redcar API!');
    });
  });

  describe('askQuestion', () => {
    it('should return an answer for a valid question', async () => {
      const question = 'Is redcar.io a B2B company?';
      const prompt = `Answer this question about the company: ${question}`;
      
      // Mock the axios.post call for the service
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          choices: [
            { message: { content: 'Yes, redcar.io is a B2B company.' } },
          ],
        },
      });

      const result = await appController.askQuestion({ question });
      expect(result).toBe('Yes, redcar.io is a B2B company.');
    });

    it('should handle errors gracefully', async () => {
      (axios.post as jest.Mock).mockRejectedValue(new Error('OpenAI API error'));

      const result = await appController.askQuestion({ question: 'Test error handling' });
      expect(result).toBe('There was an error generating the answer.');
    });
  });
});
