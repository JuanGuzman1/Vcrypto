import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  image: {
    height: 175,
    resizeMode: "contain",
  },
  userImage: {
    height: 75,
    width: 75,
    marginRight: 10,
    borderRadius: 50,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    margin: 10,
    marginVertical: 10,
    width: '100%'
  },
  value:{
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 5
  }
});

export default styles;
