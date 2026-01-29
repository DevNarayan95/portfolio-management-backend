import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TransactionService } from '../services/transaction.service';
import {
  CreateTransactionDto,
  TransactionResponseDto,
  FilterTransactionDto,
} from '../dtos';
import { ITransactionAnalytics } from '../interfaces/transaction.interface';
import { JwtGuard } from '../../auth/guards/jwt.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

/**
 * Transaction Controller
 * Handles transaction CRUD operations and analytics
 */
@ApiTags('Transaction')
@Controller()
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  /**
   * Add a transaction (buy/sell) to investment
   */
  @Post('portfolios/:portfolioId/investments/:investmentId/transactions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add a transaction (buy/sell) to investment',
    description:
      'Record a buy or sell transaction for a specific investment. The amount should equal quantity * price.',
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
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Transaction details',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio or investment not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async createTransaction(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
    @Param('investmentId') investmentId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.createTransaction(
      req.user.userId,
      portfolioId,
      investmentId,
      createTransactionDto,
    );
  }

  /**
   * Get transaction analytics for portfolio
   * ⚠️ MUST come before @Get('portfolios/:portfolioId/transactions/:transactionId') to avoid route conflicts
   */
  @Get('portfolios/:portfolioId/transactions/analytics')
  @ApiOperation({
    summary: 'Get transaction analytics',
    description:
      'Retrieve comprehensive analytics for all transactions in a portfolio including buy/sell summaries and averages.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction analytics retrieved successfully',
    type: Object,
    schema: {
      properties: {
        totalTransactions: {
          type: 'number',
          example: 50,
          description: 'Total number of transactions',
        },
        totalBuyTransactions: {
          type: 'number',
          example: 30,
          description: 'Total buy transactions',
        },
        totalSellTransactions: {
          type: 'number',
          example: 20,
          description: 'Total sell transactions',
        },
        totalBuyAmount: {
          type: 'number',
          example: 150000,
          description: 'Total amount spent on buys',
        },
        totalSellAmount: {
          type: 'number',
          example: 180000,
          description: 'Total amount received from sells',
        },
        totalBuyQuantity: {
          type: 'number',
          example: 500,
          description: 'Total units bought',
        },
        totalSellQuantity: {
          type: 'number',
          example: 300,
          description: 'Total units sold',
        },
        averageBuyPrice: {
          type: 'string',
          example: '300.00',
          description: 'Average buy price per unit',
        },
        averageSellPrice: {
          type: 'string',
          example: '600.00',
          description: 'Average sell price per unit',
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
  async getAnalytics(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
  ): Promise<ITransactionAnalytics> {
    return this.transactionService.getTransactionAnalytics(
      req.user.userId,
      portfolioId,
    );
  }

  /**
   * Get all transactions in portfolio
   */
  @Get('portfolios/:portfolioId/transactions')
  @ApiOperation({
    summary: 'Get all transactions in portfolio',
    description:
      'Retrieve all transactions for a portfolio with pagination and optional filtering by type and date range.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by type (BUY/SELL)',
    enum: ['BUY', 'SELL'],
  })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    description: 'Filter from date (ISO 8601)',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    description: 'Filter to date (ISO 8601)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully with pagination',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { type: 'object' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
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
  async getPortfolioTransactions(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
    @Query() filterDto: FilterTransactionDto,
  ): Promise<unknown> {
    return this.transactionService.getTransactionsByPortfolio(
      req.user.userId,
      portfolioId,
      filterDto,
    );
  }

  /**
   * Get transactions for specific investment
   */
  @Get('portfolios/:portfolioId/investments/:investmentId/transactions')
  @ApiOperation({
    summary: 'Get transactions for specific investment',
    description:
      'Retrieve all transactions for a specific investment with pagination and optional filtering.',
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
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by type (BUY/SELL)',
    enum: ['BUY', 'SELL'],
  })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    description: 'Filter from date (ISO 8601)',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    description: 'Filter to date (ISO 8601)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Investment transactions retrieved successfully',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { type: 'object' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
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
  async getInvestmentTransactions(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
    @Param('investmentId') investmentId: string,
    @Query() filterDto: FilterTransactionDto,
  ): Promise<unknown> {
    return this.transactionService.getTransactionsByInvestment(
      req.user.userId,
      portfolioId,
      investmentId,
      filterDto,
    );
  }

  /**
   * Get transaction details by ID
   */
  @Get('portfolios/:portfolioId/transactions/:transactionId')
  @ApiOperation({
    summary: 'Get transaction details',
    description: 'Retrieve detailed information for a specific transaction.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'Portfolio ID',
    example: 'clnxx123xxx',
  })
  @ApiParam({
    name: 'transactionId',
    description: 'Transaction ID',
    example: 'clnxx789zzz',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction details retrieved successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this portfolio',
  })
  async getTransactionById(
    @Request() req: AuthenticatedRequest,
    @Param('portfolioId') portfolioId: string,
    @Param('transactionId') transactionId: string,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.getTransactionById(
      req.user.userId,
      portfolioId,
      transactionId,
    );
  }
}
