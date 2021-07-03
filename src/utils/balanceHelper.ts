import Moralis from '@utils/moralisClient'

export default class BalanceHelper {
  
  /**
   * Returns balance fo ERC20 token
   * @param tokenSymbol Symbol for token. Example: LINK
   * @returns Token object
   */
  public static async getERC20TokenBalance(tokenSymbol: string): Promise<any> {
    return await Moralis.Web3.getERC20({ symbol: tokenSymbol });
  };

  /**
   * Returns the native token for a given chain
   * @param chain Optional. If none given, defaults to Eth. Example: bsc
   * @returns Token object
   */
  public static async getNativeTokenBalance(chain?: string): Promise<any> {
    // Defaults to Eth
    if (!chain) {
      return await Moralis.Web3.getERC20();
    } else {
      return await Moralis.Web3.getERC20({ chain: chain });
    }
  };
}