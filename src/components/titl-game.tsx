import { useAccelerometer } from "@/hooks/use-accelerometer";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BALL_SIZE = 40;

const MOVE = 100;

const PLAY_BOX_WIDTH = 320;
const PLAY_BOX_HEIGHT = 400;

export function TitleGame() {
  const insets = useSafeAreaInsets();
  const { available, x, y, z } = useAccelerometer();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Tilt the ball</Text>
      <Text style={styles.subtitle}>
        TIle the phone. Watch x and y change and the ball followes x and y.
      </Text>
      <View style={styles.sensorBox}>
        <Text style={styles.sensorTitle}>Accelerometer (g)</Text>
        <Text style={styles.sensorLine}>x 👉 {x.toFixed(2)}</Text>
        <Text style={styles.sensorLine}>y 👉 {y.toFixed(2)}</Text>
        <Text style={styles.sensorLine}>z 👉 {z.toFixed(2)}</Text>
        <Text style={styles.sensorHint}>
          Flat on table → z ≈ 1. Tilt left/right → x changes. Tilt forward/back
          → y changes.
        </Text>
      </View>
      <View style={styles.playBox}>
        <View
          style={[
            styles.ball,
            {
              transform: [{ translateX: x * MOVE }, { translateY: y * MOVE }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b1220",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    color: "#f8fafc",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  sensorBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  sensorTitle: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  sensorLine: {
    color: "#e2e8f0",
    fontSize: 18,
    fontFamily: "monospace",
  },
  sensorHint: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },
  warning: {
    color: "#fbbf24",
    marginTop: 8,
    fontSize: 13,
  },
  playBox: {
    flex: 1,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#334155",
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: "#22d3ee",
  },
  footer: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
});
