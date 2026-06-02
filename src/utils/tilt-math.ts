export type Vec2 = { x: number; y: number };

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function magnitude({ x, y }: Vec2): number {
  return Math.sqrt(x * x + y * y);
}

export function subtractTilt(
  tilt: Vec2,
  offset: Vec2
): Vec2 {
  return { x: tilt.x - offset.x, y: tilt.y - offset.y };
}

export function smoothVec2(
  current: Vec2,
  target: Vec2,
  factor: number
): Vec2 {
  const t = clamp(factor, 0, 1);
  return {
    x: current.x + (target.x - current.x) * t,
    y: current.y + (target.y - current.y) * t,
  };
}

export function applyTiltForce(
  velocity: Vec2,
  tilt: Vec2,
  dt: number,
  sensitivity: number
): Vec2 {
  return {
    x: velocity.x + tilt.x * sensitivity * dt,
    y: velocity.y + tilt.y * sensitivity * dt,
  };
}

export function applyFriction(velocity: Vec2, friction: number): Vec2 {
  return { x: velocity.x * friction, y: velocity.y * friction };
}

export function integratePosition(
  position: Vec2,
  velocity: Vec2,
  dt: number
): Vec2 {
  return {
    x: position.x + velocity.x * dt,
    y: position.y + velocity.y * dt,
  };
}

export function bounceInBounds(
  position: Vec2,
  velocity: Vec2,
  bounds: { width: number; height: number },
  ballSize: number
): { position: Vec2; velocity: Vec2; hitWall: boolean } {
  const maxX = bounds.width / 2 - ballSize / 2;
  const maxY = bounds.height / 2 - ballSize / 2;
  let hitWall = false;
  let { x, y } = position;
  let vx = velocity.x;
  let vy = velocity.y;

  if (x < -maxX) {
    x = -maxX;
    vx = Math.abs(vx) * 0.65;
    hitWall = true;
  } else if (x > maxX) {
    x = maxX;
    vx = -Math.abs(vx) * 0.65;
    hitWall = true;
  }

  if (y < -maxY) {
    y = -maxY;
    vy = Math.abs(vy) * 0.65;
    hitWall = true;
  } else if (y > maxY) {
    y = maxY;
    vy = -Math.abs(vy) * 0.65;
    hitWall = true;
  }

  return { position: { x, y }, velocity: { x: vx, y: vy }, hitWall };
}

export function holeCenter(
  bounds: { width: number; height: number },
  corner: "top-right" | "top-left" | "bottom-right" | "bottom-left"
): Vec2 {
  const margin = 36;
  const halfW = bounds.width / 2 - margin;
  const halfH = bounds.height / 2 - margin;

  switch (corner) {
    case "top-right":
      return { x: halfW, y: -halfH };
    case "top-left":
      return { x: -halfW, y: -halfH };
    case "bottom-right":
      return { x: halfW, y: halfH };
    case "bottom-left":
      return { x: -halfW, y: halfH };
  }
}

export function isBallInHole(
  ball: Vec2,
  hole: Vec2,
  ballSize: number,
  holeSize: number
): boolean {
  const captureRadius = (holeSize + ballSize) / 2 - 4;
  return magnitude({ x: ball.x - hole.x, y: ball.y - hole.y }) < captureRadius;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
