/* Amplify Params - DO NOT EDIT
	API_VCRYPTO_GRAPHQLAPIENDPOINTOUTPUT
	API_VCRYPTO_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { CognitoIdentityServiceProvider, DynamoDB } = require("aws-sdk");
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const ddb = new DynamoDB();

/**
 * Get user pool information from environment variables.
 */
const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
if (!COGNITO_USERPOOL_ID) {
  throw new Error(
    `Function requires environment variable: 'COGNITO_USERPOOL_ID'`
  );
}
const COGNITO_USERNAME_CLAIM_KEY = "cognito:username";

const getCoinAmount = async (coinPortfolioCoinId, userId) => {
  const params = {
    Key: {
      id: { S: coinPortfolioCoinId },
    },
    TableName: process.env.PORTFOLIO_COIN_TABLE,
  };

  const coinData = await ddb.getItem(params).promise();
  if (
    coinData &&
    coinData.Item &&
    coinData.Item.amount &&
    coinData.Item.amount.N
  ) {
    return coinData.Item.amount.N;
  }

  return 0;
};

const getUsdAmount = async (usdPortfolioCoinId, userId) => {
  const params = {
    Key: {
      id: { S: usdPortfolioCoinId },
    },
    TableName: process.env.PORTFOLIO_COIN_TABLE,
  };

  const coinData = await ddb.getItem(params).promise();
  //TOdo check if it is indeed USD coin , and belongs to user
  if (
    coinData &&
    coinData.Item &&
    coinData.Item.amount &&
    coinData.Item.amount.N
  ) {
    return coinData.Item.amount.N;
  }

  return 0;
};

const getCoin = async (coinId) => {
  const params = {
    Key: {
      id: { S: coinId },
    },
    TableName: process.env.COIN_TABLE,
  };

  const coinData = await ddb.getItem(params).promise();
  return coinData;
};

const canBuyCoin = (coin, amountToBuy, usdAmount) => {
  return usdAmount >= coin.Item.currentPrice.N * amountToBuy;
};

const canSellCoin = (amountToSell, portfolioAmount) => {
  return portfolioAmount >= amountToSell;
};

const buyCoin = async (
  coin,
  amountToBuy,
  usdPortfolioCoinId,
  usdAmount,
  coinAmount,
  userId
) => {
  const date = new Date();
  //decrease USD
  const newUsdAmount = usdAmount - coin.Item.currentPrice.N * amountToBuy;
  const params = {
    Item: {
      id: { S: usdPortfolioCoinId },
      __typename: { S: "PortfolioCoin" },
      createdAt: { S: date.toISOString() },
      updatedAt: { S: date.toISOString() },
      userId: { S: userId },
      coinId: { S: process.env.USD_COIN_ID },
      amount: { N: newUsdAmount.toString() },
    },
    TableName: process.env.PORTFOLIO_COIN_TABLE,
  };

  await ddb.putItem(params).promise();

  //add new portfolio coin, or update the existing one

  const newCoinAmount = coinAmount + amountToBuy;
  const params1 = {
    Item: {
      id: { S: `${userId}-${coin.Item.symbol.S}` },
      __typename: { S: "PortfolioCoin" },
      createdAt: { S: date.toISOString() },
      updatedAt: { S: date.toISOString() },
      userId: { S: userId },
      coinId: { S: coin.Item.id.S },
      amount: { N: newCoinAmount.toString() },
    },
    TableName: process.env.PORTFOLIO_COIN_TABLE,
  };

  await ddb.putItem(params1).promise();
};

const sellCoin = async (
  coin,
  amountToSell,
  usdPortfolioCoinId,
  usdAmount,
  coinAmount,
  userId
) => {
  const date = new Date();
  //increase USD
  const newUsdAmount = usdAmount + coin.Item.currentPrice.N * amountToSell;
  const params = {
    Item: {
      id: { S: usdPortfolioCoinId },
      __typename: { S: "PortfolioCoin" },
      createdAt: { S: date.toISOString() },
      updatedAt: { S: date.toISOString() },
      userId: { S: userId },
      coinId: { S: process.env.USD_COIN_ID },
      amount: { N: newUsdAmount.toString() },
    },
    TableName: process.env.PORTFOLIO_COIN_TABLE,
  };

  await ddb.putItem(params).promise();

  //add new portfolio coin, or update the existing one

  const newCoinAmount = coinAmount - amountToSell;
  const params1 = {
    Item: {
      id: { S: `${userId}-${coin.Item.symbol.S}` },
      __typename: { S: "PortfolioCoin" },
      createdAt: { S: date.toISOString() },
      updatedAt: { S: date.toISOString() },
      userId: { S: userId },
      coinId: { S: coin.Item.id.S },
      amount: { N: newCoinAmount.toString() },
    },
    TableName: process.env.PORTFOLIO_COIN_TABLE,
  };

  await ddb.putItem(params1).promise();
};

const resolvers = {
  Mutation: {
    exchangeCoins: async (ctx) => {
      const { coinId, isBuy, amount, usdPortfolioCoinId, coinPortfolioCoinId } =
        ctx.arguments;
      const userId = ctx.identity.sub;

      const params = {
        UserPoolId: COGNITO_USERPOOL_ID /* required */,
        Username:
          ctx.identity.claims[COGNITO_USERNAME_CLAIM_KEY] /* required */,
      };
      try {
        // Read more: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminGetUser-property
        const userResponse = await cognitoIdentityServiceProvider
          .adminGetUser(params)
          .promise();
      } catch (e) {
        console.log(e);
        //throw new Error(`NOT FOUND`);
      }

      const usdAmount = !usdPortfolioCoinId
        ? 0
        : await getUsdAmount(usdPortfolioCoinId, userId);
      const coinAmount = !coinPortfolioCoinId
        ? 0
        : await getCoinAmount(coinPortfolioCoinId, userId);
      const coin = await getCoin(coinId);

      try {
        if (isBuy && canBuyCoin(coin, amount, usdAmount)) {
          await buyCoin(
            coin,
            amount,
            usdPortfolioCoinId,
            usdAmount,
            coinAmount,
            userId
          );
        } else if (!isBuy && canSellCoin(amount, coinAmount)) {
          await sellCoin(
            coin,
            amount,
            usdPortfolioCoinId,
            usdAmount,
            coinAmount,
            userId
          );
        } else {
          throw new Error(
            isBuy ? `NOT ENOUGH USD` : `NOT ENOUGH COINS TO SELL`
          );
        }
      } catch (e) {
        console.log(e);
        throw new Error(`UNEXPECTED ERROR EXCHANGING COINS`);
      }

      return true;
    },
  },
};

exports.handler = async (event) => {
  const typeHandler = resolvers[event.typeName];
  if (typeHandler) {
    const resolver = typeHandler[event.fieldName];
    if (resolver) {
      return await resolver(event);
    }
  }
  throw new Error("Resolver not found.");
};
