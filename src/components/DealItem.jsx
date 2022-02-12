import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { priceDisplay } from "./util";

const DealItem = ({ deal, onPress }) => {
  const handlePress = () => {
    onPress(deal.key);
  };
  return (
    <TouchableOpacity style={styles.deal} onPress={handlePress}>
      <Image style={styles.image} source={{ uri: deal.media[0] }} />
      <View style={styles.info}>
        <Text style={styles.title}> {deal.title}</Text>
        <View style={styles.footer}>
          <Text style={styles.cause}>{deal.cause.name}</Text>
          <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deal: {
    marginHorizontal: 12,
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
  },
  info: {
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#bbb",
    borderWidth: 1,
    borderTopWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  footer: {
    flexDirection: "row",
  },
  cause: {
    flex: 2,
  },
  price: {
    flex: 1,
    textAlign: "right",
  },
});
export default DealItem;
