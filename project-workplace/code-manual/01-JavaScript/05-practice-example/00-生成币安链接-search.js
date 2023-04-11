
const testStr = '0.00000000'
const testStr2 = '0.13348221'

console.log('testStr', Number(testStr));
console.log('testStr2:', Number(testStr2));

// APTUSDT --> APT_USDT
const symbol = 'APTUSDT'
const baseBianceUri = 'https://www.binance.com/en/trade/'
function generateBianceUri(symbol, exchange = 'USDT') {
  let assetUri = ''
  let asset = symbol
  // const isInclude = symbol.search(`/${exchange}/`)
  const isInclude = symbol.search(new RegExp(`${exchange}`))
  console.log('isInclude', isInclude);
  if (isInclude !== -1) {
    const targetSymbol = symbol.match(new RegExp(`(\\S*)${exchange}`))
    console.log('targetSymbol:', targetSymbol);
    asset = targetSymbol[1] || []
    assetUri = `${baseBianceUri}${asset}_${exchange}`
  }

  return { asset, assetUri }
}

console.log(generateBianceUri(symbol))
// end
