import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "./styles";
import PercentageChange from "../../components/PercentageChange";

const CoinDetailsScreen = () => {
  const [coinData, setCoinData] = useState({
    id: "1",
    name: "Bitcoin",
    image: "http://abancainnova.com/wp-content/uploads/2017/09/Bitcoin.png",
    symbol: "BTC",
    valueChange24H: 69.42,
    valueChange1D: 9.42,
    valueChange7D: -9.42,
    currentPrice: 6942,
    amount: 1,
  });

  const onBuy = () => {};

  const onSell = () => {};

  return (
    <View style={styles.root}>
      <View style={styles.topContainer}>
        <View style={styles.left}>
          <Image style={styles.image} source={{ uri: coinData.image }} />
          <View>
            <Text style={styles.name}>{coinData.name}</Text>
            <Text style={styles.symbol}>{coinData.symbol}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Pressable>
            <AntDesign name={"staro"} size={30} color={"#2f95dc"} />
          </Pressable>
        </View>
      </View>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Current Price</Text>
          <Text style={styles.value}>{coinData.currentPrice}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={styles.valueContainer}>
            <Text style={styles.label}>1 hour</Text>
            <PercentageChange value={coinData.valueChange24H} />
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.label}>1 day</Text>
            <PercentageChange value={coinData.valueChange1D} />
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.label}>7 days</Text>
            <PercentageChange value={coinData.valueChange7D} />
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <Text>Position</Text>
        <Text>
          {coinData.symbol} {coinData.amount} (${" "}
          {coinData.currentPrice * coinData.amount})
        </Text>
      </View>

      <View style={[styles.row,{marginTop: 'auto'}]}>
        <Pressable
          style={[styles.button, { backgroundColor: "green" }]}
          onPress={onBuy}
        >
          <Text style={styles.buttonText}>Buy</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={onSell}
        >
          <Text style={styles.buttonText}>Sell</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CoinDetailsScreen;
