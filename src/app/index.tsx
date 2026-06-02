import { TitleGame } from "@/components/titl-game";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

const IndesScreen = () => {
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
