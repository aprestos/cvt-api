import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';
import { getModelToken } from '@nestjs/mongoose';

const mockUser = {
  name: 'bruce',
  email: 'bruce@wayne.industries',
  password: randomUUID(),
};

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const users: User[] = [
    {
      userId: randomUUID(),
      name: 'albert',
      email: 'albert@wayne.industries',
      password: randomUUID(),
    },
    {
      userId: randomUUID(),
      name: 'robin',
      email: 'robin@wayne.industries',
      password: randomUUID(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(users),
    } as any);
    const result = await service.findAll();
    expect(result).toEqual(users);
  });

  describe('create', () => {
    it('should insert a new user', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          name: 'catwoman',
          email: 'catwoman@wayne.industries',
          password: randomUUID(),
        } as any),
      );
      const newUser = await service.create({
        name: 'catwoman',
        email: 'catwoman@wayne.industries',
        password: randomUUID(),
      });
      expect(newUser).toEqual(mockUser);
    });
    it('should insert a new user only with required fields', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          email: 'catwoman@wayne.industries',
        } as any),
      );
      const newUser = await service.create({
        email: 'catwoman@wayne.industries',
      });
      expect(newUser).toEqual(mockUser);
    });
  });
});
