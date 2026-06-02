import { useAccelerometer } from "@/hooks/use-accelerometer";
import {
  applyFriction,
  applyTiltForce,
  bounceInBounds,
  holeCenter,
  integratePosition,
  isBallInHole,
  smoothVec2,
  subtractTilt,
  type Vec2,
} from "@/utils/tilt-math";
import { useCallback, useEffect, useRef, useState } from "react";

const BALL_SIZE = 36;
const HOLE_SIZE = 52;
const FRICTION = 0.9;
const SMOOTH_FACTOR = 0.35;

export type Sensitivity = "low" | "medium" | "high";

const SENSITIVITY_MAP: Record<Sensitivity, number> = {
  low: 420,
  medium: 620,
  high: 900,
};

const HOLE_CORNERS = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
] as const;

export function useTiltBall() {
  const { available, x, y, z } = useAccelerometer();
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState<Vec2>({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState<Vec2>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [sensitivity, setSensitivity] = useState<Sensitivity>("medium");
  const [calibration, setCalibration] = useState<Vec2>({ x: 0, y: 0 });
  const [wallFlash, setWallFlash] = useState(false);
  const [paused, setPaused] = useState(false);

  const velocityRef = useRef(velocity);
  const positionRef = useRef(position);
  const smoothedTiltRef = useRef<Vec2>({ x: 0, y: 0 });
  const lastFrameRef = useRef<number | null>(null);
  const gameStartRef = useRef(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  const holeCorner = HOLE_CORNERS[(level - 1) % HOLE_CORNERS.length];
  const hole =
    bounds.width > 0
      ? holeCenter(bounds, holeCorner)
      : { x: 0, y: 0 };
  const holeX = hole.x;
  const holeY = hole.y;

  const resetBall = useCallback(() => {
    positionRef.current = { x: 0, y: 0 };
    velocityRef.current = { x: 0, y: 0 };
    smoothedTiltRef.current = { x: 0, y: 0 };
    setPosition({ x: 0, y: 0 });
    setVelocity({ x: 0, y: 0 });
  }, []);

  const resetGame = useCallback(() => {
    resetBall();
    setScore(0);
    setLevel(1);
    gameStartRef.current = Date.now();
    setElapsedMs(0);
    setPaused(false);
  }, [resetBall]);

  const calibrate = useCallback(() => {
    setCalibration({ x, y });
    resetBall();
  }, [x, y, resetBall]);

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (paused || bounds.width === 0 || available === false) return;

    let raf = 0;
    const tick = (now: number) => {
      const last = lastFrameRef.current ?? now;
      const dt = Math.min((now - last) / 1000, 0.05);
      lastFrameRef.current = now;

      const rawTilt = subtractTilt({ x, y }, calibration);
      smoothedTiltRef.current = smoothVec2(
        smoothedTiltRef.current,
        rawTilt,
        SMOOTH_FACTOR
      );

      let vel = applyTiltForce(
        velocityRef.current,
        smoothedTiltRef.current,
        dt,
        SENSITIVITY_MAP[sensitivity]
      );
      vel = applyFriction(vel, FRICTION);

      let pos = integratePosition(positionRef.current, vel, dt);
      const bounced = bounceInBounds(pos, vel, bounds, BALL_SIZE);
      pos = bounced.position;
      vel = bounced.velocity;

      if (bounced.hitWall) {
        setWallFlash(true);
        setTimeout(() => setWallFlash(false), 120);
      }

      if (
        isBallInHole(
          pos,
          { x: holeX, y: holeY },
          BALL_SIZE,
          HOLE_SIZE
        )
      ) {
        setScore((s) => s + 1);
        setLevel((l) => l + 1);
        resetBall();
      } else {
        positionRef.current = pos;
        velocityRef.current = vel;
        setPosition(pos);
        setVelocity(vel);
      }

      setElapsedMs(Date.now() - gameStartRef.current);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    available,
    bounds,
    calibration,
    holeX,
    holeY,
    paused,
    resetBall,
    sensitivity,
    x,
    y,
  ]);

  return {
    available,
    x,
    y,
    z,
    bounds,
    setBounds,
    position,
    velocity,
    score,
    level,
    hole,
    holeCorner,
    sensitivity,
    setSensitivity,
    calibration,
    calibrate,
    resetBall,
    resetGame,
    paused,
    setPaused,
    wallFlash,
    elapsedMs,
    ballSize: BALL_SIZE,
    holeSize: HOLE_SIZE,
    tiltMagnitude: Math.sqrt(x * x + y * y),
  };
}
