import { LoginDto, RegisterDto } from '@/common/dto/auth';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import { USER_SERVICE_TOKEN } from '@/common/tokens';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_SERVICE_TOKEN,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegisterDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('должен успешно зарегистрировать нового пользователя', async () => {
      const createdUser: ISafeUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: validRegisterDto.email,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockUserService.findOne.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await service.register(validRegisterDto);

      expect(result).toEqual(createdUser);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith({
        email: validRegisterDto.email,
      });
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
      expect(mockUserService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: validRegisterDto.email,
          password: expect.any(String),
        }),
      );
    });

    it('должен выбросить ConflictException, если пользователь уже существует', async () => {
      const existingUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: validRegisterDto.email,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.findOne.mockResolvedValue(existingUser);

      await expect(service.register(validRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('должен выбросить BadRequestException, если пароли не совпадают', async () => {
      const registerDtoWithMismatchedPasswords: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'differentPassword',
      };

      await expect(
        service.register(registerDtoWithMismatchedPasswords),
      ).rejects.toThrow(BadRequestException);
      expect(mockUserService.findOne).not.toHaveBeenCalled();
      expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('должен хешировать пароль перед созданием пользователя', async () => {
      const createdUser: ISafeUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: validRegisterDto.email,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockUserService.findOne.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(createdUser);

      await service.register(validRegisterDto);

      expect(mockUserService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: validRegisterDto.email,
          password: expect.any(String),
        }),
      );
      const createCall = mockUserService.create.mock.calls[0];
      if (createCall && Array.isArray(createCall) && createCall[0]) {
        const callArg = createCall[0] as { email: string; password: string };
        expect(callArg.password).not.toBe(validRegisterDto.password);
        expect(callArg.password.length).toBeGreaterThan(20);
      }
    });

    it('должен корректно обработать ошибку при проверке существования пользователя', async () => {
      const error = new Error('Database error');
      mockUserService.findOne.mockRejectedValue(error);

      await expect(service.register(validRegisterDto)).rejects.toThrow(error);
      expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('должен корректно обработать ошибку при создании пользователя', async () => {
      const error = new Error('Database error');

      mockUserService.findOne.mockResolvedValue(null);
      mockUserService.create.mockRejectedValue(error);

      await expect(service.register(validRegisterDto)).rejects.toThrow(error);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    const validLoginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('должен успешно войти пользователя с правильными данными', async () => {
      const hashedPassword = await bcrypt.hash(validLoginDto.password, 10);
      const existingUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: validLoginDto.email,
        password: hashedPassword,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };
      const expectedResponse: ISafeUser = {
        id: existingUser.id,
        email: existingUser.email,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      };

      mockUserService.findOne.mockResolvedValue(existingUser);

      const result = await service.login(validLoginDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith({
        email: validLoginDto.email,
      });
    });

    it('должен выбросить UnauthorizedException, если пользователь не найден', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(service.login(validLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith({
        email: validLoginDto.email,
      });
    });

    it('должен выбросить UnauthorizedException, если пароль неверный', async () => {
      const wrongPassword = 'wrongPassword';
      const hashedPassword = await bcrypt.hash(validLoginDto.password, 10);
      const existingUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: validLoginDto.email,
        password: hashedPassword,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockUserService.findOne.mockResolvedValue(existingUser);

      const loginDtoWithWrongPassword: LoginDto = {
        email: validLoginDto.email,
        password: wrongPassword,
      };

      await expect(service.login(loginDtoWithWrongPassword)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
    });

    it('должен корректно обработать ошибку при проверке существования пользователя', async () => {
      const error = new Error('Database error');
      mockUserService.findOne.mockRejectedValue(error);

      await expect(service.login(validLoginDto)).rejects.toThrow(error);
    });
  });
});
