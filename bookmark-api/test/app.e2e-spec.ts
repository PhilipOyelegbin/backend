import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { SignUpDto } from '../src/auth/dto/signup.dto';
import { SignInDto } from '../src/auth/dto/signin.dto';
import { UpdateUserDto } from '../src/user/dto/updateuser.dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';
import { UpdateBookmarkDto } from '../src/bookmark/dto/update-bookmark.dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('/api/v1');
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    describe('Signup', () => {
      // testing for signup with valid data
      it('Should signup', () => {
        const dto: SignUpDto = {
          name: 'E2E Test1',
          email: 'test1@gmail.com',
          password: '123456',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      // testing for signup with an email
      it('Should not signup with existing email', () => {
        const dto: SignUpDto = {
          name: 'E2E Test1',
          email: 'test1@gmail.com',
          password: '123456',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });
      // testing for signup without an email
      it('Should not signup without an email', () => {
        const dto: SignUpDto = {
          name: 'E2E Test2',
          email: '',
          password: '123456',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });
      // testing for signup without a password
      it('Should not signup without a password', () => {
        const dto: SignUpDto = {
          name: 'E2E Test2',
          email: 'test2@gmail.com',
          password: '',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });
    });

    describe('Signin', () => {
      // testing for no email
      test('Should not signin without email', () => {
        const dto: SignInDto = {
          email: '',
          password: '123456',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });
      // testing for no password
      test('Should not signin without a password', () => {
        const dto: SignInDto = {
          email: 'test1@gmail.com',
          password: '',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });
      // testing for wrong email
      test('Should not signin without a matching email', () => {
        const dto: SignInDto = {
          email: 'test2@gmail.com',
          password: '123456',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });
      // testing for wrong password
      test('Should not signin without a matching password', () => {
        const dto: SignInDto = {
          email: 'test1@gmail.com',
          password: '123455',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/auth/signin')
          .withBody(dto)
          .expectStatus(403);
      });
      // testing for correct credentials
      test('Should signin', () => {
        const dto: SignInDto = {
          email: 'test1@gmail.com',
          password: '123456',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('Bookmark', () => {
    describe('GetEmptyBookmark', () => {
      // testing for getting empty bookmark without authorization
      it('Should not get bookmark without authorization', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/api/v1/bookmark')
          .expectStatus(401);
      });
      // testing for getting empty bookmark
      it('Should get empty bookmark', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/api/v1/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('PostBookmark', () => {
      // testing for creating bookmark without title
      it('Should not create bookmark without title', () => {
        const dto: CreateBookmarkDto = {
          title: '',
          link: 'http://localhost:3333/testbm1',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(400);
      });
      // testing for creating bookmark without link
      it('Should not create bookmark without link', () => {
        const dto: CreateBookmarkDto = {
          title: 'Test1 Bookmark',
          link: '',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(400);
      });
      // testing for creating bookmark
      it('Should create bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'Test1 Bookmark',
          link: 'https://www.classcentral.com/classroom/freecodecamp-nestjs-course-for-beginners-create-a-rest-api-104864/63216e8418e52',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/api/v1/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('GetAllBookmark', () => {
      // testing for getting all bookmark without authorization
      it('Should not get all bookmark without authorization', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/api/v1/bookmark')
          .expectStatus(401);
      });
      // testing for getting all bookmark data
      it('Should get all bookmark data', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/api/v1/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('GetBookmarkById', () => {
      // testing for getting empty bookmark without authorization
      it('Should not get bookmark by id without authorization', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/api/v1/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(401);
      });
      // testing for getting all bookmark data
      it('Should get bookmark by id', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/api/v1/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('UpdateBookmark', () => {
      // testing for updating bookmark without token
      it('Should not update bookmark without token', () => {
        const dto: UpdateBookmarkDto = {
          link: 'http://localhost:3333/testbm1',
        };
        return pactum
          .spec()
          .patch('http://localhost:3333/api/v1/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .expectStatus(401);
      });
      // testing for updating bookmark
      it('Should update bookmark', () => {
        const dto: UpdateBookmarkDto = {
          description: 'Test one bookmark for e2e test.',
        };
        return pactum
          .spec()
          .patch('http://localhost:3333/api/v1/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.description);
      });
    });

    describe('DeleteBookmark', () => {
      // testing for delete bookmark without token
      it('Should not delete bookmark without token', () => {
        return pactum
          .spec()
          .delete('http://localhost:3333/api/v1/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(401);
      });
      // testing for delete bookmark
      it('Should delete bookmark', () => {
        return pactum
          .spec()
          .delete('http://localhost:3333/api/v1/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(204);
      });
      // testing for getting empty bookmark
      it('Should get empty bookmark', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/api/v1/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });

  describe('User', () => {
    describe('GetUser', () => {
      // testing for getting current user data without authentication
      it('Should not get current user without authentication', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/api/v1/users/me')
          .expectStatus(401);
      });
      // testing for getting current user data with authentication
      it('Should get current user with authentication', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/api/v1/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('UpdateUser', () => {
      // testing for updating current user data without authentication
      it('Should not update current user without authentication', () => {
        const dto: UpdateUserDto = {
          name: 'Test One',
          password: '@dmin1.',
        };
        return pactum
          .spec()
          .patch('http://localhost:3333/api/v1/users')
          .withBody(dto)
          .expectStatus(401);
      });
      // testing for updating current user data with authentication
      it('Should update current user with authentication', () => {
        const dto: UpdateUserDto = {
          name: 'Test One',
          password: '@dmin1.',
        };
        return pactum
          .spec()
          .patch('http://localhost:3333/api/v1/users')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name);
      });
    });

    describe('DeleteUser', () => {
      // testing for deleting current user data without authentication
      it('Should delete current user without authentication', () => {
        return pactum
          .spec()
          .delete('http://localhost:3333/api/v1/users')
          .expectStatus(401);
      });
      // testing for deleting current user data with authentication
      it('Should delete current user with authentication', () => {
        return pactum
          .spec()
          .delete('http://localhost:3333/api/v1/users')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .inspect();
      });
    });
  });
});
