
export const UniswapV2 = 1
export const UniswapV3 = 2
export const SushiSwap = 3

export const dexList = [ 
	{ title : 'Uniswap V2', id : UniswapV2 },
	{ title : 'Uniswap V3', id : UniswapV3 },
	// { title : 'SushiSwap', id : SushiSwap },
]

export const error_log = (summary, error) => {

	if (error?.response?.body?.description)
		console.log('\x1b[31m%s\x1b[0m', `[error] ${summary} ${error?.response?.body?.description}`);
	else
		console.log('\x1b[31m%s\x1b[0m', error);
}
