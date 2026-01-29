// import { Test, TestingModule } from '@nestjs/testing';
// import { ConflictException, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from './auth.service';
// import { PrismaService } from '../../../common/prisma/prisma.service';
// import { RegisterDto } from '../dtos/register.dto';
// import { LoginDto } from '../dtos/login.dto';
// import * as bcrypt from 'bcrypt';

// jest.mock('bcrypt');

// describe('AuthService', () => {
//   let service: AuthService;
//   let prismaService: PrismaService;
//   let jwtService: JwtService;
//   let configService: ConfigService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: PrismaService,
//           useValue: {
//             user: {
//               findUnique: jest.fn(),
//               create: jest.fn(),
//             },
//             refreshToken: {
//               create: jest.fn(),
//               findUnique: jest.fn(),
//               deleteMany: jest.fn(),
//             },
//           },
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             sign: jest.fn().mockReturnValue('mock-token'),
//           },
//         },
//         {
//           provide: ConfigService,
//           useValue: {
//             get: jest.fn((key) => {
//               const config = {
//                 'app.jwt.secret': 'test-secret-key-min-32-characters-long',
//                 'app.jwt.refreshSecret':
//                   'test-refresh-secret-min-32-characters-long',
//                 'app.jwt.expiresIn': '24h',
//                 'app.jwt.refreshExpiresIn': '7d',
//               };
//               return config[key];
//             }),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//     prismaService = module.get<PrismaService>(PrismaService);
//     jwtService = module.get<JwtService>(JwtService);
//     configService = module.get<ConfigService>(ConfigService);
//   });

//   describe('register', () => {
//     it('should register a new user successfully', async () => {
//       const registerDto: RegisterDto = {
//         email: 'test@example.com',
//         password: 'Test123!@#',
//         firstName: 'John',
//         lastName: 'Doe',
//       };

//       const mockUser = {
//         id: '1',
//         email: registerDto.email,
//         password: 'hashed-password',
//         firstName: registerDto.firstName,
//         lastName: registerDto.lastName,
//         phone: null,
//       };

//       jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
//       jest
//         .spyOn(bcrypt, 'hash')
//         .mockResolvedValueOnce('hashed-password' as never);
//       jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUser);

//       const result = await service.register(registerDto);

//       expect(result.email).toEqual(registerDto.email);
//       expect(result.accessToken).toBeDefined();
//       expect(result.refreshToken).toBeDefined();
//     });

//     it('should throw ConflictException if user already exists', async () => {
//       const registerDto: RegisterDto = {
//         email: 'test@example.com',
//         password: 'Test123!@#',
//       };

//       jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
//         id: '1',
//         email: registerDto.email,
//       } as any);

//       await expect(service.register(registerDto)).rejects.toThrow(
//         ConflictException,
//       );
//     });
//   });

//   describe('login', () => {
//     it('should login user successfully', async () => {
//       const loginDto: LoginDto = {
//         email: 'test@example.com',
//         password: 'Test123!@#',
//       };

//       const mockUser = {
//         id: '1',
//         email: loginDto.email,
//         password: 'hashed-password',
//         firstName: 'John',
//         lastName: 'Doe',
//       };

//       jest
//         .spyOn(prismaService.user, 'findUnique')
//         .mockResolvedValueOnce(mockUser);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
//       jest.spyOn(prismaService.refreshToken, 'create').mockResolvedValueOnce({
//         id: '1',
//         token: 'mock-token',
//       } as any);

//       const result = await service.login(loginDto);

//       expect(result.email).toEqual(loginDto.email);
//       expect(result.accessToken).toBeDefined();
//       expect(result.refreshToken).toBeDefined();
//     });

//     it('should throw UnauthorizedException for invalid password', async () => {
//       const loginDto: LoginDto = {
//         email: 'test@example.com',
//         password: 'WrongPassword123!',
//       };

//       const mockUser = {
//         id: '1',
//         email: loginDto.email,
//         password: 'hashed-password',
//       };

//       jest
//         .spyOn(prismaService.user, 'findUnique')
//         .mockResolvedValueOnce(mockUser);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

//       await expect(service.login(loginDto)).rejects.toThrow(
//         UnauthorizedException,
//       );
//     });

//     it('should throw UnauthorizedException if user not found', async () => {
//       const loginDto: LoginDto = {
//         email: 'nonexistent@example.com',
//         password: 'Test123!@#',
//       };

//       jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

//       await expect(service.login(loginDto)).rejects.toThrow(
//         UnauthorizedException,
//       );
//     });
//   });

//   describe('logout', () => {
//     it('should logout user successfully', async () => {
//       const userId = '1';

//       jest
//         .spyOn(prismaService.refreshToken, 'deleteMany')
//         .mockResolvedValueOnce({
//           count: 1,
//         } as any);

//       await service.logout(userId);

//       expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
//         where: { userId },
//       });
//     });
//   });
// });
