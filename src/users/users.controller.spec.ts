import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () =>
        Promise.resolve([
          {
            id: 1,
            email: 'asdf@gmail.com',
            password: 'asdf',
          } as User,
        ]),
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'asdf@gmail.com',
          password: 'asdf',
        } as User),
    };
    fakeAuthService = {
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUsers returns a list of users', async () => {
    const users = await controller.findUsers();

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@gmail.com');
  });

  it('findUser returns user with the given id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('signin update session object and return user', async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      { email: 'asdf@gmail.com', password: 'asdf' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
