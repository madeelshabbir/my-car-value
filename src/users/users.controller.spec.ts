import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

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
      // update: () => {},
      // remove: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      // signin: () => {},
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
});
