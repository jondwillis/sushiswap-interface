import { BigNumber } from '@ethersproject/bignumber'
import sushiData from '@sushiswap/sushi-data'
import { useActiveWeb3React } from 'hooks'
import { useBoringHelperContract } from 'hooks/useContract'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { exchange_matic, minichefv2_matic } from 'apollo/client'
import { getAverageBlockTime } from 'apollo/getAverageBlockTime'
import { liquidityPositionSubsetQuery, pairSubsetQuery, miniChefPoolQuery } from 'apollo/queries'
import { POOL_DENY } from '../../constants'
import Fraction from '../../entities/Fraction'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useFarms = () => {
    const [farms, setFarms] = useState<any | undefined>()
    const { account, chainId } = useActiveWeb3React()
    const boringHelperContract = useBoringHelperContract()

    const fetchAllFarms = useCallback(async () => {
        const results = await Promise.all([
            minichefv2_matic.query({
                query: miniChefPoolQuery
            }),
            exchange_matic.query({
                query: liquidityPositionSubsetQuery,
                variables: { user: String('0x0769fd68dFb93167989C6f7254cd0D766Fb2841F').toLowerCase() } //minichef
            }),
            getAverageBlockTime(chainId),
            sushiData.sushi.priceUSD()
        ])

        const pools = results[0]?.data.pools
        const pairAddresses = pools
            .map((pool: any) => {
                return pool.pair
            })
            .sort()
        const pairsQuery = await exchange_matic.query({
            query: pairSubsetQuery,
            variables: { pairAddresses }
        })

        const liquidityPositions = results[1]?.data.liquidityPositions
        const averageBlockTime = results[2]
        const sushiPrice = results[3]
        const pairs = pairsQuery?.data.pairs

        const farms = pools
            .filter((pool: any) => {
                //console.log(KASHI_PAIRS.includes(Number(pool.id)), pool, Number(pool.id))
                return !POOL_DENY.includes(pool?.id) && pairs.find((pair: any) => pair?.id === pool?.pair)
            })
            .map((pool: any) => {
                const pair = pairs.find((pair: any) => pair.id === pool.pair)
                const liquidityPosition = liquidityPositions.find(
                    (liquidityPosition: any) => liquidityPosition.pair.id === pair.id
                )
                const blocksPerHour = 3600 / averageBlockTime
                const balance = Number(pool.balance / 1e18) > 0 ? Number(pool.balance / 1e18) : 0.1
                const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
                const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
                const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
                const rewardPerSecond =
                    ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.sushiPerSecond) / 1e18
                const roiPerSecond = (rewardPerSecond * sushiPrice) / balanceUSD
                const roiPerHour = roiPerSecond * 3600
                const roiPerDay = roiPerHour * 24
                const roiPerMonth = roiPerDay * 30
                const roiPerYear = roiPerMonth * 12

                return {
                    ...pool,
                    type: 'SLP',
                    symbol: pair.token0.symbol + '-' + pair.token1.symbol,
                    name: pair.token0.name + ' ' + pair.token1.name,
                    pid: Number(pool.id),
                    pairAddress: pair.id,
                    slpBalance: pool.balance,
                    liquidityPair: pair,
                    roiPerSecond,
                    roiPerHour,
                    roiPerDay,
                    roiPerMonth,
                    roiPerYear,
                    rewardPerThousand: 1 * roiPerDay * (1000 / sushiPrice),
                    tvl: liquidityPosition?.liquidityTokenBalance
                        ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
                        : 0.1
                }
            })

        //console.log('farms:', farms)
        const sorted = _.orderBy(farms, ['pid'], ['desc'])

        const pids = sorted.map(pool => {
            return pool.pid
        })
        setFarms({ farms: sorted, userFarms: [] })
        // if (account) {
        //     const userFarmDetails = await boringHelperContract?.pollPools(account, pids)
        //     //console.log('userFarmDetails:', userFarmDetails)
        //     const userFarms = userFarmDetails
        //         .filter((farm: any) => {
        //             return farm.balance.gt(BigNumber.from(0)) || farm.pending.gt(BigNumber.from(0))
        //         })
        //         .map((farm: any) => {
        //             //console.log('userFarm:', farm.pid.toNumber(), farm)

        //             const pid = farm.pid.toNumber()
        //             const farmDetails = sorted.find((pair: any) => pair.pid === pid)
        //             const deposited = Fraction.from(farm.balance, BigNumber.from(10).pow(18)).toString(18)
        //             const depositedUSD =
        //                 farmDetails.slpBalance && Number(farmDetails.slpBalance / 1e18) > 0
        //                     ? (Number(deposited) * Number(farmDetails.tvl)) / (farmDetails.slpBalance / 1e18)
        //                     : 0
        //             const pending = Fraction.from(farm.pending, BigNumber.from(10).pow(18)).toString(18)

        //             return {
        //                 ...farmDetails,
        //                 type: farmDetails.type, // KMP or SLP
        //                 depositedLP: deposited,
        //                 depositedUSD: depositedUSD,
        //                 pendingSushi: pending
        //             }
        //         })
        //     setFarms({ farms: sorted, userFarms: userFarms })
        //     //console.log('userFarms:', userFarms)
        // } else {
        //     setFarms({ farms: sorted, userFarms: [] })
        // }
    }, [])

    useEffect(() => {
        fetchAllFarms()
    }, [fetchAllFarms])

    return farms
}

export default useFarms