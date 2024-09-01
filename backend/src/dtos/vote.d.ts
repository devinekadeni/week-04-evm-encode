import { ApiProperty } from '@nestjs/swagger';

export class VoteDto {
  @ApiProperty({ type: number, required: true, default: 0 })
  proposalIndex: number;
  @ApiProperty({ type: number, required: true, default: 0 })
  votesAmount: number;
}
