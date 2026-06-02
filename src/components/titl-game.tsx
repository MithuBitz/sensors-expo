import {
  useTiltBall,
  type Sensitivity,
} from "@/hooks/use-tilt-ball";
import { formatDuration } from "@/utils/tilt-math";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function SensitivityButton({
  level,
  active,
  onPress,
}: {
  level: Sensitivity;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.sensBtn, active && styles.sensBtnActive]}
    >
      <Text style={[styles.sensBtnText, active && styles.sensBtnTextActive]}>
        {level}
      </Text>
    </Pressable>
  );
}

export function TitleGame() {
  const insets = useSafeAreaInsets();
  const game = useTiltBall();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Tilt maze</Text>
      <Text style={styles.subtitle}>
        Tilt your phone to roll the ball into the hole. Each score moves the
        goal to a new corner.
      </Text>

      {game.available === false && (
        <Text style={styles.warning}>
          Accelerometer not available on this device.
        </Text>
      )}

      <View style={styles.statsRow}>
        <StatChip label="Score" value={String(game.score)} />
        <StatChip label="Level" value={String(game.level)} />
        <StatChip label="Time" value={formatDuration(game.elapsedMs)} />
        <StatChip
          label="Speed"
          value={Math.round(
            Math.sqrt(game.velocity.x ** 2 + game.velocity.y ** 2)
          ).toString()}
        />
      </View>

      <View
        style={[
          styles.playBox,
          game.wallFlash && styles.playBoxFlash,
        ]}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          game.setBounds({ width, height });
        }}
      >
        <View
          style={[
            styles.hole,
            {
              width: game.holeSize,
              height: game.holeSize,
              borderRadius: game.holeSize / 2,
              transform: [
                { translateX: game.hole.x },
                { translateY: game.hole.y },
              ],
            },
          ]}
        />
        <View
          style={[
            styles.ball,
            {
              width: game.ballSize,
              height: game.ballSize,
              borderRadius: game.ballSize / 2,
              transform: [
                { translateX: game.position.x },
                { translateY: game.position.y },
              ],
            },
          ]}
        />
        {game.paused && (
          <View style={styles.pauseOverlay}>
            <Text style={styles.pauseText}>Paused</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Text style={styles.controlLabel}>Sensitivity</Text>
        <View style={styles.sensRow}>
          {(["low", "medium", "high"] as const).map((s) => (
            <SensitivityButton
              key={s}
              level={s}
              active={game.sensitivity === s}
              onPress={() => game.setSensitivity(s)}
            />
          ))}
        </View>
        <View style={styles.btnRow}>
          <Pressable style={styles.btn} onPress={game.calibrate}>
            <Text style={styles.btnText}>Calibrate</Text>
          </Pressable>
          <Pressable
            style={styles.btn}
            onPress={() => game.setPaused(!game.paused)}
          >
            <Text style={styles.btnText}>
              {game.paused ? "Resume" : "Pause"}
            </Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={game.resetBall}>
            <Text style={styles.btnText}>Reset ball</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={game.resetGame}>
            <Text style={styles.btnTextPrimary}>New game</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.sensorBox}>
        <Text style={styles.sensorTitle}>Accelerometer (g)</Text>
        <Text style={styles.sensorLine}>x {game.x.toFixed(2)}</Text>
        <Text style={styles.sensorLine}>y {game.y.toFixed(2)}</Text>
        <Text style={styles.sensorLine}>z {game.z.toFixed(2)}</Text>
        <Text style={styles.sensorLine}>
          tilt {game.tiltMagnitude.toFixed(2)} · goal {game.holeCorner}
        </Text>
        <Text style={styles.sensorHint}>
          Calibrate while holding the phone flat to zero out drift. Flat → z ≈
          1.
        </Text>
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
  warning: {
    color: "#fbbf24",
    marginTop: 8,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  statChip: {
    flex: 1,
    minWidth: 72,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  statLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statValue: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
  },
  playBox: {
    flex: 1,
    minHeight: 220,
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#334155",
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  playBoxFlash: {
    borderColor: "#f97316",
  },
  hole: {
    position: "absolute",
    backgroundColor: "#14532d",
    borderWidth: 3,
    borderColor: "#4ade80",
    opacity: 0.95,
  },
  ball: {
    backgroundColor: "#22d3ee",
    shadowColor: "#22d3ee",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  pauseText: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "700",
  },
  controls: {
    marginTop: 12,
  },
  controlLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  sensRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  sensBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  sensBtnActive: {
    backgroundColor: "#0e7490",
    borderColor: "#22d3ee",
  },
  sensBtnText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  sensBtnTextActive: {
    color: "#f0f9ff",
  },
  btnRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  btnPrimary: {
    backgroundColor: "#0369a1",
    borderColor: "#0ea5e9",
  },
  btnText: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "600",
  },
  btnTextPrimary: {
    color: "#f0f9ff",
    fontSize: 13,
    fontWeight: "600",
  },
  sensorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  sensorTitle: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  sensorLine: {
    color: "#e2e8f0",
    fontSize: 15,
    fontFamily: "monospace",
  },
  sensorHint: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
});
