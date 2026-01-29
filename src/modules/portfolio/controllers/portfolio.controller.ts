import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PortfolioService } from '../services/portfolio.service';
import {
  CreatePortfolioDto,
  UpdatePortfolioDto,
  PortfolioResponseDto,
} from '../dtos';
import { JwtGuard } from '../../auth/guards/jwt.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

@ApiTags('Portfolio')
@Controller('portfolios')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  /**
   * Create a new portfolio
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new portfolio',
    description: 'Create a new investment portfolio for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Portfolio created successfully',
    type: PortfolioResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createPortfolio(
    @Request() req: AuthenticatedRequest,
    @Body() createPortfolioDto: CreatePortfolioDto,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.createPortfolio(
      req.user.userId,
      createPortfolioDto,
    );
  }

  /**
   * Get all portfolios for authenticated user
   */
  @Get()
  @ApiOperation({
    summary: 'Get all portfolios',
    description: 'Retrieve all portfolios for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of portfolios retrieved successfully',
    type: [PortfolioResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAllPortfolios(
    @Request() req: AuthenticatedRequest,
  ): Promise<PortfolioResponseDto[]> {
    return this.portfolioService.getAllPortfolios(req.user.userId);
  }

  /**
   * Get portfolio by ID
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiOperation({
    summary: 'Get portfolio by ID',
    description: 'Retrieve a specific portfolio by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio retrieved successfully',
    type: PortfolioResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async getPortfolioById(
    @Request() req: AuthenticatedRequest,
    @Param('id') portfolioId: string,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.getPortfolioById(req.user.userId, portfolioId);
  }

  /**
   * Update portfolio
   */
  @Put(':id')
  @ApiParam({
    name: 'id',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiOperation({
    summary: 'Update portfolio',
    description: 'Update portfolio details (name, description)',
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio updated successfully',
    type: PortfolioResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async updatePortfolio(
    @Request() req: AuthenticatedRequest,
    @Param('id') portfolioId: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.updatePortfolio(
      req.user.userId,
      portfolioId,
      updatePortfolioDto,
    );
  }

  /**
   * Delete portfolio
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiOperation({
    summary: 'Delete portfolio',
    description: 'Delete a portfolio (soft delete)',
  })
  @ApiResponse({
    status: 204,
    description: 'Portfolio deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async deletePortfolio(
    @Request() req: AuthenticatedRequest,
    @Param('id') portfolioId: string,
  ): Promise<void> {
    await this.portfolioService.deletePortfolio(req.user.userId, portfolioId);
  }

  /**
   * Get portfolio statistics
   */
  @Get(':id/stats')
  @ApiParam({
    name: 'id',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiOperation({
    summary: 'Get portfolio statistics',
    description:
      'Retrieve portfolio performance statistics and asset breakdown',
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio statistics retrieved successfully',
    schema: {
      properties: {
        portfolioId: { type: 'string', example: 'clnxx123xxx' },
        totalInvested: { type: 'number', example: 50000 },
        totalCurrentValue: { type: 'number', example: 60000 },
        totalGainLoss: { type: 'number', example: 10000 },
        gainLossPercentage: { type: 'string', example: '20.00' },
        numberOfInvestments: { type: 'number', example: 5 },
        assetBreakdown: {
          type: 'object',
          example: {
            STOCKS: 40000,
            CRYPTO: 20000,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async getPortfolioStats(
    @Request() req: AuthenticatedRequest,
    @Param('id') portfolioId: string,
  ): Promise<unknown> {
    return this.portfolioService.getPortfolioStats(
      req.user.userId,
      portfolioId,
    );
  }
}
