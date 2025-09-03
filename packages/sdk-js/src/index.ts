import { ethers, Contract, HDNodeWallet, JsonRpcProvider } from 'ethers';

export class IndoBlockForgeSDK {
  private provider: JsonRpcProvider;
  private wallet: HDNodeWallet;

  constructor(privateKey: string, providerUrl: string) {
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider) as HDNodeWallet;
  }

  async deployContract(bytecode: string, abi: any[], args: any[]): Promise<string> {
    try {
      const factory = new ethers.ContractFactory(abi, bytecode, this.wallet);
      const contract = await factory.deploy(...args);
      await contract.waitForDeployment();
      return contract.getAddress();
    } catch (error) {
      console.error("Deployment failed:", error);
      throw new Error(`Gagal melakukan deployment: ${error.message}`);
    }
  }

  getContractInstance(address: string, abi: any[]): Contract {
    return new ethers.Contract(address, abi, this.wallet);
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<bigint> {
    const abi = ["function balanceOf(address owner) view returns (uint256)"];
    const tokenContract = new ethers.Contract(tokenAddress, abi, this.provider);
    return tokenContract.balanceOf(walletAddress);
  }

  async transferToken(tokenAddress: string, recipientAddress: string, amount: string): Promise<ethers.TransactionResponse> {
    const abi = ["function transfer(address to, uint256 amount)"];
    const tokenContract = new ethers.Contract(tokenAddress, abi, this.wallet);
    const tx = await tokenContract.transfer(recipientAddress, ethers.parseEther(amount));
    return tx;
  }
}
