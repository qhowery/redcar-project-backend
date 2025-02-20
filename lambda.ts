import { configure } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import { VercelRequest, VercelResponse } from '@vercel/node';
import server from './src/main';
import * as dotenv from 'dotenv';
dotenv.config();


let cachedServer: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return configure({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback
) => {
  cachedServer = cachedServer || (await bootstrap());
  return cachedServer(event, context, callback);
};

export default (req: VercelRequest, res: VercelResponse) => {
    server(req, res);
};