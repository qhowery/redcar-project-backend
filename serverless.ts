import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import { Server } from 'http';

let cachedServer: Server | null = null;

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);
    await app.init();
    cachedServer = awsServerlessExpress.createServer(expressApp);
  }
  return cachedServer!;
}

// ✅ Fix: Corrected the `proxy` function call
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  const server = await bootstrapServer();
  awsServerlessExpress.proxy(server, event, context, "CALLBACK", callback);
};
