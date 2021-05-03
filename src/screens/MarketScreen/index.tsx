import React from "react";
import { View, Text, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import MarketCoin from "../../components/MarketCoin";
import styles from "./styles";
const image = require("../../../assets/images/Saly-17.png");

const portfolioCoins = [
  {
    id: "1",
    name: "Virtual Dollars",
    image: "http://abancainnova.com/wp-content/uploads/2017/09/Bitcoin.png",
    symbol: "USD",
    valueChange24H: 69.42,
    valueUSD: 6942,
  },
  {
    id: "2",
    name: "Bitcoin",
    image: "http://abancainnova.com/wp-content/uploads/2017/09/Bitcoin.png",
    symbol: "BTC",
    valueChange24H: -1.12,
    valueUSD: 6942,
  },
  {
    id: "3",
    name: "Etherium",
    image: "http://abancainnova.com/wp-content/uploads/2017/09/Bitcoin.png",
    symbol: "ETH",
    valueChange24H: 1.12,
    valueUSD: 6942,
  },
];

const MarketScreen = () => {
  return (
    <View style={styles.root}>
      <FlatList
        style={{ width: "100%" }}
        data={portfolioCoins}
        renderItem={({ item }) => <MarketCoin marketCoin={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={{ alignItems: "center" }}
        ListHeaderComponent={() => (
          <>
            <Image style={styles.image} source={image} />
            <Text style={styles.label}>Market</Text>
          </>
        )}
      />
    </View>
  );
};

export default MarketScreen;
