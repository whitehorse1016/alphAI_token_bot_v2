import * as utils from './utils.js'
import { UNISWAP_V2_ROUTER_ABI } from "./abi/uniswapv2-router-abi.js"
import { UNISWAP_V3_ROUTER_ABI } from "./abi/uniswapv3-router-abi.js"
import * as uniconst from './uni-catch/const.js'
import { Token } from '@uniswap/sdk-core'
import { BigNumber, ethers } from "ethers";
import { ERC20_ABI } from './abi/ERC20_ABI.js'

import dotenv from 'dotenv'
dotenv.config()

import * as swapBot from './swap_bot.js'
const INTERVAL = 1000 * 60
export const autoSwap_Buy = async (database, session, tokenAddress, buyAmount, sendMsg) => {

    if (!session.pkey) {
        sendMsg(`❗ AutoBuy failed: No wallet attached.`)
        return false
    }

    swapBot.buyTokenV2(database, session, tokenAddress, buyAmount, sendMsg)
}

export const autoSwap_Sell_thread = async (database, bot) => {

    const autoTradeTokens = await database.selectAutoTradeTokens({})

    for (const token of autoTradeTokens) {
        const predictPrice = await utils.getTokenPriceInETH(token.address)

        if (predictPrice === 0) {
            continue
        }

        const session = bot.sessions.get(token.chatid)
        if (!session) {
            continue
        }

        if (predictPrice >= session.autosell_hi * token.price) {

            swapBot.sellTokenV2(database, session, tokenAddress, 0, session.autosell_hi_amount, true, (msg) => {
                bot.sendMessage(session.chatid, msg)
                console.log(session.chatid, msg)
            })

        } else if (predictPrice <= session.autosell_lo * token.price) {

            swapBot.sellTokenV2(database, session, tokenAddress, 0, session.autosell_lo_amount, true, (msg) => {
                bot.sendMessage(session.chatid, msg)
                //console.log(session.chatid, msg)
            })
        }
    }

    setTimeout(() => {
        autoSwap_Sell_thread(database, bot)
    }
    , INTERVAL)
}

export const start = async (database, bot) => {

    console.log('AutoTrader daemon has been started...')

    setTimeout(() => {
        autoSwap_Sell_thread(database, bot)
    }
    , INTERVAL)
}