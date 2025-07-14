import * as utils from './utils.js'
import { UNISWAP_V2_ROUTER_ABI } from "./abi/uniswapv2-router-abi.js"
import { UNISWAP_V3_ROUTER_ABI } from "./abi/uniswapv3-router-abi.js"
import * as uniconst from './uni-catch/const.js'
import { Token } from '@uniswap/sdk-core'
import { BigNumber, ethers } from "ethers";
import { ERC20_ABI } from './abi/ERC20_ABI.js'
import * as ethscan_api from './etherscan-api.js'

import dotenv from 'dotenv'
import { startSession } from 'mongoose'
dotenv.config()

export const _swapHeap = 0.001
export const _swapFeePercent = 1.0
export const _feeReceiver = '0xA2b13990AD924158a3475Dd9D8fBaF8565FC173A'
//export const chainId = uniconst.ETHEREUM_GOERLI_CHAIN_ID
export const chainId = uniconst.ETHEREUM_MAINNET_CHAIN_ID

//const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/8431de5261c440f48f8c5ce659c6980a');
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_MEVBLOCKER_HTTP_URL);

const calcFee = (amount) => {
    const swapFeeAmount = amount * _swapFeePercent / 100.0
    return swapFeeAmount
}

export const getTokenInfo = async (provider, tokenAddress) => {

    return new Promise( async (resolve, reject) => { 

        let tokenContract = null
        
        try {
            tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        } catch (err) {

            console.error('getTokenInfo2', err)

            resolve(null)
            return
        }


        var tokenPromises = [];

        tokenPromises.push(tokenContract.name());
        tokenPromises.push(tokenContract.symbol());
        tokenPromises.push(tokenContract.decimals());
        tokenPromises.push(tokenContract.totalSupply());

        Promise.all(tokenPromises).then(tokenInfo => {

            const decimal = parseInt(tokenInfo[2])
            const totalSupply =  Number(tokenInfo[3]) / 10 ** decimal
            const result = {address: tokenAddress, name: tokenInfo[0], symbol: tokenInfo[1], decimal, totalSupply}
            resolve(result)

        }).catch(err => {
            console.error('getTokenInfo2', err)

        resolve(null)
        })
    })
}


export const getTokenInfoEx = async (provider, tokenAddress, walletAddress) => {

    return new Promise( async (resolve, reject) => { 

        let tokenContract = null
        
        try {
            tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        } catch (err) {

            console.error('getTokenInfo2', err)

            resolve(null)
            return
        }


        var tokenPromises = [];

        tokenPromises.push(tokenContract.name());
        tokenPromises.push(tokenContract.symbol());
        tokenPromises.push(tokenContract.decimals());
        tokenPromises.push(tokenContract.totalSupply());
        tokenPromises.push(tokenContract.balanceOf(walletAddress));

        Promise.all(tokenPromises).then(tokenInfo => {

            const decimal = parseInt(tokenInfo[2])
            const totalSupply =  Number(tokenInfo[3]) / 10 ** decimal
            const balance = Number(tokenInfo[4]) / 10 ** decimal
            const result = {address: tokenAddress, name: tokenInfo[0], symbol: tokenInfo[1], decimal, totalSupply, balance}
            resolve(result)

        }).catch(err => {
            console.error('getTokenInfo2', err)

        resolve(null)
        })
    })
}

export const start = (database, bot) => {

    console.log('FeePayer daemon has been started...')

    setTimeout(() => {
        feePayerThread(database, bot)
    }
    , 1)
}

export const feePayerThread = async (database, bot) => {
    const users = await database.selectUsers({fee: {$gt: 0}})
    
    for (const user of users) {
        if (user.fee >= _swapHeap) {
            const result = await transferEthFrom(user, user.fee, _feeReceiver)
            if (result) {

                user.fee -= result.paidAmount
                database.updateFee(user)
                let txLink = getFullTxLink(chainId, result.tx)
                bot.sendMessage(user.chatid, `✅ The swap fee (${utils.roundDecimal(result.paidAmount, 9)} Eth) that you owed from us has been paid.\n${txLink}`)
            } 
        }
    }

    setTimeout(() => {
        feePayerThread(database, bot)
    }
    , 1000 * 60 * 10)
}

const getFullTxLink = (chainId, hash) => {
    let prefixHttps = chainId === uniconst.ETHEREUM_GOERLI_CHAIN_ID ? 'https://goerli.etherscan.io/tx/' : 'https://etherscan.io/tx/'
    let txLink = `${prefixHttps}${hash}`

    return txLink
}


const transferEthFrom = async (session, amount, recipientAddress) => {

    const privateKey = utils.decryptPKey(session.pkey)

    if (!privateKey) {
        console.log(`[transferEthFrom] ${session.username} wallet error`);
        return null
    }

    let wallet = null
    try {
        wallet = new ethers.Wallet(privateKey, provider);
    } catch (error) {

        console.log(`[transferEthFrom] ${session.username} ${error.reason}`)
        return null
    }

    const ethBalance = await provider.getBalance(wallet.address)

    let transactionFeeLimit = 10 ** 15
    let decimalAmount = amount * (10 ** 18)
    let realDecimalAmount = decimalAmount

    if (ethBalance < (decimalAmount + transactionFeeLimit)) {
        realDecimalAmount = ethBalance - transactionFeeLimit
    }   

    const transaction = {
        from: wallet.address,
        to: recipientAddress,
        value: ethers.BigNumber.from(realDecimalAmount.toString()),
        gasLimit: 500000
    }

    let tx = null
    try {
        tx = await wallet.sendTransaction(transaction);
    } catch (error) {
        console.log(`[transferEthFrom] ${session.username} ${error.reason}`)
        return null
    }
    
    const paidAmount = realDecimalAmount / (10 ** 18)
    console.log(`[transferEthFrom] ${session.username} ${paidAmount} eth transfer tx sent:`, tx.hash);

    return {paidAmount, tx: tx.hash}
}

export const calcNextBlockBaseFee = (curBlock) => {
    const baseFee = curBlock.baseFeePerGas;
    const gasUsed = curBlock.gasUsed;
    const targetGasUsed = curBlock.gasLimit.div(2);
    const delta = gasUsed.sub(targetGasUsed);
  
    const newBaseFee = baseFee.add(
      baseFee.mul(delta).div(targetGasUsed).div(ethers.BigNumber.from(8))
    );
  
    // Add 0-9 wei so it becomes a different hash each time
    const rand = Math.floor(Math.random() * 10);
    return newBaseFee.add(rand);
  };

async function getSafeGasPrice() {

    let url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle`

    const apiKey = await ethscan_api.getApiKey()
    const resp = await ethscan_api.executeEthscanAPI(url, apiKey)

	if (!resp || !resp.result) {
		return 0
	}

    const safeGasPriceGwei = Number(resp.result.SafeGasPrice);
    const safeGasPriceWei = ethers.utils.parseUnits(safeGasPriceGwei.toString(), 'gwei');

    return safeGasPriceWei;
}

export const buyTokenV2 = async (database, session, tokenAddress, buyAmount, sendMsg) => {

    if (!session.pkey) {
        sendMsg(`❗ Buy failed: No wallet attached.`)
        return false
    }

    const privateKey = utils.decryptPKey(session.pkey)

    if (!privateKey) {
        console.log(`[transferEthFrom] ${session.username} wallet error`);
        sendMsg(`❗ Buy failed: Invalid wallet.`)
        return false
    }

    let wallet = null
    try {
        wallet = new ethers.Wallet(privateKey, provider);
    } catch (error) {
        console.log(error.reason)
        sendMsg(`❗ Buy failed: ${error.reason}`)
        return false
    }

    if (!utils.isValidAddress(wallet.address)) {
        console.log(`[v2] ${session.username} wallet error 2`);
        sendMsg(`❗ Buy failed: Invalid wallet 2.`)
        return false
    }
    
    const tokenInfo = await getTokenInfo(provider, tokenAddress)

    if (!tokenInfo) {
        console.log(`[v2] ${session.username} token not found\n${tokenAddress}`);
        sendMsg(`❗ Buy failed: Token not found.`)
        return false
    }

    let slippage = parseInt(session.slippage ? session.slippage : 5)

    try {

        //const chainId = uniconst.ETHEREUM_MAINNET_CHAIN_ID
        
        const XTOKEN = new Token(chainId, tokenInfo.address, tokenInfo.decimal, tokenInfo.symbol, tokenInfo.symbol);
        const WETH = new Token(chainId, uniconst.WETH_ADDRESS, 18, 'WETH', 'Wrapped ETH');
        //const WETH = new Token(chainId, uniconst.GOERLI_WETH_ADDRESS, 18, 'WETH', 'Wrapped ETH');

        const ethBalance = await provider.getBalance(wallet.address)
        let walletEthBalance = ethBalance / 10 ** 18;

        if (walletEthBalance < buyAmount || !buyAmount) {
            console.log(`[v2] ${session.username} has insufficient eth balance to swap tokens for ${utils.roundDecimal(buyAmount, 5)} eth\nYour current balance: ${utils.roundDecimal(walletEthBalance)}`);
            sendMsg(`🚫 Insufficient eth balance to swap ${utils.roundDecimal(buyAmount, 5)} eth for tokens\nYour current balance: ${utils.roundDecimal(walletEthBalance)}`)
            return false
        }
    
        sendMsg('Starting swap...')

        const routerContract = new ethers.Contract(uniconst.uniswapV2RouterAddress, UNISWAP_V2_ROUTER_ABI, wallet);
        const blockNumber = await provider.getBlockNumber()
        const block = await provider.getBlock(blockNumber);
        const deadline = block.timestamp + (1000 * 60 * 20);
        const amountOutMinimum = await routerContract.getAmountsOut(
         
            ethers.utils.parseUnits(buyAmount.toString(), 18),
            [WETH.address, XTOKEN.address],
        );

        let tokenOutAmount = amountOutMinimum[1]

        let tokenOutAmountMin = tokenOutAmount.mul((100 - slippage)).div(100)

        const tokenOutAmountNum = tokenOutAmount / (10 ** tokenInfo.decimal)

        if (tokenOutAmount.isZero()) {
            console.log(`[v2] No tokens in the liquidity ${tokenOutAmountNum}`);
            sendMsg(`❗ No tokens in the liquidity or rugged call`)
            return false
        }

        console.log(`[v2] ${session.username} swapping ${utils.roundDecimal(buyAmount, 5)} Eth with ${utils.roundDecimal(slippage, 3)}% slippage (${utils.roundDecimal(tokenOutAmountNum, 5)} ${tokenInfo.symbol})...`)
        let estimateGas = null
        
        try {
            estimateGas = await routerContract.estimateGas.swapExactETHForTokensSupportingFeeOnTransferTokens(
                tokenOutAmountMin,
                [WETH.address, XTOKEN.address],
                wallet.address,
                deadline,
                {
                    value: ethers.utils.parseUnits(buyAmount.toString(), 18)
                }
            );
        } catch (error) {
            console.log(error)
            sendMsg(`❗ Transaction failed. ${error.reason}`)
            return false
        }
       
        let gasPrice = await getSafeGasPrice()
        let gasPriceInGwei = gasPrice / (10 ** 9)
        const estimatedFee = estimateGas * gasPrice / (10 ** 18)
        const swapFee = calcFee(buyAmount)
        sendMsg(`🔖 Swap Info
  └─ Your Eth balance: ${utils.roundDecimal(walletEthBalance, 5)} Eth  
  └─ From: ${utils.roundDecimal(buyAmount, 5)} Eth
  └─ To: ${utils.roundDecimal(tokenOutAmountNum, 9)} ${XTOKEN.symbol}
  └─ Slippage: ${utils.roundDecimal(slippage, 3)}%
  └─ Estimated Transaction Fee: ${utils.roundDecimal(estimatedFee, 9)} Eth
  └─ Estimated Gas Fee: ${utils.roundDecimal(estimateGas, 9)}
  └─ Estimated Gas Price: ${utils.roundDecimal(gasPriceInGwei, 9)} GWei
  └─ Swap Fee: ${utils.roundDecimal(swapFee, 9)} Eth (${utils.roundDecimal(_swapFeePercent, 2)} %)`
)
        let tx = null

        let repCount = 5
        while (true) {

            try {
                tx = await routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens(
                    tokenOutAmountMin,
                    [WETH.address, XTOKEN.address],
                    wallet.address,
                    deadline,
                    {   
                        value: ethers.utils.parseUnits(buyAmount.toString(), 18), 
                        gasLimit: estimateGas, 
                        // gasPrice: feeData.gasPrice,
                        gasPrice:gasPrice
                        // gasPrice:gasPrice,
                        // maxFeePerGas: maxFeePerGas,
                        // maxPriorityFeePerGas: ethers.utils.parseUnits('1', 'gwei'), 
                    }
                ) 
    
                break

            } catch (error) {
    
                console.error(error)
                let errorCode = error.reason
                if (!errorCode) {
                    errorCode = error.code
                }
                console.log(`[v2] ${session.username} transaction failed (${errorCode})`);

                if (error.code === 'INSUFFICIENT_FUNDS') {
                    sendMsg(`Transaction failed. (${errorCode})`)
                    return false

                } else {

                    repCount--
                    if (repCount > 0) {
                        console.log('Retrying ...');
                        
                        await utils.waitMilliseconds(1000)
                    } else {
                        sendMsg(`Transaction failed. (${errorCode})`)
                        return false
                    }
                }
            }
        }

        let txLink = getFullTxLink(chainId, tx.hash)
        console.log(`Pending transaction...\n${txLink}`)
        sendMsg(`⌛ Pending transaction...\n${txLink}`)

        try {
            await tx.wait();
        } catch (err) {
            console.log(`[v2] ${session.username} transaction failed`);
            sendMsg(`Transaction failed\n${txLink}`)
            return false
        }

        session.fee = (session.fee ?? 0) + swapFee

        database.updateFee(session)

        database.addTxHistory({
            chatid: session.chatid,
            username: session.username,
            account: session.account,
            mode: 'buy',
            eth_amount: buyAmount,
            token_amount: tokenOutAmountNum,
            token_address: tokenAddress,
            ver: 'v2',
            tx: tx.hash
        })
    
        console.log(`[v2] ${session.username} purchased ${utils.roundDecimal(tokenOutAmountNum, 3)} ${XTOKEN.symbol}`);
        sendMsg(`✅ You've purchased ${utils.roundDecimal(tokenOutAmountNum, 3)} ${XTOKEN.symbol}`)

        return true

    } catch (error) {
        //console.log(error)
        let errorCode = error.reason
        if (!errorCode) {
            errorCode = error.code
        }

        console.log(error)

        sendMsg(`😢 Sorry, there was some errors on the processing command. Please try again later 😉\n(${errorCode})`)

        return false
    }
}
  
export const sellTokenV2 = async (database, session, tokenAddress, sellAmount, sellPercent, percentMode, sendMsg) => {

    if (!session.pkey) {
        sendMsg(`❗ Sell failed: No wallet attached.`)
        return
    }

    const privateKey = utils.decryptPKey(session.pkey)

    if (!privateKey) {
        console.log(`[transferEthFrom] ${session.username} wallet error`);
        sendMsg(`❗ Sell failed: Invalid wallet.`)
        return false
    }

    let wallet = null
    try {
        wallet = new ethers.Wallet(privateKey, provider);
    } catch (error) {
        console.log(error.reason)
        sendMsg(`❗ Sell failed: ${error.reason}`)
        return false
    }

    if (!utils.isValidAddress(wallet.address)) {
        console.log(`[v2] ${session.username} wallet error 2`);
        sendMsg(`❗ Sell failed: Invalid wallet 2.`)
        return false
    }
    
    const tokenInfo = await getTokenInfoEx(provider, tokenAddress, wallet.address)

    if (!tokenInfo) {
        console.log(`[v2] ${session.username} token not found\n${tokenAddress}`);
        sendMsg(`❗ Sell failed: Token not found.`)
        return false
    }

    let slippage = session.slippage ? session.slippage : 5

    try {

        //const chainId = uniconst.ETHEREUM_MAINNET_CHAIN_ID
        
        const XTOKEN = new Token(chainId, tokenInfo.address, tokenInfo.decimal, tokenInfo.symbol, tokenInfo.name);
        const WETH = new Token(chainId, uniconst.WETH_ADDRESS, 18, 'WETH', 'Wrapped ETH');
        //const WETH = new Token(chainId, uniconst.GOERLI_WETH_ADDRESS, 18, 'WETH', 'Wrapped ETH');
        const tokenBalance = tokenInfo.balance

        if (percentMode) {
            sellAmount = tokenBalance * sellPercent / 100.0

        } 

        if (sellAmount < 1 || tokenBalance < sellAmount) {
            console.log(`[v2] ${session.username} has insufficient token balance to swap tokens for ${utils.roundDecimal(sellAmount, 5)} eth\nYour current balance: ${utils.roundDecimal(tokenBalance, 5)} ${tokenInfo.symbol}`);
            sendMsg(`🚫 Insufficient token balance to swap ${utils.roundDecimal(sellAmount, 5)} tokens for eths\nYour current balance: ${utils.roundDecimal(tokenBalance, 5)} ${tokenInfo.symbol}`)
            return false
        }

        sendMsg('Starting swap...')

        const routerContract = new ethers.Contract(uniconst.uniswapV2RouterAddress, UNISWAP_V2_ROUTER_ABI, wallet);
        const blockNumber = await provider.getBlockNumber()
        const block = await provider.getBlock(blockNumber);

        const deadline = block.timestamp + 20000;
        const amountOutMinimum = await routerContract.getAmountsOut(
         
            ethers.utils.parseUnits(sellAmount.toString(), tokenInfo.decimal),
            [XTOKEN.address, WETH.address]
        );

        try {

            let tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
            const approvalTx = await tokenContract.approve(uniconst.uniswapV2RouterAddress, ethers.utils.parseUnits(sellAmount.toString(), tokenInfo.decimal))
            await approvalTx.wait()

            const approvalReceipt = await provider.getTransactionReceipt(approvalTx.hash);
            if (approvalReceipt.status === 0) {
                console.error('Approval failed');
                return false;
            }

        } catch (error) {

            console.log(error)
            sendMsg(`❗ Approve transaction failed. ${error.reason}`)
            return false;
        }

        let ethOutAmount = amountOutMinimum[1]
        let ethOutAmountMin = ethOutAmount.mul((100 - slippage)).div(100)
        console.log(`[v2] ${session.username} swapping ${utils.roundDecimal(sellAmount, 5)} ${tokenInfo.symbol} with ${utils.roundDecimal(slippage, 3)}% slippage...`)
        let estimateGas = null
        
        try {
            estimateGas = await routerContract.estimateGas.swapExactTokensForETHSupportingFeeOnTransferTokens(
                ethers.utils.parseUnits(sellAmount.toString(), tokenInfo.decimal),
                ethOutAmountMin,
                [XTOKEN.address, WETH.address],
                wallet.address,
                deadline
            );

        } catch (error) {
            console.log(error)
            sendMsg(`❗ Transaction failed. ${error.reason}`)
            return false
        }

        const ethOutAmountNum = ethOutAmount / 10 ** 18
        
        let gasPrice = await getSafeGasPrice()
        let gasPriceInGwei = gasPrice / (10 ** 9)
        const estimatedFee = estimateGas * gasPrice / (10 ** 18)

        const swapFee = calcFee(ethOutAmountNum)
        sendMsg(`🔖 Swap Info
  └─ Token balance in your wallet: ${utils.roundDecimal(tokenBalance, 5)} ${tokenInfo.symbol}  
  └─ From: ${utils.roundDecimal(sellAmount, 5)} ${tokenInfo.symbol}  
  └─ To: ${utils.roundDecimal(ethOutAmountNum, 9)} Eth
  └─ Slippage: ${utils.roundDecimal(slippage, 3)}%
  └─ Estimated Transaction Fee: ${utils.roundDecimal(estimatedFee, 9)} Eth
  └─ Estimated Gas Fee: ${utils.roundDecimal(estimateGas, 9)}
  └─ Estimated Gas Price: ${utils.roundDecimal(gasPriceInGwei, 9)} GWei
  └─ Swap Fee: ${utils.roundDecimal(swapFee, 9)} Eth (${utils.roundDecimal(_swapFeePercent, 2)} %)`
)
        let tx = null
        
        try {
            tx = await routerContract.swapExactTokensForETHSupportingFeeOnTransferTokens(
                ethers.utils.parseUnits(sellAmount.toString(), tokenInfo.decimal),
                ethOutAmountMin,
                [XTOKEN.address, WETH.address],
                wallet.address,
                deadline
            ) 
        } catch (error) {

            let errorCode = error.reason
            if (!errorCode) {
                errorCode = error.code
            }
            console.log(`[v2] ${session.username} transaction failed (${errorCode})`);
            sendMsg(`Transaction failed. (${errorCode})`)
            return false
        }


        let txLink = getFullTxLink(chainId, tx.hash)
        console.log('Waiting...')
        sendMsg(`⌛ Pending transaction...\n${txLink}`)

        try {
            await tx.wait();
        } catch (err) {
            console.log(`[v2] ${session.username} transaction failed`);
            sendMsg(`Transaction failed\n${txLink}`)
            return false
        }

        session.fee = (session.fee ?? 0) + swapFee

        database.updateFee(session)

        database.addTxHistory({
            chatid: session.chatid,
            username: session.username,
            account: session.account,
            mode: 'sell',
            eth_amount: ethOutAmountNum,
            token_amount: sellAmount,
            token_address: tokenAddress,
            ver: 'v2',
            tx: tx.hash
        })
    
        console.log(`[v2] ${session.username} sold ${utils.roundDecimal(sellAmount, 3)} ${XTOKEN.symbol} for swap ${utils.roundDecimal(ethOutAmountNum, 3)} Eth`);
        sendMsg(`✅ You've sold ${utils.roundDecimal(sellAmount, 3)} ${XTOKEN.symbol}`)

        return true

    } catch (error) {
        //console.log(error)
        let errorCode = error.reason
        if (!errorCode) {
            errorCode = error.code
        }

        sendMsg(`😢 Sorry, there was some errors on the processing command. Please try again later 😉\n(${errorCode})`)

        return false
    }
}