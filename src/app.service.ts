// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import * as https from 'https';

@Injectable()
export class AppService {
  constructor(private readonly gateway: AppGateway) {}

  async processAndStreamData(question: string): Promise<string> {
    try {
      const prompt = `Answer this question about the company: ${question}`;
      // Emit an initial message.
      this.gateway.sendMessage('Processing your question...');

      return new Promise<string>((resolve, reject) => {
        const options = {
          hostname: 'api.openai.com',
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        };

        const req = https.request(options, (res) => {
          res.setEncoding('utf8');
          let fullAnswer = '';

          res.on('data', (chunk: string) => {
            // The stream sends multiple lines; each line starts with "data: "
            const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));
            for (const line of lines) {
              const dataStr = line.replace(/^data:\s*/, '').trim();
              if (dataStr === '[DONE]') {
                // End of stream
                continue;
              }
              try {
                const parsed = JSON.parse(dataStr);
                // In streaming mode, each chunk should include a delta.
                // For GPT-3.5-turbo streaming, the text is usually found at:
                // parsed.choices[0].delta.content
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  fullAnswer += delta;
                  // Emit the new delta as a streaming update.
                  this.gateway.sendMessage(delta);
                }
              } catch (err) {
                console.error('Error parsing stream chunk:', err);
              }
            }
          });

          res.on('end', () => {
            // Stream ended, resolve with the full answer.
            resolve(fullAnswer);
          });
        });

        req.on('error', (error) => {
          console.error('Error during streaming request:', error);
          this.gateway.sendMessage('Error generating answer.');
          reject(error);
        });

        // Build the payload with streaming enabled.
        const payload = JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100,
          temperature: 0.7,
          stream: true,
        });

        req.write(payload);
        req.end();
      });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to communicate with AI service');
    }
  }
}
