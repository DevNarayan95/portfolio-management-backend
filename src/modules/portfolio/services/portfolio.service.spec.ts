import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreatePortfolioDto } from '../dtos/create-portfolio.dto';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: PrismaService,
          useValue: {
            portfolio: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
            investment: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createPortfolio', () => {
    it('should create a portfolio successfully', async () => {
      const userId = 'user-1';
      const createPortfolioDto: CreatePortfolioDto = {
        name: 'Test Portfolio',
        description: 'A test portfolio',
      };

      const mockPortfolio = {
        id: 'portfolio-1',
        userId,
        ...createPortfolioDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.portfolio, 'create').mockResolvedValueOnce(mockPortfolio);

      const result = await service.createPortfolio(userId, createPortfolioDto);

      expect(result.id).toEqual(mockPortfolio.id);
      expect(result.name).toEqual(createPortfolioDto.name);
      expect(prismaService.portfolio.create).toHaveBeenCalledWith({
        data: {
          userId,
          name: createPortfolioDto.name,
          description: createPortfolioDto.description,
        },
      });
    });
  });

  describe('getPortfolioById', () => {
    it('should return portfolio if user owns it', async () => {
      const userId = 'user-1';
      const portfolioId = 'portfolio-1';

      const mockPortfolio = {
        id: portfolioId,
        userId,
        name: 'Test Portfolio',
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        investments: [],
      };

      jest.spyOn(prismaService.portfolio, 'findUnique').mockResolvedValueOnce(mockPortfolio);

      const result = await service.getPortfolioById(userId, portfolioId);

      expect(result.id).toEqual(portfolioId);
    });

    it('should throw ForbiddenException if user does not own portfolio', async () => {
      const userId = 'user-1';
      const portfolioId = 'portfolio-1';
      const ownerUserId = 'user-2';

      const mockPortfolio = {
        id: portfolioId,
        userId: ownerUserId,
        deletedAt: null,
      };

      jest.spyOn(prismaService.portfolio, 'findUnique').mockResolvedValueOnce(mockPortfolio);

      await expect(service.getPortfolioById(userId, portfolioId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if portfolio does not exist', async () => {
      const userId = 'user-1';
      const portfolioId = 'nonexistent';

      jest.spyOn(prismaService.portfolio, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.getPortfolioById(userId, portfolioId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deletePortfolio', () => {
    it('should soft delete portfolio', async () => {
      const userId = 'user-1';
      const portfolioId = 'portfolio-1';

      const mockPortfolio = {
        id: portfolioId,
        userId,
        name: 'Test',
        deletedAt: null,
      };

      jest.spyOn(prismaService.portfolio, 'findUnique').mockResolvedValueOnce(mockPortfolio);
      jest.spyOn(prismaService.portfolio, 'update').mockResolvedValueOnce({
        ...mockPortfolio,
        deletedAt: new Date(),
      });

      await service.deletePortfolio(userId, portfolioId);

      expect(prismaService.portfolio.update).toHaveBeenCalled();
    });
  });
});
