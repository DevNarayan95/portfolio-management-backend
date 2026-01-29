import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('should return success response', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data.message).toBeDefined();
        });
    });
  });

  describe('Authentication Flow', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User',
    };

    let accessToken: string;
    let refreshToken: string;

    it('should register user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data.email).toEqual(testUser.email);
          expect(res.body.data.accessToken).toBeDefined();
          accessToken = res.body.data.accessToken;
          refreshToken = res.body.data.refreshToken;
        });
    });

    it('should login user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data.accessToken).toBeDefined();
        });
    });

    it('should get current user', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data.email).toEqual(testUser.email);
        });
    });

    it('should reject without token', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });

  describe('Portfolio Flow', () => {
    let portfolioId: string;
    let accessToken: string;

    beforeAll(async () => {
      const registerRes = await request(app.getHttpServer()).post('/auth/register').send({
        email: 'portfolio@example.com',
        password: 'Test123!@#',
      });

      accessToken = registerRes.body.data.accessToken;
    });

    it('should create portfolio', () => {
      return request(app.getHttpServer())
        .post('/portfolios')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Portfolio',
          description: 'Test description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data.name).toEqual('Test Portfolio');
          portfolioId = res.body.data.id;
        });
    });

    it('should get all portfolios', () => {
      return request(app.getHttpServer())
        .get('/portfolios')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toEqual(true);
          expect(Array.isArray(res.body.data)).toEqual(true);
        });
    });

    it('should get portfolio by id', () => {
      return request(app.getHttpServer())
        .get(`/portfolios/${portfolioId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data.id).toEqual(portfolioId);
        });
    });

    it('should update portfolio', () => {
      return request(app.getHttpServer())
        .put(`/portfolios/${portfolioId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Portfolio',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.data.name).toEqual('Updated Portfolio');
        });
    });
  });
});
