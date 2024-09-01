import { Injectable } from '@nestjs/common';
import * as tokenJson from '../assets/MyToken.json';
import * as ballotTokenJson from '../assets/TokenizedBallot.json';
import {
  Address,
  createPublicClient,
  http,
  formatEther,
  TransactionReceipt,
  formatGwei,
  createWalletClient,
  parseEther,
  hexToString,
  formatUnits,
} from 'viem';
import { sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
  publicClient;
  walletClient;

  constructor(private configService: ConfigService) {
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });

    this.walletClient = createWalletClient({
      transport: http(process.env.RPC_ENDPOINT_URL),
      chain: sepolia,
      account: account,
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(): Address {
    return this.configService.get<Address>('TOKEN_ADDRESS');
  }

  getBallotContractAddress(): Address {
    return this.configService.get<Address>('BALLOT_TOKEN_ADDRESS');
  }

  async getTokenName(): Promise<Address> {
    const name = (await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'name',
    })) as Address;

    return name;
  }

  async getTotalSupply(): Promise<string> {
    const totalSupply = (await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'totalSupply',
    })) as bigint;

    return `${formatEther(totalSupply)} ETH`;
  }

  async getTokenBalance(address: string): Promise<string> {
    const balance = (await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'balanceOf',
      args: [address],
    })) as bigint;

    return `${formatEther(balance)} ETH`;
  }

  async getTransactionReceipt(hash: Address): Promise<any> {
    const receipt = (await this.publicClient.waitForTransactionReceipt({
      hash,
    })) as TransactionReceipt;

    console.log('receipt', receipt);

    return {
      ...receipt,
      blockNumber: `${formatGwei(receipt.blockNumber)} Gwei`,
      cumulativeGasUsed: `${formatGwei(receipt.blockNumber)} Gwei`,
      effectiveGasPrice: `${formatGwei(receipt.blockNumber)} Gwei`,
      gasUsed: `${formatGwei(receipt.blockNumber)} Gwei`,
      logs: receipt.logs.map((log) => ({
        ...log,
        blockNumber: `${formatGwei(log.blockNumber)} Gwei`,
      })),
    };
  }

  getServerWalletAddress(): string {
    return this.walletClient.account.address;
  }

  async checkMinterRole(address: string): Promise<boolean> {
    // const MINTER_ROLE =
    //   '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6';
    const MINTER_ROLE = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'MINTER_ROLE',
    });
    const hasRole = (await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'hasRole',
      args: [MINTER_ROLE, address],
    })) as boolean;

    return hasRole;
  }

  async mintTokens(address: string) {
    const hasRole = await this.checkMinterRole(address);

    if (!hasRole) {
      throw new Error('Address does not have minter role');
    }

    const receiptHash = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'mint',
      args: [address, parseEther('1000')],
    });

    const receipt = await this.getTransactionReceipt(receiptHash);

    return receipt;
  }

  async getProposals() {
    const proposalsPromise = Array.from({ length: 3 }).map((_, i) => {
      return this.publicClient.readContract({
        address: this.getBallotContractAddress(),
        abi: ballotTokenJson.abi,
        functionName: 'proposals',
        args: [i],
      }) as any;
    });

    const proposals = await Promise.all(proposalsPromise);

    return proposals.map((proposal) => ({
      name: hexToString(proposal[0], { size: 32 }),
      votesCount: Number(formatUnits(proposal[1], 0)),
    }));
  }

  async vote(proposalIndex: number, votesAmount: number) {
    const receiptHash = await this.walletClient.writeContract({
      address: this.getBallotContractAddress(),
      abi: ballotTokenJson.abi,
      functionName: 'vote',
      args: [proposalIndex, votesAmount],
    });

    const receipt = await this.getTransactionReceipt(receiptHash);

    return receipt;
  }

  async getWinnerProposal() {
    const winnerName = await this.publicClient.readContract({
      address: this.getBallotContractAddress(),
      abi: ballotTokenJson.abi,
      functionName: 'winnerName',
      args: [],
    });

    return hexToString(winnerName, { size: 32 });
  }
}
