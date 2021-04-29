import React from "react";
import { View, Text, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import PortfolioCoin from "../../components/PortfolioCoin";
import styles from "./styles";
const image = require("../../../assets/images/Saly-10.png");

const portfolioCoins = [
  {
    id: "1",
    name: "Virtual Dollars",
    image: "http://abancainnova.com/wp-content/uploads/2017/09/Bitcoin.png",
    symbol: "USD",
    amount: 69.42,
    valueUSD: 6942,
  },
  {
    id: "2",
    name: "Bitcoin",
    image: "abc",
    symbol: "BTC",
    amount: 1.12,
    valueUSD: 6942,
  },
  {
    id: "3",
    name: "Etherium",
    image: "abc",
    symbol: "ETH",
    amount: 1.12,
    valueUSD: 6942,
  },
];

const PortfolioScreen = () => {
  return (
    <View style={styles.root}>
      <Image style={styles.image} source={image} />
      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Portfolio balance</Text>
        <Text style={styles.balance}>$69.420</Text>
      </View>

      <FlatList
        style={{ width: "100%" }}
        data={portfolioCoins}
        renderItem={({ item }) => <PortfolioCoin portfolioCoin={item} />}
      />
    </View>
  );
};

export default PortfolioScreen;
