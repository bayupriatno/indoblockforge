import { Controller, Post, Body, UseGuards, Get, Param, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlockchainService } from './blockchain.service';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(AuthGuard('jwt'))
@Controller('blockchain')
export class BlockchainController {
  constructor(
    private blockchainService: BlockchainService,
    private prisma: PrismaService,
  ) {}

  @Post('deploy')
  async deployContract(@Body() body: { projectId: string, contractName: string, contractType: string, args: any[] }) {
    const { projectId, contractName, contractType, args } = body;
    const mockContractData = {
      ERC20: {
        bytecode: "0x6080...",
        abi: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }],
      },
      ERC721: {
        bytecode: "0x6080...",
        abi: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }],
      },
    };
    const { bytecode, abi } = mockContractData[contractType];
    const contractAddress = await this.blockchainService.deployContract(bytecode, abi, args);

    await this.prisma.contract.create({
      data: {
        projectId,
        name: contractName,
        address: contractAddress,
        abi: JSON.stringify(abi),
      },
    });
    return { message: "Kontrak berhasil di-deploy", address: contractAddress };
  }

  @Post('send-signed-tx')
  async sendTransaction(@Body('signedTx') signedTx: string, @Body('chain') chain: string) {
    const txHash = await this.blockchainService.sendSignedTransaction(signedTx, chain);
    return { message: "Transaction sent", txHash };
  }

  @Post('get-transaction-details')
  async getTxDetails(@Body('fromAddress') fromAddress: string, @Body('chain') chain: string) {
    const details = await this.blockchainService.getTransactionDetails(fromAddress, chain);
    return details;
  }

  @Get('analytics/:contractAddress')
  async getContractAnalytics(@Param('contractAddress') address: string) {
    try {
      const contract = await this.prisma.contract.findUnique({ where: { address } });
      if (!contract) throw new NotFoundException('Kontrak tidak ditemukan');

      const totalHolders = await this.blockchainService.getTotalHolders(address);
      const totalTransactions = await this.blockchainService.getTotalTransactions(address);

      return { totalHolders, totalTransactions };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
