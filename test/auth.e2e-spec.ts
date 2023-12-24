import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const givenEmail = 'asdf@gmail.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: givenEmail, password: 'asdf' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(givenEmail);
      });
  });

  it('signup as a new user then get current logged in user', async () => {
    const givenEmail = 'asdf@gmail.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: givenEmail, password: 'asdf' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        const { email } = res.body;
        expect(email).toEqual(givenEmail);
      });
  });
});
