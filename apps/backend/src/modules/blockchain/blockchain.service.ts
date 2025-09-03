import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ethers, JsonRpcProvider, Contract } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlockchainService {
  private providers: { [chain: string]: JsonRpcProvider };
  private activeChain: string;

  constructor(private configService: ConfigService) {
    this.providers = {
      ethereum: new ethers.JsonRpcProvider(this.configService.get<string>('ETHEREUM_RPC_URL')),
      polygon: new ethers.JsonRpcProvider(this.configService.get<string>('POLYGON_RPC_URL')),
    };
    this.activeChain = 'ethereum';
  }

  setChain(chainName: string) {
    if (!this.providers[chainName]) {
      throw new Error(`Jaringan '${chainName}' tidak didukung.`);
    }
    this.activeChain = chainName;
  }

  getActiveProvider(): JsonRpcProvider {
    return this.providers[this.activeChain];
  }

  async sendSignedTransaction(signedTx: string, chainName: string): Promise<string> {
    try {
      this.setChain(chainName);
      const provider = this.getActiveProvider();
      const txResponse = await provider.broadcastTransaction(signedTx);
      return txResponse.hash;
    } catch (error) {
      throw new InternalServerErrorException(`Gagal mengirim transaksi di jaringan ${chainName}: ${error.message}`);
    }
  }

  async getTransactionDetails(fromAddress: string, chainName: string): Promise<any> {
    this.setChain(chainName);
    const provider = this.getActiveProvider();
    const nonce = await provider.getTransactionCount(fromAddress);
    const gasPrice = await provider.getFeeData();
    return { nonce, gasPrice: gasPrice.gasPrice };
  }

  async getTotalHolders(contractAddress: string): Promise<number> {
    return 10; // Placeholder
  }

  async getTotalTransactions(contractAddress: string): Promise<number> {
    return 500; // Placeholder
  }
}
