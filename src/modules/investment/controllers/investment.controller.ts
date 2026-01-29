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
  ApiHeader,
  ApiBody,
} from '@nestjs/swagger';
import { InvestmentService } from '../services/investment.service';
import {
  CreateInvestmentDto,
  UpdateInvestmentDto,
  InvestmentResponseDto,
} from '../dtos';
import { IInvestmentPerformance } from '../interfaces/investment.interface';
import { JwtGuard } from '../../auth/guards/jwt.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

/**
 * Investment Controller
 * Handles investment CRUD operations and performance tracking
 */
@ApiTags('Investment')
@Controller('portfolios/:portfolioId/investments')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class InvestmentController {
  constructor(private investmentService: InvestmentService) {}

  /**
   * Add a new investment to portfolio
   * Creates a new investment entry within a specific portfolio
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add a new investment to portfolio',
    description:
      'Create a new investment entry in a portfolio. Supports regular investments and Systematic Investment Plans (SIP). Requires valid portfolio access.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (access token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @ApiBody({
    type: CreateInvestmentDto,
    description: 'Investment details',
  })
  @ApiResponse({
    status: 201,
    description: 'Investment created successfully',
    type: InvestmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or SIP validation failed',
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
  async createInvestment(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
    @Body() createInvestmentDto: CreateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    return this.investmentService.createInvestment(
      req.user.userId,
      portfolioId,
      createInvestmentDto,
    );
  }

  /**
   * Get all investments in a portfolio
   * Retrieves all active investments for a specific portfolio
   */
  @Get()
  @ApiOperation({
    summary: 'Get all investments in portfolio',
    description:
      'Retrieve all active investments for a specific portfolio. Returns investments ordered by creation date (newest first).',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (access token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of investments retrieved successfully',
    type: [InvestmentResponseDto],
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
  async getInvestments(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
  ): Promise<InvestmentResponseDto[]> {
    return this.investmentService.getInvestmentsByPortfolio(
      req.user.userId,
      portfolioId,
    );
  }

  /**
   * Get investment performance metrics
   * Calculates and returns performance metrics for an investment
   * ⚠️ MUST come before @Get(':investmentId') to avoid route conflicts
   */
  @Get(':investmentId/performance')
  @ApiOperation({
    summary: 'Get investment performance metrics',
    description:
      'Calculate and retrieve performance metrics for a specific investment including gains/losses, percentages, and transaction history.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiParam({
    name: 'investmentId',
    description: 'Investment ID',
    example: 'clnxx456yyy',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (access token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Investment performance metrics retrieved successfully',
    type: Object,
    schema: {
      properties: {
        investmentId: {
          type: 'string',
          example: 'clnxx456yyy',
          description: 'Investment ID',
        },
        name: {
          type: 'string',
          example: 'Axis Bluechip Fund',
          description: 'Investment name',
        },
        type: {
          type: 'string',
          example: 'MUTUAL_FUND',
          description: 'Investment type',
        },
        quantity: {
          type: 'number',
          example: 10,
          description: 'Quantity of units/shares',
        },
        purchasePrice: {
          type: 'number',
          example: 2500,
          description: 'Purchase price per unit',
        },
        currentPrice: {
          type: 'number',
          example: 2750,
          description: 'Current price per unit',
        },
        investedAmount: {
          type: 'number',
          example: 25000,
          description: 'Total amount invested',
        },
        currentValue: {
          type: 'number',
          example: 27500,
          description: 'Current portfolio value',
        },
        gainLoss: {
          type: 'number',
          example: 2500,
          description: 'Absolute gain/loss amount',
        },
        gainLossPercentage: {
          type: 'string',
          example: '10.00',
          description: 'Gain/loss percentage',
        },
        isSIP: {
          type: 'boolean',
          example: false,
          description: 'Is this a SIP investment',
        },
        transactionCount: {
          type: 'number',
          example: 2,
          description: 'Number of transactions',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Investment not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async getPerformance(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
    @Param('investmentId') investmentId: string,
  ): Promise<IInvestmentPerformance> {
    return this.investmentService.getInvestmentPerformance(
      req.user.userId,
      portfolioId,
      investmentId,
    );
  }

  /**
   * Get investment details by ID
   * Retrieves detailed information for a specific investment
   */
  @Get(':investmentId')
  @ApiOperation({
    summary: 'Get investment details',
    description:
      'Retrieve detailed information for a specific investment including all properties and current values.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiParam({
    name: 'investmentId',
    description: 'Investment ID',
    example: 'clnxx456yyy',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (access token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Investment details retrieved successfully',
    type: InvestmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Investment or portfolio not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async getInvestmentById(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
    @Param('investmentId') investmentId: string,
  ): Promise<InvestmentResponseDto> {
    return this.investmentService.getInvestmentById(
      req.user.userId,
      portfolioId,
      investmentId,
    );
  }

  /**
   * Update investment details
   * Updates investment properties like name, current price, and SIP amount
   */
  @Put(':investmentId')
  @ApiOperation({
    summary: 'Update investment',
    description:
      'Update investment details including name, current price, notes, and SIP amount. At least one field must be provided.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiParam({
    name: 'investmentId',
    description: 'Investment ID',
    example: 'clnxx456yyy',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (access token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @ApiBody({
    type: UpdateInvestmentDto,
    description: 'Investment fields to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Investment updated successfully',
    type: InvestmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Investment not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async updateInvestment(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
    @Param('investmentId') investmentId: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    return this.investmentService.updateInvestment(
      req.user.userId,
      portfolioId,
      investmentId,
      updateInvestmentDto,
    );
  }

  /**
   * Delete investment
   * Soft deletes an investment from the portfolio
   */
  @Delete(':investmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete investment',
    description:
      'Soft delete an investment from the portfolio. The investment record is preserved but marked as deleted.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiParam({
    name: 'investmentId',
    description: 'Investment ID',
    example: 'clnxx456yyy',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (access token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Investment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Investment not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async deleteInvestment(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
    @Param('investmentId') investmentId: string,
  ): Promise<void> {
    await this.investmentService.deleteInvestment(
      req.user.userId,
      portfolioId,
      investmentId,
    );
  }
}
