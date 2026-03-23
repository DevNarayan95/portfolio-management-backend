import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssetsService } from './assets.service';

/**
 * Dashboard Controller
 * Provides portfolio analytics and performance metrics
 */
@ApiTags('Assets')
@Controller('Assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  /**
   * Get overall assets summary
   */
  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get overall assets summary',
    description:
      'Retrieve comprehensive assets summary across all portfolios including total investments, gains/losses, and asset breakdown.',
  })
  @ApiResponse({
    status: 200,
    description: 'Assets are retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getAllAssets(): any {
    return this.assetsService.getAllAssets();
  }
}
