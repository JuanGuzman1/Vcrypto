import React from "react";
import { View, Text, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import MarketCoin from "../../components/MarketCoin";
import UserRankingItem from "../../components/UserRankingItem";
import styles from "./styles";
const image = require("../../../assets/images/Saly-20.png");

const portfolioCoins = [
  {
    id: "1",
    name: "Virtual Dollars",
    image: "http://abancainnova.com/wp-content/uploads/2017/09/Bitcoin.png",
    netWorth: 6942,
  },
  {
    id: "2",
    name: "Bitcoin",
    image: "abc",
    netWorth: 6942,
  },
  {
    id: "3",
    name: "Etherium",
    image: "abc",
    netWorth: 6942,
  },
];

const RankingsScreen = () => {
  return (
    <View style={styles.root}>
      <FlatList
        style={{ width: "100%" }}
        data={portfolioCoins}
        renderItem={({ item, index }) => <UserRankingItem user={item} place={index+1}/>}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={{ alignItems: "center" }}
        ListHeaderComponent={() => (
          <>
            <Image style={styles.image} source={image} />
          </>
        )}
      />
    </View>
  );
};

export default RankingsScreen;
