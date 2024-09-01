import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import type { MintTokenDto } from './dtos/mintToken.d.ts';
import type { VoteDto } from './dtos/vote.d.ts';
import { Address } from 'viem';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contract-address')
  getContractAddress() {
    return { result: this.appService.getContractAddress() };
  }

  @Get('token-name')
  async getTokenName() {
    return { result: await this.appService.getTokenName() };
  }

  @Get('total-supply')
  async getTotalSupply() {
    return { result: await this.appService.getTotalSupply() };
  }

  @Get('token-balance/:address')
  async getTokenBalance(@Param('address') address: string) {
    return { result: await this.appService.getTokenBalance(address) };
  }

  @Get('transaction-receipt')
  async getTransactionReceipt(@Query('hash') hash: Address) {
    return { result: await this.appService.getTransactionReceipt(hash) };
  }

  @Get('server-wallet-address')
  getServerWalletAddress() {
    return { result: this.appService.getServerWalletAddress() };
  }

  @Get('check-minter-role')
  async checkMinterRole(@Query('address') address: string) {
    return { result: await this.appService.checkMinterRole(address) };
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokenDto) {
    return { result: await this.appService.mintTokens(body.address) };
  }

  @Get('proposals')
  async getProposals() {
    return { result: await this.appService.getProposals() };
  }

  @Post('vote')
  async vote(@Body() body: VoteDto) {
    return {
      result: await this.appService.vote(body.proposalIndex, body.votesAmount),
    };
  }

  @Get('winner-proposal')
  async getWinnerProposal() {
    return { result: await this.appService.getWinnerProposal() };
  }
}
