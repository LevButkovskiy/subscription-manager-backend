import { CreateUserDto, FindOneDto } from '@/common/dto/users';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('должен вернуть пользователя, если он найден по email', async () => {
      const email = 'test@example.com';
      const findOneDto: FindOneDto = { email };
      const mockUser: UserEntity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email,
        password: 'hashedPassword',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(findOneDto);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('должен вернуть null, если пользователь не найден', async () => {
      const email = 'notfound@example.com';
      const findOneDto: FindOneDto = { email };

      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(findOneDto);

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('должен корректно обработать ошибку при запросе к базе данных', async () => {
      const email = 'error@example.com';
      const findOneDto: FindOneDto = { email };
      const error = new Error('Database connection error');

      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(findOneDto)).rejects.toThrow(error);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('должен использовать email из DTO для поиска', async () => {
      const email = 'specific@example.com';
      const findOneDto: FindOneDto = { email };

      mockRepository.findOne.mockResolvedValue(null);

      await service.findOne(findOneDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'specific@example.com' },
      });
    });
  });

  describe('create', () => {
    it('должен успешно создать нового пользователя и вернуть его без пароля', async () => {
      const email = 'newuser@example.com';
      const password = 'hashedPassword123';
      const createUserDto: CreateUserDto = {
        email,
        password,
      };
      const createdUser: UserEntity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email,
        password,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };
      const expectedResponse: ISafeUser = {
        id: createdUser.id,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      };

      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(result).not.toHaveProperty('password');
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        email,
        password,
      });
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('должен корректно обработать ошибку при создании пользователя', async () => {
      const email = 'error@example.com';
      const password = 'hashedPassword123';
      const createUserDto: CreateUserDto = {
        email,
        password,
      };
      const error = new Error('Database error');
      const userEntity: UserEntity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email,
        password,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockRepository.create.mockReturnValue(userEntity);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(createUserDto)).rejects.toThrow(error);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('должен использовать переданные email и password для создания пользователя', async () => {
      const email = 'specific@example.com';
      const password = 'specificPassword';
      const createUserDto: CreateUserDto = {
        email,
        password,
      };
      const createdUser: UserEntity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email,
        password,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        email: 'specific@example.com',
        password: 'specificPassword',
      });
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(email);
    });
  });
});
