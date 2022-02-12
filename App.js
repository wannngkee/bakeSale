import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import DealList from "./src/components/DealList";
import DealDetail from "./src/components/DealDetail";
import SearchBar from "./src/components/SearchBar";
import { fetchInitialDeals, fetchSearchResults } from "./src/components/ajax";
export default function App() {
  const [deals, setDeals] = useState([]);
  const [dealId, setDealId] = useState(null);
  const [dealsFromSearch, setDealsFromSearch] = useState([]);
  const titleXPos = useRef(new Animated.Value(0)).current;
  const animateTitle = (direction = 1) => {
    const width = Dimensions.get("window").width - 150;
    Animated.timing(titleXPos, {
      toValue: (direction * width) / 2,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        animateTitle(-1 * direction);
      }
    });
  };
  useEffect(() => {
    animateTitle();
  }, [titleXPos]);
  useEffect(() => {
    fetchInitialDeals().then((data) => {
      data && setDeals(data);
    });
  }, []);
  useEffect(() => {
    if (dealsFromSearch.length > 0) {
      setDeals(dealsFromSearch);
    }
  }, [dealsFromSearch]);
  const setCurrentDeal = (dealId) => {
    setDealId(dealId);
  };
  const unsetCurrentDeal = () => {
    setDealId(null);
  };
  const currentDeal = () => {
    return deals.find((deal) => deal.key === dealId);
  };
  const searchDeals = (term) => {
    fetchSearchResults(term).then((data) => {
      setDealsFromSearch(data);
    });
  };

  return (
    <View style={styles.container}>
      {dealId ? (
        <DealDetail initialDealData={currentDeal()} onBack={unsetCurrentDeal} />
      ) : deals.length > 0 ? (
        <View>
          <SearchBar searchDeals={searchDeals} />
          <DealList deals={deals} onItemPress={setCurrentDeal} />
        </View>
      ) : (
        <Animated.View style={[{ left: titleXPos }, styles.box]}>
          <Text style={styles.header}>BakeSale</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  box: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 16,
  },
});
