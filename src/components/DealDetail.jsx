import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Button,
  Linking,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { priceDisplay } from "./util";
import { fetchDealDetail } from "./ajax";

const DealDetail = (props) => {
  const [deal, setDeal] = useState(props.initialDealData);
  const [imgId, setImgId] = useState(0);
  const index = useRef();
  const imgXPos = useRef(new Animated.Value(0)).current;
  const width = Dimensions.get("window").width;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gs) => {
        imgXPos.setValue(gs.dx);
      },
      onPanResponderRelease: (evt, gs) => {
        if (Math.abs(gs.dx) > width * 0.4) {
          const direction = Math.sign(gs.dx);
          // -1 for swipe left, 1 for swipe right
          Animated.timing(imgXPos, {
            toValue: direction * width,
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            handleSwipe(-1 * direction);
          });
        } else {
          Animated.spring(imgXPos, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;
  const handleSwipe = (dire) => {
    if (!deal.media[index.current + dire]) {
      Animated.spring(imgXPos, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      return;
    } else {
      setImgId((prev) => prev + dire);
      imgXPos.setValue(width * dire);
    }
  };
  useEffect(() => {
    index.current = imgId;
    Animated.spring(imgXPos, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }, [imgId]);
  useEffect(() => {
    fetchDealDetail(deal.key).then((data) => {
      data && setDeal(data);
    });
  }, []);
  const openUrl = () => {
    Linking.openURL(deal.url);
  };
  return (
    <View style={styles.deal}>
      <TouchableOpacity onPress={props.onBack}>
        <Text style={styles.backLink}>Back</Text>
      </TouchableOpacity>
      <Animated.Image
        style={[{ left: imgXPos }, styles.image]}
        source={{ uri: deal.media[imgId] }}
        {...panResponder.panHandlers}
      />
      <View>
        <Text style={styles.title}> {deal.title}</Text>
      </View>
      <ScrollView style={styles.detail}>
        <View style={styles.footer}>
          <View style={styles.info}>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
            <Text style={styles.cause}>{deal.cause.name}</Text>
          </View>
          {deal.user && (
            <View style={styles.user}>
              <Image style={styles.avatar} source={{ uri: deal.user.avatar }} />
              <Text>{deal.user.name}</Text>
            </View>
          )}
        </View>
        <View style={styles.description}>
          <Text>{deal.description}</Text>
        </View>
        <Button title="Buy Deal" onPress={openUrl} />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  deal: {
    marginBottom: 20,
  },
  backLink: {
    marginBottom: 5,
    color: "#22f",
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
  },
  info: {
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    padding: 10,
    fontWeight: "bold",
    backgroundColor: "rgba(237,149, 45, 0.4)",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
  },
  cause: {
    flex: 2,
  },
  price: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "right",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  description: {
    margin: 10,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
});

export default DealDetail;
