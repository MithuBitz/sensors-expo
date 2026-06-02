import { TitleGame } from "@/components/titl-game";
import { useAccelerometer } from "@/hooks/use-accelerometer";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";

const IndesScreen = () => {
  const { available, x, y, z } = useAccelerometer();
  // console.log(available, x, y, z);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TitleGame />
    </View>
  );
};

export default IndesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
});
