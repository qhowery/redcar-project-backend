/// <reference types="jest" />

import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './../src/app.service';
import axios from 'axios';

// Mock axios so that we don't make actual API calls during tests
jest.mock('axios');

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should return an answer for a valid question', async () => {
    const question = 'Is redcar.io a B2B company?';
    // Expected prompt based on the service logic
    const prompt = `Answer this question about the company: ${question}`;

    // Mock the axios.post to resolve with a simulated response
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        choices: [
          { message: { content: 'Yes, redcar.io is a B2B company.' } },
        ],
      },
    });

    const answer = await service.getAnswer(question);
    expect(answer).toBe('Yes, redcar.io is a B2B company.');
  });

  it('should handle errors gracefully', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('OpenAI API error'));

    const answer = await service.getAnswer('What is the meaning of life?');
    expect(answer).toBe('There was an error generating the answer.');
  });
});
