// apps/backend/src/modules/blockchain/blockchain.module.ts

import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [BlockchainController],
  providers: [BlockchainService, PrismaService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
