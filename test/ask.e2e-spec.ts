import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Protected Endpoint /ask (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Obtain a token via the login endpoint.
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test', password: 'password' });
    jwtToken = response.body.access_token;
  });

  it('/ask (POST) with valid token should succeed', () => {
    return request(app.getHttpServer())
      .post('/ask')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ question: 'Is redcar.io a B2B company?' })
      .expect(200)
      .expect((res) => {
        // The response should be the final answer (or a streaming simulation)
        expect(res.text).toBeDefined();
      });
  });

  it('/ask (POST) without token should fail', () => {
    return request(app.getHttpServer())
      .post('/ask')
      .send({ question: 'Is redcar.io a B2B company?' })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
