import { GyroscopeCard } from "@/components/gyroscope-card";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";

const index = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GyroscopeCard />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090f",
  },
});
