import { TextInput, StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";

const SearchBar = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (term) => {
    setSearchTerm(term);
    search(term);
  };

  const search = useCallback(debounce(props.searchDeals, 2000), []);

  return (
    <TextInput
      style={styles.input}
      placeholder="Search Deal"
      onChangeText={handleChange}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});
export default SearchBar;
