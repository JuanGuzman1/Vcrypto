import { useNavigation, CommonActions } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { getUser } from "../../graphql/queries";
import styles from "./styles";
import AppContext from "../../utils/AppContext";
const image = require("../../../assets/images/Saly-16.png");

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const { userId } = useContext(AppContext);
  const signOut = async () => {
    await Auth.signOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      })
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.graphql(
          graphqlOperation(getUser, { id: userId })
        );
        setUser(response.data.getUser);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.root}>
      <Image style={styles.image} source={image} />
      <View style={styles.userContainer}>
        <View style={styles.left}>
          <Image style={styles.userImage} source={{ uri: user.image }} />
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.value}>${user.networth}</Text>
        </View>
      </View>
      <Pressable onPress={signOut} style={{ marginTop: "auto" }}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;
