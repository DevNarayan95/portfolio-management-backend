// // src/modules/dashboard/controllers/dashboard.controller.ts
// import {
//   Controller,
//   Get,
//   Param,
//   UseGuards,
//   Request,
//   Query,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
//   ApiParam,
//   ApiQuery,
//   ApiHeader,
// } from '@nestjs/swagger';
// import { DashboardService } from '../services/dashboard.service';
// import {
//   DashboardSummaryDto,
//   PortfolioSummaryDto,
//   InvestmentPerformanceDto,
//   PortfolioAllocationDto,
// } from '../dtos';
// import { JwtGuard } from '../../auth/guards/jwt.guard';

// interface AuthenticatedRequest extends Request {
//   user: {
//     userId: string;
//   };
// }

// /**
//  * Dashboard Controller
//  * Provides portfolio analytics and performance metrics
//  */
// @ApiTags('Dashboard')
// @Controller('dashboard')
// @UseGuards(JwtGuard)
// @ApiBearerAuth('JWT-auth')
// export class DashboardController {
//   constructor(private dashboardService: DashboardService) {}

//   /**
//    * Get overall dashboard summary
//    */
//   @Get('summary')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Get overall dashboard summary',
//     description:
//       'Retrieve comprehensive dashboard summary across all portfolios including total investments, gains/losses, and asset breakdown.',
//   })
//   @ApiHeader({
//     name: 'Authorization',
//     description: 'Bearer token (access token)',
//     example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//     required: true,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Dashboard summary retrieved successfully',
//     type: DashboardSummaryDto,
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Unauthorized',
//   })
//   async getDashboardSummary(
//     @Request() req: AuthenticatedRequest,
//   ): Promise<DashboardSummaryDto> {
//     return this.dashboardService.getDashboardSummary(req.user.userId);
//   }

//   /**
//    * Get portfolio summary
//    */
//   @Get('portfolio/:portfolioId/summary')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Get portfolio summary',
//     description:
//       'Retrieve detailed summary for a specific portfolio including investments, performance, and asset allocation.',
//   })
//   @ApiParam({
//     name: 'portfolioId',
//     description: 'Portfolio ID',
//     example: 'clnxx123xxx',
//   })
//   @ApiHeader({
//     name: 'Authorization',
//     description: 'Bearer token (access token)',
//     example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//     required: true,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Portfolio summary retrieved successfully',
//     type: PortfolioSummaryDto,
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Portfolio not found',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Unauthorized',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Forbidden - No access to this portfolio',
//   })
//   async getPortfolioSummary(
//     @Request() req: AuthenticatedRequest,
//     @Param('portfolioId') portfolioId: string,
//   ): Promise<PortfolioSummaryDto> {
//     return this.dashboardService.getPortfolioSummary(
//       req.user.userId,
//       portfolioId,
//     );
//   }

//   /**
//    * Get all investment performances in portfolio
//    */
//   @Get('portfolio/:portfolioId/performance')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Get all investment performances in portfolio',
//     description:
//       'Retrieve performance metrics for all investments in a portfolio including gains/losses and transaction counts.',
//   })
//   @ApiParam({
//     name: 'portfolioId',
//     description: 'Portfolio ID',
//     example: 'clnxx123xxx',
//   })
//   @ApiHeader({
//     name: 'Authorization',
//     description: 'Bearer token (access token)',
//     example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//     required: true,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Investment performances retrieved successfully',
//     type: [InvestmentPerformanceDto],
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Portfolio not found',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Unauthorized',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Forbidden - No access to this portfolio',
//   })
//   async getPerformances(
//     @Request() req: AuthenticatedRequest,
//     @Param('portfolioId') portfolioId: string,
//   ): Promise<InvestmentPerformanceDto[]> {
//     return this.dashboardService.getInvestmentPerformances(
//       req.user.userId,
//       portfolioId,
//     );
//   }

//   /**
//    * Get portfolio asset allocation
//    */
//   @Get('portfolio/:portfolioId/allocation')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Get portfolio asset allocation',
//     description:
//       'Retrieve asset allocation breakdown showing percentage distribution across different investment types.',
//   })
//   @ApiParam({
//     name: 'portfolioId',
//     description: 'Portfolio ID',
//     example: 'clnxx123xxx',
//   })
//   @ApiHeader({
//     name: 'Authorization',
//     description: 'Bearer token (access token)',
//     example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//     required: true,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Asset allocation retrieved successfully',
//     type: PortfolioAllocationDto,
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Portfolio not found',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Unauthorized',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Forbidden - No access to this portfolio',
//   })
//   async getAllocation(
//     @Request() req: AuthenticatedRequest,
//     @Param('portfolioId') portfolioId: string,
//   ): Promise<PortfolioAllocationDto> {
//     return this.dashboardService.getPortfolioAllocation(
//       req.user.userId,
//       portfolioId,
//     );
//   }

//   /**
//    * Get top performing investments
//    */
//   @Get('portfolio/:portfolioId/top-performers')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Get top performing investments',
//     description:
//       'Retrieve the best performing investments sorted by gain/loss percentage.',
//   })
//   @ApiParam({
//     name: 'portfolioId',
//     description: 'Portfolio ID',
//     example: 'clnxx123xxx',
//   })
//   @ApiQuery({
//     name: 'limit',
//     required: false,
//     description: 'Number of results (default: 5)',
//     example: 5,
//   })
//   @ApiHeader({
//     name: 'Authorization',
//     description: 'Bearer token (access token)',
//     example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//     required: true,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Top performing investments retrieved successfully',
//     type: [InvestmentPerformanceDto],
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Portfolio not found',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Unauthorized',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Forbidden - No access to this portfolio',
//   })
//   async getTopPerformers(
//     @Request() req: AuthenticatedRequest,
//     @Param('portfolioId') portfolioId: string,
//     @Query('limit') limit: string = '5',
//   ): Promise<InvestmentPerformanceDto[]> {
//     return this.dashboardService.getTopPerformers(
//       req.user.userId,
//       portfolioId,
//       parseInt(limit, 10),
//     );
//   }

//   /**
//    * Get bottom performing investments
//    */
//   @Get('portfolio/:portfolioId/bottom-performers')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Get bottom performing investments',
//     description:
//       'Retrieve the worst performing investments sorted by gain/loss percentage.',
//   })
//   @ApiParam({
//     name: 'portfolioId',
//     description: 'Portfolio ID',
//     example: 'clnxx123xxx',
//   })
//   @ApiQuery({
//     name: 'limit',
//     required: false,
//     description: 'Number of results (default: 5)',
//     example: 5,
//   })
//   @ApiHeader({
//     name: 'Authorization',
//     description: 'Bearer token (access token)',
//     example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//     required: true,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Bottom performing investments retrieved successfully',
//     type: [InvestmentPerformanceDto],
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Portfolio not found',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Unauthorized',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Forbidden - No access to this portfolio',
//   })
//   async getBottomPerformers(
//     @Request() req: AuthenticatedRequest,
//     @Param('portfolioId') portfolioId: string,
//     @Query('limit') limit: string = '5',
//   ): Promise<InvestmentPerformanceDto[]> {
//     return this.dashboardService.getBottomPerformers(
//       req.user.userId,
//       portfolioId,
//       parseInt(limit, 10),
//     );
//   }
// }
