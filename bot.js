import TelegramBot from 'node-telegram-bot-api'

import assert from 'assert';
import dotenv from 'dotenv'
dotenv.config()

import * as database from './db.js'

import * as privateBot from './bot_private.js'
import * as groupBot from './bot_group.js'
import * as afx from './global.js'

import * as callHistory from './call_history.js'
import {md5} from './md5.js'

const token = process.env.BOT_TOKEN
export const bot = new TelegramBot(token, 
	{ 
		polling: true
	})

export const myInfo = await bot.getMe();

export const sessions = new Map()
export const stateMap = new Map()

export const MIN_COMUNITY_TOKEN_AMOUNT = process.env.MIN_COMUNITY_TOKEN_AMOUNT

export const COMMAND_START = 'start'
export const COMMAND_LOGIN = 'login'
export const COMMAND_CURRENT_SETTING = 'currentsettings'
export const COMMAND_SET_SETTING = 'setsettings'
export const COMMAND_CANCEL = 'cancel'
export const COMMAND_DIRECT = 'direct'
export const COMMAND_DIRECTALL = 'directall'
export const COMMAND_DIRECTNONLOGIN = 'directnon'
export const COMMAND_GAINER = 'topgainer'
export const COMMAND_TEST_LP = 'test_lp'
export const COMMAND_TEST_HP = 'test_hp'
export const COMMAND_TEST_TOKENDEPLOYDATE = 'test_tokendeploydate'
export const COMMAND_STARTKICK = 'startkick'
export const COMMAND_STOPKICK = 'stopkick'
export const COMMAND_MYACCOUNT = 'myaccount'

export const OPTION_MAIN_SETTING = 0
export const OPTION_SET_FRESH_WALLET_SETTING = 1
export const OPTION_SET_FRESH_WALLET_TURN_ON = 2
export const OPTION_SET_FRESH_WALLET_TURN_OFF = 3

export const OPTION_SET_WHALE_WALLET_SETTING = 4
export const OPTION_SET_WHALE_WALLET_TURN_ON = 5
export const OPTION_SET_WHALE_WALLET_TURN_OFF = 6

export const OPTION_SET_KYC_WALLET_SETTING = 7
export const OPTION_SET_KYC_WALLET_TURN_ON = 8
export const OPTION_SET_KYC_WALLET_TURN_OFF = 9

export const OPTION_SET_INIT_LIQUIDITY = 10
export const OPTION_SET_INIT_LIQUIDITY_ETH = 11
export const OPTION_SET_INIT_LIQUIDITY_USD = 12
export const OPTION_SET_DTGS = 13
export const OPTION_DTGS_SELECT_DEX = 14
export const OPTION_DTGS_INPUT_TOKEN_ADDRESS = 15
export const OPTION_DTGS_SHOW_TOKENS = 16
export const OPTION_DTGS_DELETE_TOKEN = 17
export const OPTION_DTGS_DELETE_ALL_TOKEN = 18
export const OPTION_SET_DEFAULT = 19
export const OPTION_GET_ALL_SETTING = 20
export const OPTION_SET_LPLOCK = 21
export const OPTION_SET_LPLOCK_TURN_OFF = 22
export const OPTION_SET_LPLOCK_TURN_ON = 23
export const OPTION_SET_HONEYPOT = 24
export const OPTION_SET_HONEYPOT_TURN_OFF = 25
export const OPTION_SET_HONEYPOT_TURN_ON = 26
export const OPTION_SET_CONTRACT_AGE = 27
export const OPTION_SET_CONTRACT_AGE_PLUS0_1DAY = 28
export const OPTION_SET_CONTRACT_AGE_PLUS1DAY = 29
export const OPTION_SET_CONTRACT_AGE_PLUS1MONTH = 30
export const OPTION_SET_CONTRACT_AGE_PLUS1YEAR = 31
export const OPTION_SET_CONTRACT_AGE_PLUSNUMBERDAYS = 32
export const OPTION_SET_CONTRACT_AGE_TURN_OFF = 33
export const OPTION_SET_DORMANT = 34
export const OPTION_SET_DORMANT_PLUS1MONTH = 35
export const OPTION_SET_DORMANT_PLUS3MONTH = 36
export const OPTION_SET_DORMANT_PLUS6MONTH = 37
export const OPTION_SET_DORMANT_PLUS1YEAR = 38
export const OPTION_SET_DORMANT_TURN_OFF = 39
export const OPTION_SET_SNIPER_DETECTOR = 40
export const OPTION_SET_SNIPER_DETECTOR_TURN_ON = 41
export const OPTION_SET_SNIPER_DETECTOR_TURN_OFF = 42
export const OPTION_SET_USER_WALLET_SETTING = 43
export const OPTION_SET_USER_WALLET_ON = 44
export const OPTION_SET_USER_WALLET_OFF = 45
export const OPTION_SET_USER_SLIPPAGE = 46
export const OPTION_SET_USER_SELL_SETTING = 47
export const OPTION_SET_USER_BUY_SETTING = 48
export const OPTION_SET_USER_BUY_AUTO = 49
export const OPTION_SET_USER_SELL_AUTO = 50
export const OPTION_SET_USER_SELL_HI = 51
export const OPTION_SET_USER_SELL_LO = 52
export const OPTION_SET_USER_SELL_HI_DELETE = 53
export const OPTION_SET_USER_SELL_LO_DELETE = 54
export const OPTION_SET_USER_SELL_HI_AMOUNT = 55
export const OPTION_SET_USER_SELL_LO_AMOUNT = 56
export const OPTION_SET_USER_SELL_HI_AMOUNT_DELETE = 57
export const OPTION_SET_USER_SELL_LO_AMOUNT_DELETE = 58
export const OPTION_SET_USER_WALLET_GENERATE = 59
export const OPTION_SET_USER_BUY_AMOUNT = 60
export const OPTION_SET_USER_BUY_AMOUNT_DELETE = 61
export const OPTION_SET_USER_SELL_TOKEN_ADD = 62
export const OPTION_SET_USER_SELL_TOKEN_SHOW = 63
export const OPTION_SET_USER_SELL_TOKEN_REMOVE = 64
export const OPTION_SET_USER_SELL_TOKEN_REMOVEALL = 65
export const OPTION_BACK = -1

export const OPTION_MSG_COPY_ADDRESS = 100
export const OPTION_MSG_MORE_INFO = 101
export const OPTION_MSG_BACK_INFO = 102

export const OPTION_MSG_BUY_ETH_0_05 = 110
export const OPTION_MSG_BUY_ETH_0_1 = 111
export const OPTION_MSG_BUY_ETH_0_5 = 112
export const OPTION_MSG_BUY_ETH_X = 113

export const OPTION_MSG_SELL_ETH_0_25 = 114
export const OPTION_MSG_SELL_ETH_0_50 = 115
export const OPTION_MSG_SELL_ETH_0_100 = 116
export const OPTION_MSG_SELL_ETH_X = 117

export const STATE_IDLE = 0
export const STATE_WAIT_FRESH_WALLET_MAX_TRANSACTION_COUNT = 1
export const STATE_WAIT_MIN_FRESH_WALLET_COUNT = 2
export const STATE_WAIT_WHALE_WALLET_MIN_BALANCE = 3
export const STATE_WAIT_MIN_WHALE_WALLET_COUNT = 4
export const STATE_WAIT_MIN_KYC_WALLET_COUNT = 5
export const STATE_WAIT_INIT_ETH = 6
export const STATE_WAIT_INIT_USDT_USDC = 7
export const STATE_WAIT_DAILY_STATISTIC_TOKEN_ADDRESS = 8
export const STATE_WAIT_MIN_DORMANT_WALLET_COUNT = 9
export const STATE_WAIT_SET_DEFAULT = 10
export const STATE_WAIT_MIN_SNIPER_COUNT = 11
export const STATE_WAIT_MIN_CONTRACT_AGE = 12
export const STATE_WAIT_SET_USER_WALLET_PRIVATEKEY = 13
export const STATE_WAIT_SET_USER_SLIPPAGE = 14
export const STATE_WAIT_SET_ETH_X_SWAP = 15
export const STATE_WAIT_SET_TOKEN_X_SWAP = 16

export const STATE_WAIT_SET_USER_SELL_HI = 17
export const STATE_WAIT_SET_USER_SELL_LO = 18

export const STATE_WAIT_SET_USER_SELL_HI_AMOUNT = 19
export const STATE_WAIT_SET_USER_SELL_LO_AMOUNT = 20
export const STATE_WAIT_SET_USER_BUY_AMOUNT = 21
export const STATE_WAIT_ADD_AUTOTRADETOKEN = 22


export const stateMap_set = (chatid, state, data = {}) => {
	stateMap.set(chatid, {state, data})
}

export const stateMap_get = (chatid) => {
	return stateMap.get(chatid)
}

export const stateMap_remove = (chatid) => {
	stateMap.delete(chatid)
}

export const stateMap_clear = () => {
	stateMap.clear()
}

const json_buttonItem = (key, cmd, text) => {
	return {
		text: text,
		callback_data: JSON.stringify({ k: key, c: cmd }),
	}
}

export const json_msgOption = (sessionId, tokenAddress, poolAddress, poolId, isMoreInfo) => {

	const hashCode = md5(poolAddress)
	let json =  [
		[
			json_buttonItem(tokenAddress, OPTION_MSG_COPY_ADDRESS, 'Copy Address'),
			isMoreInfo ? json_buttonItem(`${sessionId}:${hashCode}`, OPTION_MSG_MORE_INFO, 'More Info') : json_buttonItem(`${sessionId}:${hashCode}`, OPTION_MSG_BACK_INFO, 'Back')
			// json_buttonItem(sessionId + ':' + poolAddress, OPTION_MSG_MORE_INFO, 'More Info')
		],
	]

	json.push([
		json_buttonItem(`${sessionId}:${poolId}`, OPTION_MSG_BUY_ETH_0_05, 'Buy 0.05 Eth'),
		json_buttonItem(`${sessionId}:${poolId}`, OPTION_MSG_BUY_ETH_0_1, 'Buy 0.1 Eth'),
		json_buttonItem(`${sessionId}:${poolId}`, OPTION_MSG_BUY_ETH_0_5, 'Buy 0.5 Eth'),
		json_buttonItem(`${sessionId}:${poolId}`, OPTION_MSG_BUY_ETH_X, 'Buy X Eth'),
	])

	json.push([
		json_buttonItem(`${sessionId}:${poolId}`, OPTION_MSG_SELL_ETH_0_25, 'Sell 25 %'),
		json_buttonItem(`${sessionId}:${poolId}`, OPTION_MSG_SELL_ETH_0_50, 'Sell 50 %'),
		json_buttonItem(`${sessionId}:${poolId}`, OPTION_MSG_SELL_ETH_0_100, 'Sell 100 %'),
		json_buttonItem(`${sessionId}:${poolId}`, OPTION_MSG_SELL_ETH_X, 'Sell X %'),
	])

	return { title: '', options: json };
}

export const json_botSettings = (sessionId) => {
	const json =  [
		[
			json_buttonItem(sessionId, OPTION_SET_INIT_LIQUIDITY, '💧 Initial Liquidty Threshold')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_FRESH_WALLET_SETTING, '☘️ Fresh Wallets Threshold')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_WHALE_WALLET_SETTING, '🐋 Whale Wallets Threshold')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_KYC_WALLET_SETTING, '📝 KYC Wallets Threshold')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_DORMANT, '👴 Dormant Wallets Filter')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_LPLOCK, '🔒 LP Lock Filter')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_HONEYPOT, '🍯 Honeypot Filter')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_CONTRACT_AGE, '⌛ Contract Age Filter')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_DTGS, '📈 ROI Statistics')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_SNIPER_DETECTOR, '🔎 Snipe Volume Detector')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_USER_WALLET_SETTING, '🕋 Swap Setting')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_DEFAULT, '🔁 Reset back to default')
		],
		
	]

  return { title: '', options: json };
}

async function switchMenu(chatId, messageId, json_buttons) {

	const keyboard = {
	  inline_keyboard: json_buttons,
	  resize_keyboard: true,
	  one_time_keyboard: true,
	  force_reply: true
	};

	await bot.editMessageReplyMarkup(keyboard, { chat_id: chatId, message_id: messageId })
}

async function switchMenuWithTitle(chatId, messageId, title, json_buttons) {

	const keyboard = {
	  inline_keyboard: json_buttons,
	  resize_keyboard: true,
	  one_time_keyboard: true,
	  force_reply: true
	};

	try {

		await bot.editMessageText(title, {chat_id: chatId, message_id: messageId, reply_markup: keyboard })

	} catch (error) {
		afx.error_log('[switchMenuWithTitle]', error)
	}
}

async function editAnimationMessageCaption(chatId, messageId, title, json_buttons) {

	const keyboard = {
	  inline_keyboard: json_buttons,
	  resize_keyboard: true,
	  one_time_keyboard: true,
	  force_reply: true
	};

	try {

		//protect_content: true, 
		await bot.editMessageCaption(title, {chat_id: chatId, message_id: messageId, parse_mode: 'HTML', disable_web_page_preview :true, reply_markup: keyboard })

	} catch (error) {
		afx.error_log('[switchMenuWithTitle]', error)
	}
}

export async function openMenu(chatId, menuTitle, json_buttons) {

	const keyboard = {
	  inline_keyboard: json_buttons,
	  resize_keyboard: true,
	  one_time_keyboard: true,
	  force_reply: true
	};

	await bot.sendMessage(chatId, menuTitle, {reply_markup: keyboard});
}

export const get_menuTitle = (sessionId, subTitle) => {

  const session = sessions.get(sessionId)
  if (!session) {
    return ''
  }

  let result = session.type === 'private' ? `@${session.username}'s configuration setup` : `@${session.username} group's configuration setup`

  if (subTitle && subTitle !== '') {

    //subTitle = subTitle.replace('%username%', `@${session.username}`)
    result += `\n${subTitle}`
  }
  
  return result
}

const json_setDTGS = (sessionId) => {
	const json = [
		[
			// json_buttonItem(sessionId, OPTION_DTGS_SELECT_DEX, 'Add a token address')
			json_buttonItem(sessionId, OPTION_DTGS_INPUT_TOKEN_ADDRESS, 'Add a token address')
		],
		[
			json_buttonItem(sessionId, OPTION_DTGS_SHOW_TOKENS, 'Remove token addresses')
		],
		[
			json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
		],
	]

  return { title: '⬇️ Choose one for daily top gainer statistics setup', options: json };
}


const json_showAutoTradeTokensOption = async (sessionId) => {

	const tokens = await database.getAutoTradeTokens(sessionId)

	let json = [];
	for (const token of tokens) {

    	json.push([json_buttonItem(`${sessionId}:${token._id.toString()}`, OPTION_SET_USER_SELL_TOKEN_REMOVE, `${token.address} [${token.symbol}]`)])
	}

	json.push([json_buttonItem(sessionId, OPTION_SET_USER_SELL_TOKEN_REMOVEALL, 'Remove All Tokens')])
	json.push([json_buttonItem(sessionId, OPTION_SET_USER_SELL_SETTING, 'Back')])

	return { title: '⬇️ Click any item to remove the token address you want to remove', options: json };
}

// const json_selectDexOption = (sessionId) => {

// 	let json = [];

// 	for (const dex of afx.dexList) {
// 		json.push([json_buttonItem(`${sessionId}:${dex.id}`, OPTION_DTGS_INPUT_TOKEN_ADDRESS, dex.title)])
// 	}

//   json.push([json_buttonItem(`${sessionId}`, OPTION_SET_DTGS, 'Back')])

// 	return { title: '⬇️ Please choose one of below DEXs', options: json };
// }

const json_sellOption = async (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	let json = [];

	json.push([json_buttonItem(sessionId, OPTION_SET_USER_SELL_AUTO, session.autosell ? '✅ Auto Sell' : '❌ Auto Sell')])
	json.push([
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_HI, '✏️ Sell-Hi'),
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_HI_DELETE, '⌫ Sell-Hi')
	])

	json.push([
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_LO, '✏️ Sell-Lo'),
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_LO_DELETE, '⌫ Sell-Lo')
	])

	json.push([
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_HI_AMOUNT, '✏️ Sell-Hi Amount'),
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_HI_AMOUNT_DELETE, '⌫ Sell-Hi Amount')
	])

	json.push([
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_LO_AMOUNT, '✏️ Sell-Lo Amount'),
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_LO_AMOUNT_DELETE, '⌫ Sell-Lo Amount')
	])

	json.push([
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_TOKEN_ADD, 'Add Contract address'),
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_TOKEN_SHOW, 'Remove Contract address')
	])

	json.push([json_buttonItem(sessionId, OPTION_SET_USER_WALLET_SETTING, 'Back')])

	return { title: '⬇️ Click the button for sell options', options: json };
}

const json_buyOption = async (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	let json = [];

	json.push([json_buttonItem(sessionId, OPTION_SET_USER_BUY_AUTO, session.autobuy ? '✅ Auto Buy' : '❌ Auto Buy')])
	
	json.push([
		json_buttonItem(sessionId, OPTION_SET_USER_BUY_AMOUNT, '✏️ Buy ETH Amount'),
		json_buttonItem(sessionId, OPTION_SET_USER_BUY_AMOUNT_DELETE, '⌫ Buy ETH Amount'),
	])
	json.push([json_buttonItem(sessionId, OPTION_SET_USER_WALLET_SETTING, 'Back')])

	return { title: '⬇️ Click the button for buy options', options: json };
}

const json_showTokensOption = async (sessionId) => {

	const tokens = await database.getTokens(sessionId)

	let json = [];
	for (const token of tokens) {

    	json.push([json_buttonItem(token._id.toString(), OPTION_DTGS_DELETE_TOKEN, `${token.address} [${token.symbol}]`)])
	}

	json.push([json_buttonItem(sessionId, OPTION_DTGS_DELETE_ALL_TOKEN, 'Remove All Tokens')])
	json.push([json_buttonItem(sessionId, OPTION_SET_DTGS, 'Back')])

	return { title: '⬇️ Click the button to remove the token you want', options: json };
}

const json_setFresh = (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	// const json = [
	// 	[
	// 		json_buttonItem(sessionId, OPTION_SET_FRESH_WALLET_TURN_ON, 'Turn on')
	// 	],
	// 	[
	// 		json_buttonItem(sessionId, OPTION_SET_FRESH_WALLET_TURN_OFF, 'Turn off')
	// 	],
	// 	[
	// 		json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
	// 	],
	// ]

	let json = []

	if (session.min_fresh_wallet_count) {
		json.push([
			json_buttonItem(sessionId, OPTION_SET_FRESH_WALLET_TURN_OFF, 'Turn off')
		])
	} else {
		json.push([
			json_buttonItem(sessionId, OPTION_SET_FRESH_WALLET_TURN_ON, 'Turn on')
		])
	}

	json.push([
		json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
	])

  return { title: `⬇️ Choose below option for fresh wallets ${(session.min_fresh_wallet_count ? '[Turned on: Wallet count >= ' + session.min_fresh_wallet_count + ', Transansaction count <= ' + session.max_fresh_transaction_count + ']' :'[Turned Off]')}`, options: json };
}

const json_setInitLiquidity = (sessionId) => {
	const json = [
		[
			json_buttonItem(sessionId, OPTION_SET_INIT_LIQUIDITY_ETH, 'Set the minimum ETH balance')
		],
		[
			json_buttonItem(sessionId, OPTION_SET_INIT_LIQUIDITY_USD, 'Set the minimum USDT or USDC balance')
		],
		[
			json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
		],
	]

  return { title: '⬇️ Choose below options for initial liquidity', options: json };
}

const json_setLPLock = (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	const json = [
		[
			json_buttonItem(sessionId, session.lp_lock ? OPTION_SET_LPLOCK_TURN_OFF : OPTION_SET_LPLOCK_TURN_ON, session.lp_lock ? 'Turn off LP Lock Filter' :'Turn on LP Lock Filter' )
		],
		[
			json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
		],
	]

  return { title: `⬇️ Choose below option for LP lock filter. ${(session.lp_lock ? '[LP = Locked]' :'[LP = All]')}`, options: json };
}

const json_setHoneypot = (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	const json = [
		[
			json_buttonItem(sessionId, session.honeypot ? OPTION_SET_HONEYPOT_TURN_OFF : OPTION_SET_HONEYPOT_TURN_ON, session.honeypot ? 'Turn off Honeypot Filter' :'Turn on Honeypot Filter' )
		],
		[
			json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
		],
	]

  return { title: `⬇️ Choose below option for Honeypot filter. ${(session.honeypot ? '[Honeypot = No]' :'[Honeypot = All]')}`, options: json };
}

const json_setContractAge = (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	let json = []
	let desc = ''

	if (session.contract_age && session.contract_age !== 0) {

		// const vY = session.contract_age / 365
		// const vM = (session.contract_age % 365 ) / session.contract_age / 30
		// const vD = (session.contract_age % 30 )

		// desc = 'More than '

		// if (vY > 0) {
		// 	desc += `${vY} year`
		// }

		// if (vM > 0) {
		// 	desc += `${vM} month`
		// }

		// if (vD > 0) {
		// 	desc += `${vD} day`
		// }

		desc = `${session.contract_age}+ days`

		json.push([json_buttonItem(sessionId, OPTION_SET_CONTRACT_AGE_TURN_OFF, 'Turn off Contract Age Filter')])

	} else {

		desc = 'Off'

		json.push([json_buttonItem(sessionId, OPTION_SET_CONTRACT_AGE_PLUS0_1DAY, '0.1+ Day')])
		json.push([json_buttonItem(sessionId, OPTION_SET_CONTRACT_AGE_PLUS1DAY, '1+ Day')])
		json.push([json_buttonItem(sessionId, OPTION_SET_CONTRACT_AGE_PLUS1MONTH, '1+ Month')])
		json.push([json_buttonItem(sessionId, OPTION_SET_CONTRACT_AGE_PLUS1YEAR, '1+ Year')])
		json.push([json_buttonItem(sessionId, OPTION_SET_CONTRACT_AGE_PLUSNUMBERDAYS, 'Custom')])
	}

	json.push([json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')])
  	return { title: `⬇️ Choose below option for Contract Age filter. [${desc}]`, options: json };
}

const json_setDormant = (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	let json = []
	let desc = ''

	if (session.min_dormant_wallet_count > 0) {

		desc = `${session.min_dormant_duration}+ months,  ${session.min_dormant_wallet_count} wallets`

		json.push([json_buttonItem(sessionId, OPTION_SET_DORMANT_TURN_OFF, 'Turn off Dormant wallet Filter')])

	} else {

		desc = 'Off'

		json.push([json_buttonItem(sessionId, OPTION_SET_DORMANT_PLUS1MONTH, '1+ Month')])
		json.push([json_buttonItem(sessionId, OPTION_SET_DORMANT_PLUS3MONTH, '3+ Months')])
		json.push([json_buttonItem(sessionId, OPTION_SET_DORMANT_PLUS6MONTH, '6+ Months')])
		json.push([json_buttonItem(sessionId, OPTION_SET_DORMANT_PLUS1YEAR, '1+ Year')])
	}

	json.push([json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')])
  	return { title: `⬇️ Choose below option for Dormant wallet filter. [${desc}]`, options: json };
}

const json_setSniperDetector = (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	let json = []
	let desc = ''

	if (session.min_sniper_count > 0) {

		desc = `More than ${session.min_sniper_count} snipers`

		json.push([json_buttonItem(sessionId, OPTION_SET_SNIPER_DETECTOR_TURN_OFF, 'Turn off')])

	} else {

		desc = 'Off'

		json.push([json_buttonItem(sessionId, OPTION_SET_SNIPER_DETECTOR_TURN_ON, 'Turn on')])
	}

	json.push([json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')])
  	return { title: `⬇️ Choose below option for Sniper Detector. [${desc}]`, options: json };
}


const json_setWhale = (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	// const json = [
	// 	[
	// 		json_buttonItem(sessionId, OPTION_SET_WHALE_WALLET_TURN_ON, 'Turn on')
	// 	],
	// 	[
	// 		json_buttonItem(sessionId, OPTION_SET_WHALE_WALLET_TURN_OFF, 'Turn off')
	// 	],
	// 	[
	// 		json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
	// 	],
	// ]

	let json = []

	if (session.min_whale_wallet_count) {
		json.push([
			json_buttonItem(sessionId, OPTION_SET_WHALE_WALLET_TURN_OFF, 'Turn off')
		])
	} else {
		json.push([
			json_buttonItem(sessionId, OPTION_SET_WHALE_WALLET_TURN_ON, 'Turn on')
		])
	}

	json.push([
		json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
	])

  return { title: `⬇️ Choose below option for whale wallets ${(session.min_whale_wallet_count ? '[Turned on: Wallet count >= ' + session.min_whale_wallet_count + ', balance >= ' + session.min_whale_balance + ']' :'[Turned Off]')}`, options: json };
}

const json_setKyc = (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}
	
  	let json = []

	if (session.min_kyc_wallet_count) {
		json.push([
			json_buttonItem(sessionId, OPTION_SET_KYC_WALLET_TURN_OFF, 'Turn off')
		])
	} else {
		json.push([
			json_buttonItem(sessionId, OPTION_SET_KYC_WALLET_TURN_ON, 'Turn on')
		])
	}

	json.push([
		json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
	])

  return { title: `⬇️ Choose below option for kyc wallet filter ${(session.min_kyc_wallet_count ? '[Turned on: Wallet count >= ' + session.min_kyc_wallet_count + ']' :'[Turned Off]')}`, options: json };
}

const json_setUserwallet = (sessionId) => {

	const session = sessions.get(sessionId)
	if (!session) {
		return null
	}

	let json = []

	if (session.pkey) {
		json.push([
			json_buttonItem(sessionId, OPTION_SET_USER_WALLET_OFF, 'Remove user wallet')
		])
	} else {
		json.push([
			json_buttonItem(sessionId, OPTION_SET_USER_WALLET_ON, 'Set / Change user wallet')
		])

		json.push([
			json_buttonItem(sessionId, OPTION_SET_USER_WALLET_GENERATE, 'Generate new wallet')
		])
	}

	json.push([
		json_buttonItem(sessionId, OPTION_SET_USER_SLIPPAGE, 'Set Slippage')
	])

	json.push([
		json_buttonItem(sessionId, OPTION_SET_USER_BUY_SETTING, '⚙️ Buy')
	])

	json.push([
		json_buttonItem(sessionId, OPTION_SET_USER_SELL_SETTING, '⚙️ Sell')
	])

	json.push([
		json_buttonItem(sessionId, OPTION_MAIN_SETTING, 'Back')
	])

	
  	return { title: `⬇️ Choose below option for buy bot.\nUser wallet: ${(session.pkey ? session.account : 'Not set')}\nSlippage: ${session.slippage ? session.slippage : 'Not Set'}`, options: json };
}

export function sendMessage(chatid, message, enableLinkPreview = true) {
	try {

		let data = { parse_mode: 'HTML' }

		if (enableLinkPreview)
			data.disable_web_page_preview = false
		else
			data.disable_web_page_preview = true

		data.disable_forward = true

		bot.sendMessage(chatid, message, data)

		return true
	} catch (error) {
		afx.error_log('sendMessage', error)

		return false
	}
}

export async function sendMessageSync(chatid, message, info = {}) {
	try {

		let data = { parse_mode: 'HTML' }

		data.disable_web_page_preview = false
		data.disable_forward = true

		await bot.sendMessage(chatid, message, data)

		return true
	} catch (error) {

		if (error?.response?.body?.error_code === 403 ){
			info.blocked = true
		}

		console.log(error?.response?.body)
		afx.error_log('sendMessage', error)

		return false
	}
}

export function sendOptionMessage(chatid, message, option) {
	try {
		bot.sendMessage(chatid, message, option);
	} catch (error) {
		afx.error_log('sendMessage', error)
	}
}

export function sendMessageToAuthorizedAllUsers(message) {

	for (const [chatid, session] of sessions) {
		sendMessageToAuthorizedUser(session, message)
	}
}

export function sendMessageToAuthorizedUser(session, message, menu = null) {

	return new Promise(async (resolve, reject) => {

		if (session.wallet || session.vip === 1) {

			const fileId = 'CgACAgEAAxkBAALA8mSJ8fqLFP7iWN2llAJZM69Up6riAAIYAwACUmxQRCNXq-ljLrcOLwQ'
			sendAnimation(session.chatid, fileId, message, menu).then((res) => {
				console.log(`Notification has been sent to @${session.username} (${session.chatid})`)

				resolve(true)

			}).catch(() => {
				resolve(false)
			})	
		} else {
			resolve(false)
		}
	})
}

export async function sendCallToAuthorizedUser(session, filteredInfo, tokenInfo, poolId) {

	const menu = json_msgOption(session.chatid, tokenInfo.primaryAddress, tokenInfo.poolAddress, poolId, true);

	const message = filteredInfo.content0 + filteredInfo.tag
	sendMessageToAuthorizedUser(session, message, menu).then(res => {

		if (res) {
			const hashCode = md5(tokenInfo.poolAddress)
			callHistory.storeMsgData(session.chatid, tokenInfo.poolAddress, tokenInfo.primaryAddress, poolId, hashCode, filteredInfo)
		}
	})

}

export async function sendAnimation(chatid, file_id, message, json_buttons = null) {

	//, protect_content: true
	let option = { caption: message, parse_mode: 'HTML', disable_web_page_preview :true }

	if (json_buttons) {

		const keyboard = {
			inline_keyboard: json_buttons.options,
			resize_keyboard: true,
			one_time_keyboard: true,
			force_reply: true
		};
	
		option.reply_markup = keyboard
	}

	return new Promise(async (resolve, reject) => {
		bot.sendAnimation(chatid, file_id, option).catch((err) => {
			console.log('\x1b[31m%s\x1b[0m', `sendAnimation Error: ${chatid} ${err.response.body.description}`);
		}).then((msg) => {
			resolve(true)
		});
	})
}

export function sendPhoto(chatid, file_id, message) {
	bot.sendPhoto(chatid, file_id, { caption: message, parse_mode: 'HTML', disable_web_page_preview :true }).catch((err) => {
		console.log('\x1b[31m%s\x1b[0m', `sendPhoto Error: ${chatid} ${err.response.body.description}`);
	});
}

export function sendLoginSuccessMessage(session) {

	if (session.type === 'private') {
		sendMessage(session.chatid, `You have successfully logged in with your wallet. From this point forward, you will receive calls based on the settings that you adjusted. If you have any questions, please feel free to contact developer team @PurpleDragon999. Thank you!`)
		console.log(`@${session.username} user has successfully logged in with the wallet ${session.wallet}`);
	} else if (session.type === 'group') {
		sendMessage(session.from_chatid, `@${session.username} group has been successfully logged in with your wallet`)
		console.log(`@${session.username} group has successfully logged in with the owner's wallet ${session.wallet}`);
	} else if (session.type === 'channel') {
		sendMessage(session.chatid, `@${session.username} channel has been successfully logged in with your wallet`)
		console.log(`@${session.username} channel has successfully logged in with the creator's wallet ${session.wallet}`);
	}
}

export function showSessionLog(session) {

	if (session.type === 'private') {
		console.log(`@${session.username} user${session.wallet ? ' joined' : '\'s session has been created (' + session.chatid + ')'}`)
	} else if (session.type === 'group') {
		console.log(`@${session.username} group${session.wallet ? ' joined' : '\'s session has been created (' + session.chatid + ')'}`)
	} else if (session.type === 'channel') {
		console.log(`@${session.username} channel${session.wallet ? ' joined' : '\'s session has been created'}`)
	}
}

export const createSession = (chatid, username, type) => {

	let session = {
		chatid: chatid,
		username: username,
		// init_eth: Number(process.env.MIN_POOL_ETH),
		// init_usd: Number(process.env.MIN_POOL_USDT_USDC),
		// block_threshold: Number(process.env.BLOCK_THRESHOLD),
		// max_fresh_transaction_count: Number(process.env.MAX_FRESH_TRANSACTION_COUNT),
		// min_fresh_wallet_count: Number(process.env.MIN_FRESH_WALLET_COUNT),
		// min_whale_balance: Number(process.env.MIN_WHALE_BALANCE),
		// min_whale_wallet_count: Number(process.env.MIN_WHALE_WALLET_COUNT),
		// min_kyc_wallet_count: Number(process.env.MIN_KYC_WALLET_COUNT),
		// min_dormant_duration: Number(process.env.MIN_DORMANT_DURATION),
		// min_dormant_wallet_count: 0,
		// lp_lock: 0,
		// honeypot:1,
		// contract_age:0,
		wallet: null,
		permit: 0,
		type: type
	}

	setDefaultSettings(session)

	sessions.set(session.chatid, session)
	showSessionLog(session)

	return session;
}

export const updateSession = async (user) => {
	let session = sessions.get(user.chatid);
	if (session) {
		session.chatid = user.chatid
		session.username = user.username
		session.init_eth = user.init_eth
		session.init_usd = user.init_usd
		session.block_threshold = user.block_threshold
		session.max_fresh_transaction_count = user.max_fresh_transaction_count
		session.min_fresh_wallet_count = user.min_fresh_wallet_count
		session.min_whale_balance = user.min_whale_balance
		session.min_whale_wallet_count = user.min_whale_wallet_count
		session.min_kyc_wallet_count = user.min_kyc_wallet_count
		session.min_dormant_wallet_count = user.min_dormant_wallet_count
		session.min_dormant_duration = user.min_dormant_duration
		session.min_sniper_count = user.min_sniper_count
		session.lp_lock = user.lp_lock
		session.honeypot = user.honeypot
		session.contract_age = user.contract_age
		session.wallet = user.wallet;
		session.from_chatid = user.from_chatid;
		session.type = user.type;
		session.vip = user.vip;
	}
}

export const setDefaultSettings = (session) => {

	session.init_eth = 1
	session.init_usd = 1000
	session.block_threshold = 20
	session.max_fresh_transaction_count = 10
	session.min_fresh_wallet_count = 2
	session.min_whale_balance = 10000
	session.min_whale_wallet_count = 2
	session.min_kyc_wallet_count = 1
	session.min_dormant_duration = 0
	session.min_sniper_count = 25
	session.min_dormant_wallet_count = 0
	session.lp_lock = 0
	session.honeypot = 1
	session.contract_age = 0
	session.pkey = null
	session.account = null
	session.slippage = 5
	session.autobuy = 0
	session.autosell = 0
	session.autosell_hi = 100
	session.autosell_lo = -101
	session.autosell_hi_amount = 100
	session.autosell_lo_amount = 100
	session.autobuy_amount = 0.01
}

export let _command_proc = null
export let _callback_proc = null
export async function init(command_proc, callback_proc) {

	_command_proc = command_proc
	_callback_proc = callback_proc

	await database.init()
	const users = await database.selectUsers()

	let loggedin = 0
	for (const user of users) {

		const session = {
			chatid: user.chatid,
			username: user.username,
			init_eth: Number(user.init_eth),
			init_usd: Number(user.init_usd),
			block_threshold: Number(user.block_threshold),
			max_fresh_transaction_count: Number(user.max_fresh_transaction_count),
			min_fresh_wallet_count: Number(user.min_fresh_wallet_count),
			min_whale_balance: Number(user.min_whale_balance),
			min_whale_wallet_count: Number(user.min_whale_wallet_count),
			min_kyc_wallet_count: Number(user.min_kyc_wallet_count),
			min_dormant_wallet_count: Number(user.min_dormant_wallet_count),
			min_dormant_duration: Number(user.min_dormant_duration),
			min_sniper_count: Number(user.min_sniper_count),
			lp_lock: Number(user.lp_lock),  
			honeypot: Number(user.honeypot),
			contract_age: Number(user.contract_age),
			wallet: user.wallet,
			from_chatid: user.from_chatid,
			permit: 0,
			type: user.type,
			vip:user.vip,
			kickmode:user.kickmode,
			slippage: user.slippage,
			account: user.account,
			pkey: user.pkey,
		}

		if (session.wallet) {
			loggedin++
		}

		sessions.set(session.chatid, session)
		//showSessionLog(session)

		if (session.vip === 1) {
			console.log(`@${session.username} user joined as VIP ( ${session.chatid} )`)
		}
	}

	console.log(`${users.length} users, but only ${loggedin} logged in`)
}

export const isAuthorized = async (session) => {

	if (session) {

		let user = await database.selectUser({chatid:session.chatid});
		if (user && user.permit)
			return true;
	}

	return false;
}

export const checkWhitelist = async (username) => {

	let item = await database.existInWhitelist(username);
	if (item) {
		return true;
	}
	
	return false;
}

bot.on('message', async (message) => {

	// console.log(`========== message ==========`)
	// console.log(message)
	// console.log(`=============================`)

	const msgType = message?.chat?.type;
	if (msgType === 'private') {
		privateBot.procMessage(message, database);

	} else if (msgType === 'group' || msgType === 'supergroup') {
		groupBot.procMessage(message, database);

	} else if (msgType === 'channel') {

	}
})

bot.on('callback_query', async (callbackQuery) => {
	// console.log('========== callback query ==========')
	// console.log(callbackQuery)
	// console.log('====================================')

  	const message = callbackQuery.message;

	if (!message) {
		return
	}
	
	const option = JSON.parse(callbackQuery.data);
	let chatid = message.chat.id.toString();

	const cmd = option.c;
	const id = option.k;

  	executeCommand(chatid, message.message_id, callbackQuery.id, option)
})

const executeCommand = async (chatid, messageId, callbackQueryId, option) => {

	const cmd = option.c;
	const id = option.k;

	//stateMap_clear();

	try {

		if (cmd === OPTION_MAIN_SETTING) {

			const sessionId = id;
			assert(sessionId)
			
			stateMap_set(chatid, STATE_IDLE, {sessionId})

			const menu = await json_botSettings(sessionId);
			switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)

		} else if (cmd === OPTION_SET_INIT_LIQUIDITY) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setInitLiquidity(sessionId);
			await switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)

		} else if (cmd === OPTION_SET_INIT_LIQUIDITY_ETH) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Input min ETH balance of initial liquidity`
			sendMessage(chatid, msg)
			await bot.answerCallbackQuery(callbackQueryId, { text: msg })

			stateMap_set(chatid, STATE_WAIT_INIT_ETH, { sessionId })

		} else if (cmd === OPTION_SET_INIT_LIQUIDITY_USD) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Input min USDT or USDC balance of initial liquidity`
			sendMessage(chatid, msg)
			await bot.answerCallbackQuery(callbackQueryId, { text: msg })

			stateMap_set(chatid, STATE_WAIT_INIT_USDT_USDC, { sessionId })

		}  else if (cmd === OPTION_SET_FRESH_WALLET_SETTING) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setFresh(sessionId);
			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}

		} else if (cmd === OPTION_SET_FRESH_WALLET_TURN_ON) {
			
			const sessionId = id;
			assert(sessionId)

			sendMessage(chatid, 'Kindly enter max fresh transaction count')

			stateMap_set(chatid, STATE_WAIT_FRESH_WALLET_MAX_TRANSACTION_COUNT, { sessionId })

		} else if (cmd === OPTION_SET_FRESH_WALLET_TURN_OFF) {

			const sessionId = id;
			assert(sessionId)

			let session = sessions.get(sessionId)
			if (session) {

				session.max_fresh_transaction_count = 0
				session.min_fresh_wallet_count = 0

				await database.updateUser(session)

				sendMessage(chatid, `✅ Fresh wallet filter has been turned off`)

				executeCommand(chatid, messageId, callbackQueryId, {c: OPTION_SET_FRESH_WALLET_SETTING, k: sessionId })
			}

		} else if (cmd === OPTION_SET_WHALE_WALLET_SETTING) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setWhale(sessionId);
			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}

		} else if (cmd === OPTION_SET_WHALE_WALLET_TURN_ON) {

			const sessionId = id;
			assert(sessionId)

			sendMessage(chatid, 'Kindly enter whale wallet min balance')

			stateMap_set(chatid, STATE_WAIT_WHALE_WALLET_MIN_BALANCE, { sessionId })
			
		} else if (cmd === OPTION_SET_WHALE_WALLET_TURN_OFF) {

			const sessionId = id;
			assert(sessionId)

			let session = sessions.get(sessionId)
			if (session) {

				session.min_whale_balance = 0
				session.min_whale_wallet_count = 0

				await database.updateUser(session)

				sendMessage(chatid, `✅ Whale wallet filter has been turned off`)

				executeCommand(chatid, messageId, callbackQueryId, {c: OPTION_SET_WHALE_WALLET_SETTING, k: sessionId })
			}

		} else if (cmd === OPTION_SET_KYC_WALLET_SETTING) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setKyc(sessionId);
			switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)

		} else if (cmd === OPTION_SET_KYC_WALLET_TURN_ON) {

			const sessionId = id;
			assert(sessionId)

			sendMessage(chatid, 'Kindly min KYC wallet count')

			stateMap_set(chatid, STATE_WAIT_MIN_KYC_WALLET_COUNT, { sessionId })

		} else if (cmd === OPTION_SET_KYC_WALLET_TURN_OFF) {

			const sessionId = id;
			assert(sessionId)

			let session = sessions.get(sessionId)
			if (session) {

				session.min_kyc_wallet_count = 0

				await database.updateUser(session)

				sendMessage(chatid, `✅ KYC wallet filter has been turned off`)

				executeCommand(chatid, messageId, callbackQueryId, {c: OPTION_SET_KYC_WALLET_SETTING, k: sessionId })
			}

		} else if (cmd === OPTION_SET_DEFAULT) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Please enter 'Yes' to make sure you want to reset configuration. (Yes for set to default, otherwise, cancel default set)`
			sendMessage(chatid, msg)
			await bot.answerCallbackQuery(callbackQueryId, { text: msg })

			stateMap_set(chatid, STATE_WAIT_SET_DEFAULT, { sessionId })

		} else if (cmd === OPTION_SET_DTGS) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setDTGS(sessionId);
			switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)

		} /*else if (cmd === OPTION_DTGS_SELECT_DEX) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_selectDexOption(sessionId);
			switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)

		}*/ else if (cmd === OPTION_DTGS_INPUT_TOKEN_ADDRESS) {

			// const parts = id.split(':')
			// assert(parts.length == 2)
			// const sessionId = parts[0]
			// const dexId = parseInt(parts[1])
			// assert(sessionId)
			// assert(dexId > 0)

			const sessionId = id;
			assert(sessionId)

			const msg = `Input token address for daily top gainer's statistics`
			sendMessage(chatid, msg)
			await bot.answerCallbackQuery(callbackQueryId, { text: msg })

			stateMap_set(chatid, STATE_WAIT_DAILY_STATISTIC_TOKEN_ADDRESS, { sessionId })
			// stateMap_set(chatid, STATE_WAIT_DAILY_STATISTIC_TOKEN_ADDRESS, { sessionId, dexId })

		} else if (cmd === OPTION_DTGS_SHOW_TOKENS) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_showTokensOption(sessionId);
			switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)

		} else if (cmd === OPTION_DTGS_DELETE_ALL_TOKEN) {

			const sessionId = id;
			assert(sessionId)

			const result = await database.removeTokenByUser(sessionId)
			if (result.deletedCount > 0) {
				// sendMessage(chatid, `✅ All of pool addresses you added has been successfully removed.`)	
				await bot.answerCallbackQuery(callbackQueryId, { text: `Successfully removed` })

				let stateNode = stateMap_get(chatid)
				if (stateNode) {
					executeCommand(chatid, messageId, callbackQueryId, {c: OPTION_DTGS_SHOW_TOKENS, k: stateNode.data.sessionId })
				}
			}
			
		} else if (cmd === OPTION_DTGS_DELETE_TOKEN) {

			const tokenId = id
			assert(tokenId)

			await database.removeToken(tokenId)
			//sendMessage(chatid, `✅ The pool addresses you selected has been successfully removed.`)
			await bot.answerCallbackQuery(callbackQueryId, { text: `Successfully removed` })

			let stateNode = stateMap_get(chatid)

			if (stateNode) {
				executeCommand(chatid, messageId, callbackQueryId, {c: OPTION_DTGS_SHOW_TOKENS, k: stateNode.data.sessionId })
			}
		} else if (cmd === OPTION_SET_LPLOCK) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setLPLock(sessionId);
			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}

		} else if (cmd === OPTION_SET_LPLOCK_TURN_ON || cmd === OPTION_SET_LPLOCK_TURN_OFF) {

			const sessionId = id;
			assert(sessionId)

			let session = sessions.get(sessionId)
			if (session) {

				if (cmd === OPTION_SET_LPLOCK_TURN_ON) {
					session.lp_lock = 1
				} else {
					session.lp_lock = 0
				}

				await database.updateUser(session)

				if (session.lp_lock) {
					//await bot.answerCallbackQuery(callbackQueryId, { text: `LP lock filter has been turned on` })
					sendMessage(chatid, `✅ LP lock filter has been turned on`)

				} else {
					//await bot.answerCallbackQuery(callbackQueryId, { text: `LP lock filter has been turned off` })
					sendMessage(chatid, `✅ LP lock filter has been turned off`)
				}

				const menu = await json_setLPLock(sessionId);
				if (menu) {
					switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
				}
			}
		} else if (cmd === OPTION_SET_HONEYPOT) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setHoneypot(sessionId);
			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}

		} else if (cmd === OPTION_SET_HONEYPOT_TURN_ON || cmd === OPTION_SET_HONEYPOT_TURN_OFF) {

			const sessionId = id;
			assert(sessionId)

			let session = sessions.get(sessionId)
			if (session) {

				if (cmd === OPTION_SET_HONEYPOT_TURN_ON) {
					session.honeypot = 1
				} else {
					session.honeypot = 0
				}

				await database.updateUser(session)

				if (session.honeypot) {
					//await bot.answerCallbackQuery(callbackQueryId, { text: `Honeypot filter has been turned on` })
					sendMessage(chatid, `✅ Honeypot filter has been turned on. You will receive the call which indicates [Honeypot = No]`)

				} else {
					//await bot.answerCallbackQuery(callbackQueryId, { text: `Honeypot filter has been turned off` })
					sendMessage(chatid, `✅ LP lock filter has been turned off`)
				}

				const menu = await json_setHoneypot(sessionId);
				if (menu) {
					switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
				}
			}

		} else if (cmd === OPTION_SET_CONTRACT_AGE) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setContractAge(sessionId);

			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}

		} else if (cmd === OPTION_SET_CONTRACT_AGE_PLUS0_1DAY || cmd === OPTION_SET_CONTRACT_AGE_PLUS1DAY || cmd === OPTION_SET_CONTRACT_AGE_PLUS1MONTH || cmd === OPTION_SET_CONTRACT_AGE_PLUS1YEAR|| cmd === OPTION_SET_CONTRACT_AGE_TURN_OFF) {

			const sessionId = id;
			assert(sessionId)

			let session = sessions.get(sessionId)
			if (session) {

				if (cmd === OPTION_SET_CONTRACT_AGE_PLUS0_1DAY) {

					session.contract_age = 0.1

				} else if (cmd === OPTION_SET_CONTRACT_AGE_PLUS1DAY) {

					session.contract_age = 1

				} else if (cmd === OPTION_SET_CONTRACT_AGE_PLUS1MONTH) {

					session.contract_age = 30

				} else if (cmd === OPTION_SET_CONTRACT_AGE_PLUS1YEAR) {

					session.contract_age = 365

				} else {

					session.contract_age = 0
				}

				await database.updateUser(session)

				if (session.contract_age !== 0) {
					//await bot.answerCallbackQuery(callbackQueryId, { text: `Contract Age filter has been turned on` })
					sendMessage(chatid, `✅ Contract Age filter has been turned on [${session.contract_age}+ days]`)

				} else {
					//await bot.answerCallbackQuery(callbackQueryId, { text: `Contract Age filter has been turned off` })
					sendMessage(chatid, `✅ Contract Age filter has been turned off`)
				}

				const menu = await json_setContractAge(sessionId);
				if (menu) {
					switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
				}
			}

		} else if (cmd === OPTION_SET_CONTRACT_AGE_PLUSNUMBERDAYS) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kindly enter minimum contract age`
			sendMessage(chatid, msg)
			stateMap_set(chatid, STATE_WAIT_MIN_CONTRACT_AGE, { sessionId })

		} else if (cmd === OPTION_SET_DORMANT) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setDormant(sessionId);

			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}

		} else if (cmd === OPTION_SET_DORMANT_PLUS1MONTH 
			|| cmd === OPTION_SET_DORMANT_PLUS3MONTH 
			|| cmd === OPTION_SET_DORMANT_PLUS6MONTH
			|| cmd === OPTION_SET_DORMANT_PLUS1YEAR
			|| cmd === OPTION_SET_DORMANT_TURN_OFF
			 ) {

			const sessionId = id;
			assert(sessionId)

			let minDormantDuration = 0
			let session = sessions.get(sessionId)
			if (session) {

				if (cmd === OPTION_SET_DORMANT_PLUS1MONTH) {

					minDormantDuration = 1

				} else if (cmd === OPTION_SET_DORMANT_PLUS3MONTH) {

					minDormantDuration = 3

				} else if (cmd === OPTION_SET_DORMANT_PLUS6MONTH) {

					minDormantDuration = 6

				} else if (cmd === OPTION_SET_DORMANT_PLUS1YEAR) {

					minDormantDuration = 12

				} else {

					minDormantDuration = 0
				}

				if (minDormantDuration === 0) {
					sendMessage(chatid, `✅ Dormant Wallet filter has been turned off`)

					session.min_dormant_wallet_count = 0
					const menu = await json_setDormant(sessionId);
					if (menu) {
						switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
					}
				} else {

					const msg = `Kindly enter minimum dormant wallet count`
					sendMessage(chatid, msg)
					stateMap_set(chatid, STATE_WAIT_MIN_DORMANT_WALLET_COUNT, { sessionId, minDormantDuration })
				}
			}

		} else if (cmd === OPTION_MSG_COPY_ADDRESS) {
			
			const tokenAddress = id;
			assert(tokenAddress)
			let msg = '```' + tokenAddress + '```'
			bot.sendMessage(chatid, msg, {parse_mode:'Markdown'})

		} else if (cmd === OPTION_MSG_MORE_INFO || cmd === OPTION_MSG_BACK_INFO) {
	
			const parts = id.split(':')
			assert(parts.length == 2)
			const sessionId = parts[0]
			const hashCode = parts[1]
			assert(sessionId)
			assert(hashCode)

			if (1 || sessionId === '2116657656') {

				callHistory.readMsgData(sessionId, hashCode).then((json) => {

					if (json) {
						let menu = null

						if (cmd === OPTION_MSG_MORE_INFO) {
							menu = json_msgOption(json.chatid, json.tokenAddress, json.poolAddress, json.poolId, false)

							const updateText = json.data?.content1 + json.data?.tag
							editAnimationMessageCaption(json.chatid, messageId, updateText, menu.options)

						} else {
							menu = json_msgOption(json.chatid, json.tokenAddress, json.poolAddress, json.poolId, true)

							const updateText = json.data?.content0 + json.data?.tag
							editAnimationMessageCaption(json.chatid, messageId, updateText, menu.options)
						}
					} else{
						bot.answerCallbackQuery(callbackQueryId, { text: `Unable to access the 'More Info' page for old messages` })
						// bot.answerCallbackQuery(callbackQueryId, { text: `Unable to access the 'More Info' page for messages that are older than 48 hours` })
					}
				})
			} else {
				bot.answerCallbackQuery(callbackQueryId, { text: `Coming soon` })
			}

		} else if (cmd === OPTION_MSG_BUY_ETH_0_05
			|| cmd === OPTION_MSG_BUY_ETH_0_1
			|| cmd === OPTION_MSG_BUY_ETH_0_5) {

			const parts = id.split(':')
			assert(parts.length == 2)
			const sessionId = parts[0]
			const poolId = parts[1]
			assert(sessionId)
			assert(poolId)

			if (1) {

				let session = sessions.get(sessionId)

				let ethAmountMap = new Map()

				ethAmountMap.set(OPTION_MSG_BUY_ETH_0_05, 0.05)
				ethAmountMap.set(OPTION_MSG_BUY_ETH_0_1, 0.1)
				ethAmountMap.set(OPTION_MSG_BUY_ETH_0_5, 0.5)

				let ethAmount = ethAmountMap.get(cmd)

				if (session) {

					if (!session.pkey) {
						bot.answerCallbackQuery(callbackQueryId, { text: `Please add your wallet in the setting and then try again` })
						return
					}

					let poolHistoryInfo = await database.selectPoolHistory({pool_id: poolId})

					if (poolHistoryInfo) {
						let tokenAddress = poolHistoryInfo.token_address
		
						if (_callback_proc) {
							_callback_proc(cmd, { session, tokenAddress, ethAmount })
						}
					}
				}

			} else {
				bot.answerCallbackQuery(callbackQueryId, { text: `Currently only dev can access this menu. Coming soon!` })
			}

		} else if (cmd === OPTION_MSG_BUY_ETH_X) {

			const parts = id.split(':')
			assert(parts.length == 2)
			const sessionId = parts[0]
			const poolId = parts[1]
			assert(sessionId)
			assert(poolId)

			let session = sessions.get(sessionId)
			if (session) {
				if (!session.pkey) {
					bot.answerCallbackQuery(callbackQueryId, { text: `Please add your wallet in the setting and then try again.` })
					const msg = `Please add your wallet in the setting and then try again.`
					sendMessage(chatid, msg)
					return
				}

				const msg = `Kindly enter the eth amount to buy token`
				sendMessage(chatid, msg)
				stateMap_set(chatid, STATE_WAIT_SET_ETH_X_SWAP, { sessionId, poolId })
			}

		} else if (cmd === OPTION_MSG_SELL_ETH_0_25
			|| cmd === OPTION_MSG_SELL_ETH_0_50
			|| cmd === OPTION_MSG_SELL_ETH_0_100) {

			const parts = id.split(':')
			assert(parts.length == 2)
			const sessionId = parts[0]
			const poolId = parts[1]
			assert(sessionId)
			assert(poolId)

			if (1 || sessionId === '2116657656') {

				let session = sessions.get(sessionId)

				let percentAmountMap = new Map()

				percentAmountMap.set(OPTION_MSG_SELL_ETH_0_25, 25.0)
				percentAmountMap.set(OPTION_MSG_SELL_ETH_0_50, 50.0)
				percentAmountMap.set(OPTION_MSG_SELL_ETH_0_100, 100.0)

				let percentAmount = percentAmountMap.get(cmd)

				if (session) {

					if (!session.pkey) {
						bot.answerCallbackQuery(callbackQueryId, { text: `Please add your wallet in the setting and then try again` })
						return
					}

					let poolHistoryInfo = await database.selectPoolHistory({pool_id: poolId})

					if (poolHistoryInfo) {
						let tokenAddress = poolHistoryInfo.token_address
		
						if (_callback_proc) {
							_callback_proc(cmd, { session, tokenAddress, percentAmount })
						}
					}
				}

			} else {
				bot.answerCallbackQuery(callbackQueryId, { text: `Currently only dev can access this menu. Coming soon!` })
			}

		} else if (cmd === OPTION_MSG_SELL_ETH_X) {

			const parts = id.split(':')
			assert(parts.length == 2)
			const sessionId = parts[0]
			const poolId = parts[1]
			assert(sessionId)
			assert(poolId)

			if (1 || sessionId === '2116657656') {
				let session = sessions.get(sessionId)
				if (session) {
					if (!session.pkey) {
						bot.answerCallbackQuery(callbackQueryId, { text: `Please add your wallet in the setting and then try again.` })
						const msg = `Please add your wallet in the setting and then try again.`
						sendMessage(chatid, msg)
						return
					}
	
					const msg = `Please enter the percentage value at which you would like to sell the token.`
					sendMessage(chatid, msg)
					stateMap_set(chatid, STATE_WAIT_SET_TOKEN_X_SWAP, { sessionId, poolId })
				}

			} else {
				bot.answerCallbackQuery(callbackQueryId, { text: `Currently only dev can access this menu. Coming soon!` })
			}

		} else if (cmd === OPTION_SET_SNIPER_DETECTOR) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setSniperDetector(sessionId);
			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}

		} else if (cmd === OPTION_SET_SNIPER_DETECTOR_TURN_OFF) {

			const sessionId = id;
			assert(sessionId)

			let session = sessions.get(sessionId)
			if (session) {

				session.min_sniper_count = 0
				await database.updateUser(session)
				sendMessage(chatid, `✅ Sniper detector has been turned off`)

				const menu = await json_setSniperDetector(sessionId);
				if (menu) {
					switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
				}
			} 

		} else if (cmd === OPTION_SET_SNIPER_DETECTOR_TURN_ON) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kindly enter minimum sniper buys to be detected`
			sendMessage(chatid, msg)
			stateMap_set(chatid, STATE_WAIT_MIN_SNIPER_COUNT, { sessionId })
			
		} else if (cmd === OPTION_SET_USER_WALLET_SETTING) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_setUserwallet(sessionId);
			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}
		} else if (cmd === OPTION_SET_USER_WALLET_ON) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kindly enter your wallet private key`
			sendMessage(chatid, msg)
			stateMap_set(chatid, STATE_WAIT_SET_USER_WALLET_PRIVATEKEY, { sessionId })

		} else if (cmd === OPTION_SET_USER_SLIPPAGE) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kindly enter slippage percent`
			sendMessage(chatid, msg)
			stateMap_set(chatid, STATE_WAIT_SET_USER_SLIPPAGE, { sessionId })
			
		} else if (cmd === OPTION_SET_USER_WALLET_GENERATE) {

			const sessionId = id;
			assert(sessionId)

			const session = sessions.get(sessionId)

			if (session && _callback_proc) {
				_callback_proc(cmd, { session })
			}

		} else if (cmd === OPTION_SET_USER_WALLET_OFF) {

			const sessionId = id;
			assert(sessionId)

			const session = sessions.get(sessionId)
			if (session) {
				session.pkey = null
				session.account = null
				await database.updateUser(session)

				sendMessage(chatid, '✅ Your wallet has been removed successfully')
				const menu = await json_setUserwallet(sessionId);
				if (menu) {
					switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
				}
			}
			
		} else if (cmd === OPTION_SET_USER_BUY_SETTING) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_buyOption(sessionId);
			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}

		} else if (cmd === OPTION_SET_USER_BUY_AUTO) {

			const sessionId = id;
			assert(sessionId)

			const session = sessions.get(sessionId)
			if (session) {

				session.autobuy = session.autobuy ?? 0
				session.autobuy = (session.autobuy === 1) ? 0 : 1
				await database.updateUser(session)
	
				executeCommand(chatid, messageId, callbackQueryId, {c: OPTION_SET_USER_BUY_SETTING, k: sessionId })
			}

		} else if (cmd === OPTION_SET_USER_BUY_AMOUNT) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kinly enter a buy amount you desire. This is the eth amount that automatically buys when auto buy is triggered.`
			sendMessage(chatid, msg)
			stateMap_set(chatid, STATE_WAIT_SET_USER_BUY_AMOUNT, { sessionId })

		} else if (cmd === OPTION_SET_USER_BUY_AMOUNT_DELETE) {

			const sessionId = id;
			assert(sessionId)

			const session = sessions.get(sessionId)
			if (session) {
				
				session.autobuy_amount = 0.01
				await database.updateUser(session)

				const msg = `✅ Autobuy amount has been set to default value (0.01 eth)`
				sendMessage(chatid, msg)
			}
			
		} else if (cmd === OPTION_SET_USER_SELL_SETTING) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_sellOption(sessionId);
			if (menu) {
				switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)
			}

		} else if (cmd === OPTION_SET_USER_SELL_AUTO) {

			const sessionId = id;
			assert(sessionId)

			const session = sessions.get(sessionId)
			if (session) {
				
				session.autosell = session.autosell ?? 0
				session.autosell = (session.autosell === 1) ? 0 : 1
				await database.updateUser(session)

				executeCommand(chatid, messageId, callbackQueryId, {c: OPTION_SET_USER_SELL_SETTING, k: sessionId })
			}

		} else if (cmd === OPTION_SET_USER_SELL_HI) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kinly enter a sell percentage you desire. This is the HIGH threshold at which you'll auto sell for profits.\n\nExample: 2x would be 100.`
			sendMessage(chatid, msg)
			stateMap_set(chatid, STATE_WAIT_SET_USER_SELL_HI, { sessionId })

		} else if (cmd === OPTION_SET_USER_SELL_LO) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kinly enter a sell percentage you desire. This is the LOW threshold at which you'll auto sell to prevent further losses (stop-loss). Example: 0.5x would be -50.`
			sendMessage(chatid, msg)
			stateMap_set(chatid, STATE_WAIT_SET_USER_SELL_LO, { sessionId })

		} else if (cmd === OPTION_SET_USER_SELL_HI_DELETE) {

			const sessionId = id;
			assert(sessionId)

			const session = sessions.get(sessionId)
			if (session) {
				
				session.autosell_hi = 100
				await database.updateUser(session)

				const msg = `✅ Auto sell (high) % has been removed`
				sendMessage(chatid, msg)
			}
			
		} else if (cmd === OPTION_SET_USER_SELL_LO_DELETE) {

			const sessionId = id;
			assert(sessionId)

			const session = sessions.get(sessionId)
			if (session) {
				
				session.autosell_lo = -101
				await database.updateUser(session)

				const msg = `✅ Auto sell (low) % has been removed`
				sendMessage(chatid, msg)
			}

		} else if (cmd === OPTION_SET_USER_SELL_HI_AMOUNT) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kinly enter a sell amount % you desire. This represents how much of your holdings you want to sell when sell-high is triggered.\n\nExample: If you want to sell half of your bag, type 50.`
			sendMessage(chatid, msg)
			stateMap_set(chatid, STATE_WAIT_SET_USER_SELL_HI_AMOUNT, { sessionId })

		} else if (cmd === OPTION_SET_USER_SELL_LO_AMOUNT) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kinly enter a sell amount you desire. This represents how much of your holdings you want to sell when sell-low is triggered. Example: If you want to sell half of your bag, type 50.`
			sendMessage(chatid, msg)
			stateMap_set(chatid, STATE_WAIT_SET_USER_SELL_LO_AMOUNT, { sessionId })

		} else if (cmd === OPTION_SET_USER_SELL_HI_AMOUNT_DELETE) {

			const sessionId = id;
			assert(sessionId)

			const session = sessions.get(sessionId)
			if (session) {
				
				session.autosell_hi_amount = 100
				await database.updateUser(session)

				const msg = `✅ Auto sell (high) amount % has been removed`
				sendMessage(chatid, msg)
			}
			
		} else if (cmd === OPTION_SET_USER_SELL_LO_AMOUNT_DELETE) {

			const sessionId = id;
			assert(sessionId)

			const session = sessions.get(sessionId)
			if (session) {
				
				session.autosell_lo_amount = 100
				await database.updateUser(session)

				const msg = `✅ Auto sell (low) amount % has been removed`
				sendMessage(chatid, msg)
			}
		} else if (cmd === OPTION_SET_USER_SELL_TOKEN_ADD) {

			const sessionId = id;
			assert(sessionId)

			const msg = `Kindly enter a token address you want to sell automatically`
			sendMessage(chatid, msg)
			await bot.answerCallbackQuery(callbackQueryId, { text: msg })

			stateMap_set(chatid, STATE_WAIT_ADD_AUTOTRADETOKEN, { sessionId })

		} else if (cmd === OPTION_SET_USER_SELL_TOKEN_SHOW) {

			const sessionId = id;
			assert(sessionId)

			const menu = await json_showAutoTradeTokensOption(sessionId);
			switchMenuWithTitle(chatid, messageId, get_menuTitle(sessionId, menu.title), menu.options)

		} else if (cmd === OPTION_SET_USER_SELL_TOKEN_REMOVEALL) {

			const sessionId = id;
			assert(sessionId)

			const result = await database.removeAutoTradeTokensByUser(sessionId)
			if (result.deletedCount > 0) {
				// sendMessage(chatid, `✅ All of pool addresses you added has been successfully removed.`)	
				await bot.answerCallbackQuery(callbackQueryId, { text: `Successfully removed` })

				executeCommand(chatid, messageId, callbackQueryId, {c: OPTION_SET_USER_SELL_TOKEN_SHOW, k: sessionId })
			}
			
		} else if (cmd === OPTION_SET_USER_SELL_TOKEN_REMOVE) {

			const parts = id.split(':')
			assert(parts.length == 2)
			const sessionId = parts[0]
			const tokenId = parts[1]
			assert(sessionId)
			assert(tokenId)

			await database.removeAutoTradeToken(tokenId)
			//sendMessage(chatid, `✅ The pool addresses you selected has been successfully removed.`)
			await bot.answerCallbackQuery(callbackQueryId, { text: `Successfully removed` })

			executeCommand(chatid, messageId, callbackQueryId, {c: OPTION_SET_USER_SELL_TOKEN_SHOW, k: sessionId })
		}

	} catch (error) {
		afx.error_log('getTokexecuteCommand', error)
		sendMessage(chatid, `😢 Sorry, there was some errors on the command. Please try again later 😉`)
		await bot.answerCallbackQuery(callbackQueryId, { text: `😢 Sorry, there was some errors on the command. Please try again later 😉` })
	}
}
