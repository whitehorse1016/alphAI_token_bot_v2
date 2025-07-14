import Web3 from 'web3'
import { ethers } from "ethers";
import TelegramBot from 'node-telegram-bot-api'
import * as ethscan_api from './etherscan-api.js'
import dotenv from 'dotenv'
dotenv.config()
import * as filter from './filter.js'
const bot_token = '6166967707:AAF4CQkHlBsXszDpW_I9J3t8ZTj_hPw-zkM';
import * as uniconst from './uni-catch/const.js'
import * as utils from './utils.js'
import * as afx from './global.js'

import * as poolDetector from './pool_detector.js'

import {md5} from './md5.js'
import * as swapBot from './swap_bot.js'
import * as apiRepeater from './api_repeater.js'
import * as autoTrader from './auto_trader.js'

const options1 = {
	reconnect: {
		auto: true,
		delay: 5000, // ms
		maxAttempts: 5,
		onTimeout: false
	}
};

 const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://eth-mainnet.g.alchemy.com/v2/SadvOdqW64rOBKqx0xgju8t0T3DtHnTI', options1))
//const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://goerli.infura.io/ws/v3/8431de5261c440f48f8c5ce659c6980a', options1))



// let topHoldersMsg = ''
// let tokenHolderCount = 0
// if (tokenDetailInfo && tokenDetailInfo.holders && tokenDetailInfo.holders.holders) {
// 	tokenHolderCount = tokenDetailInfo.holders.holders.length
// 	let row = 0
// 	for (const holder of tokenDetailInfo.holders.holders) {
// 		row++

// 		if (row > 10) {
// 			break
// 		}
		
// 		topHoldersMsg += `${row}. ${utils.getShortenedAddress(holder.address)} | ${holder.percent}\n`
// 	}
// }

// let socialMsg = ''
// 		if (tokenDetailInfo && tokenDetailInfo.links && tokenDetailInfo.links.length > 0) {
// 			socialMsg = '\n<u>Social Info</u>'
// 			for (const link of tokenDetailInfo.links) {
// 				socialMsg += '\n'
// 				if (link.startsWith("https://t.me/")) {
// 					socialMsg += `<a href='${link}'>Telegram</a>`
// 				} else if (link.startsWith("https://twitter.com/")) {
// 					socialMsg += `<a href='${link}'>Twitter</a>`
// 				} else {
// 					socialMsg += `<a href='${link}'>${link}</a>`
// 				}
// 			}
// 		}


//poolDetector.testStart(web3) 
 //poolDetector.start(web3)
let json = {
   session : {
      chatid: '2116657656',
      username: 'Sparkleye',
      init_eth: 1,
      init_usd: 1000,
      block_threshold: 20,
      max_fresh_transaction_count: 0,
      min_fresh_wallet_count: 0,
      min_whale_balance: 0,
      min_whale_wallet_count: 0,
      min_kyc_wallet_count: 1,
      wallet: null,
      type: 'private',
      permit: 0,
      __v: 0,
      vip: 1,
      lp_lock: 0,
      honeypot: 0,
      contract_age: 0,
      min_dormant_wallet_count: 0,
      min_dormant_duration: 0,
      min_sniper_count: 25,
      slippage: 5,
      account: '0xa286407326247bF36750dDD98cd8Fa8065317866',
      pkey: '5cemwzKzmdTp3oO9oQhQKsf78AOv4tnTTvDkXEYc+80QzvYlLLsjj/n3Barz7eXWPE6N2pmVRnjN87sFzY4++1ZqZu6GB4BODMsmAkH16dA=',
      fee: 0
   },
   tokenAddress: '0xB48a0135ed5199Bfc7F3DB926370A24874f6Fe1b',
   ethAmount: 0.01
 }
 
import * as database from './db.js'
//  swapBot.sellTokenV2(database, json.session, json.tokenAddress, 0, 1.0, true, (msg) => {
//     console.log(msg)
//  })

//  swapBot.buyTokenV2(database, json.session, json.tokenAddress, 0.1, (msg) => {
//     console.log(msg)
//  })
//  let {topHoldersMsg, holderCount } = await utils.getTopHolders('0x1783B45672FBE64380077b0666065EB1D6793091')
//  console.log(topHoldersMsg)

//  let ownershipRenouncedMsg = ''
//  if (tokenDetailInfo && tokenDetailInfo.ownership) {
// 	 ownershipRenouncedMsg = '\n🔍 Ownership Renounced: ' + (to kenDetailInfo.ownership.renounced ? 'Yes' : 'No')
//  }

//  console.log(ownershipRenouncedMsg)
 //console.log(holderCount)

//87db4ac6fb1191c60d4285b04c566976
// let txReceipt = null;
// try {
//     txReceipt = await web3.eth.getTransactionReceipt('0xc96735a277a08aef3c46ced17f0bc578f679d90d915a95dff050372af5b2ccf6');
//     console.log(txReceipt.logs)


// } catch (error) {

// }

//const tokenDetailInfo = await utils.getTokenDetailInfo('0x039bEDA82FAAe2F124050306e96B9641AAA59144')

//const checksumForContract = await utils.getContractVerified(web3, '0x039bEDA82FAAe2F124050306e96B9641AAA59144')

//console.log(filter.getScamInfo(web3, json, checksumForContract))

//swapBot.start(database, bot)

// apiRepeater.start(web3)
// let delay = 1

// while (true) {
//    await apiRepeater.getTokenDetailInfo('0x039bEDA82FAAe2F124050306e96B9641AAA59144')

//    await utils.waitSeconds(delay++)
// }

import * as walletReporter from './wallet_reporter.js'

await database.init()
walletReporter.start(web3, database, null)

// import * as advUtils from './adv_utils.js'
// advUtils.getTokenPriceUniV2()
//advUtils.getTokenPriceUniV3()

//autoTrader.start(database, bot)