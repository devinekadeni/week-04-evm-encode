# Interaction of Vins (DiscordID: ehpf16)

1. Check server wallet address (my wallet address / deployer)
![](<./assets/1_check-server-wallet-address.png>)

2. Check current server wallet balance ![](<./assets/2_check-current-balance.png>)

3. Check minter role ![](<./assets/3_check-minter-role.png>)

4. Mint token to server wallet address based on [mintTokens code](https://github.com/devinekadeni/week-04-evm-encode/blob/main/backend/src/app.controller.ts#L51) ![](<./assets/4_mint-token-1.png>) ![](<./assets/4_mint-token-2.png>)

5. Recheck current balance (increased 1000 ETH) ![](<./assets/5_recheck-current-balance.png>)

6. Check current proposals based on [getProposals code](https://github.com/devinekadeni/week-04-evm-encode/blob/main/backend/src/app.controller.ts#L56) ![](<./assets/6_check-current-proposal.png>)

7. Cast vote proposal based on [vote code](https://github.com/devinekadeni/week-04-evm-encode/blob/main/backend/src/app.controller.ts#L61). <br><b>NOTE</b>: already self-delegate on-chain ![](<./assets/7_vote-proposal-1.png>) ![](<./assets/7_vote-proposal-2.png>)

8. Recheck current proposals ![](<./assets/8_recheck-current-proposal.png>)

9. Check winning proposal based on [getWinnerProposal code](https://github.com/devinekadeni/week-04-evm-encode/blob/main/backend/src/app.controller.ts#L68) ![](<./assets/9_check-winning-proposal.png>)

10. Display proposal name and votes count in frontend using [this FE code](https://github.com/devinekadeni/week-04-evm-encode/blob/main/frontend/packages/nextjs/app/page.tsx#L302) and [this BE code](https://github.com/devinekadeni/week-04-evm-encode/blob/main/backend/src/app.controller.ts#L56) ![](<./assets/10_display-proposal-frontend.png>)
