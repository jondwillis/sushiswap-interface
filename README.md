# Bao.finance Multi-Interface

[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for SushiSwap -- a protocol for decentralized exchange of Ethereum tokens.

- (Staging) Website: [bao2.netlify.com](https://bao2.netlify.com/)
- Interface: [bao2.netlify.com](https://bao2.netlify.com)
- Docs: [baofinance.gitbook.io](https://baofinance.gitbook.io)
- Twitter: [@BaoMan](https://twitter.com/thebaoman)
- Reddit: [/r/BaoFinance](https://www.reddit.com/r/SushiSwap)
- Discord: [Bao.finance](https://discord.gg/NE97etfU)

## Accessing the SushiSwap Interface

To access the Sushiswap Interface, use an IPFS gateway link from the
[latest release](https://github.com/jondwillis/sushiswap-interface/releases/latest),
or visit [bao.finance](https://bao.finance).

## Listing a token

Please see the
[@sushiswap/default-token-list](https://github.com/sushiswap/default-token-list)
repository.

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

Note that the interface only works on networks where both
[(Uni|Sushi)swap V2](https://github.com/sushiswap/sushiswap/tree/master/contracts/uniswapv2) and
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `master` branch.**
CI checks will run against all PRs.
