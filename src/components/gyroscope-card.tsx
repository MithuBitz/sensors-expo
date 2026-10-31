import { useGyroscope } from "@/hooks/use-gyroscope";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_WIDTH = 300;
const CARD_HEIGHT = 180;

// Turn rad/s into visible degrees on the card
const TILT = 12;

export function GyroscopeCard() {
  const insets = useSafeAreaInsets();
  const { available, x, y, z } = useGyroscope();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>3D Card (Gyroscope)</Text>
      <Text style={styles.subtitle}>
        Rotate the phone slowly. The card tilts while you spin. When you stop,
        the card goes flat again.
      </Text>

      <View style={styles.sensorBox}>
        <Text style={styles.sensorTitle}>Gyroscope (rad/s)</Text>
        <Text style={styles.sensorLine}>x: {x.toFixed(2)}</Text>
        <Text style={styles.sensorLine}>y: {y.toFixed(2)}</Text>
        <Text style={styles.sensorLine}>z: {z.toFixed(2)}</Text>
        <Text style={styles.sensorHint}>
          Still phone → values near 0. Twist phone → z changes. Tilt
          forward/back → x or y change.
        </Text>
      </View>

      {available === false && (
        <Text style={styles.warning}>Gyroscope not available.</Text>
      )}

      <View style={styles.stage}>
        <View
          style={[
            styles.card,
            {
              transform: [
                { perspective: 1000 },
                { rotateX: `${y * TILT}deg` },
                { rotateY: `${-x * TILT}deg` },
              ],
            },
          ]}
        >
          <View style={styles.chip} />
          <Text style={styles.brand}>MitCode</Text>
          <Text style={styles.number}>4921 8834 1209 5502</Text>
          <Text style={styles.name}>Sensors Lab</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Card tilt: rotateX = y × {TILT}, rotateY = -x × {TILT}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#09090f",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    color: "#f4f4f5",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#a1a1aa",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  sensorBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  sensorTitle: {
    color: "#a78bfa",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  sensorLine: {
    color: "#e4e4e7",
    fontSize: 18,
    fontFamily: "monospace",
  },
  sensorHint: {
    color: "#71717a",
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },
  warning: {
    color: "#fbbf24",
    marginTop: 8,
    fontSize: 13,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: "#5b21b6",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    padding: 24,
  },
  chip: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#fbbf24",
    marginBottom: 20,
  },
  brand: {
    color: "#fafafa",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "right",
    marginTop: -40,
  },
  number: {
    color: "#fafafa",
    fontSize: 18,
    letterSpacing: 2,
    marginTop: 36,
    fontWeight: "600",
  },
  name: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 8,
  },
  footer: {
    color: "#71717a",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
});
