import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneByEmail: (email) => Promise.resolve(null && email),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@gmail.com', 'asdf');

    expect(user.password).not.toEqual('asdf');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', () => {
    fakeUsersService.findOneByEmail = (email) =>
      Promise.resolve({
        id: 1,
        email,
        password: 'asdf',
      } as User);

    expect(service.signup('asdf@gmail.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an usused email', () => {
    expect(service.signin('asdf@gmail.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if invalid password is provided', () => {
    fakeUsersService.findOneByEmail = (email) =>
      Promise.resolve({
        id: 1,
        email,
        password: 'test',
      } as User);

    expect(service.signin('asdf@gmail.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.findOneByEmail = (email) =>
      Promise.resolve({
        id: 1,
        email,
        password:
          '3dc0d715abc5c8e4.ab2022de0e0dc412ad721ded489adc3a5d95e0463ddc7d7e0f7daa8365fee7f1',
      } as User);

    const user = await service.signin('asdf@gmail.com', 'asdf');
    expect(user).toBeDefined();
  });
});
