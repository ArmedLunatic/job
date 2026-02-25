// ─── $JOB Image Generation — client-side canvas only ─────────────────────────
// No Node.js / server APIs. Runs entirely in the browser.

import type { Stamp, AvatarSource } from "@/lib/job/types";

export type ImageGenOpts = {
  username: string;
  role: string;
  stamp: Stamp;
  avatarSource: AvatarSource;
};

export type ImageGenResult = { blob: Blob; url: string };

// ─── Validation ───────────────────────────────────────────────────────────────

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 4 * 1024 * 1024;

function validate(opts: ImageGenOpts): void {
  const nameLen = opts.username.trim().length;
  if (nameLen < 2 || nameLen > 24)
    throw new Error("Username must be 2–24 characters.");

  if (opts.avatarSource instanceof File) {
    if (!ALLOWED_TYPES.includes(opts.avatarSource.type))
      throw new Error("Photo must be PNG, JPEG, or WebP.");
    if (opts.avatarSource.size > MAX_BYTES)
      throw new Error("Photo must be 4 MB or smaller.");
  }
}

// ─── Image loaders ────────────────────────────────────────────────────────────

async function loadAvatar(
  source: AvatarSource
): Promise<HTMLImageElement | ImageBitmap> {
  if (source === "default") {
    return loadImgElement("/job/job-icon.png");
  }
  // File: try ImageBitmap first, fall back to HTMLImageElement
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(source);
    } catch {
      // fall through
    }
  }
  const url = URL.createObjectURL(source);
  try {
    return await loadImgElement(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImgElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

async function loadJobIcon(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = "/job/job-icon.png";
  });
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob returned null"))),
      "image/png",
      1.0
    );
  });
}

function drawCircleAvatar(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | ImageBitmap,
  cx: number,
  cy: number,
  r: number,
  ringColor?: string,
  ringWidth = 6
): void {
  ctx.save();
  if (ringColor) {
    ctx.beginPath();
    ctx.arc(cx, cy, r + ringWidth, 0, Math.PI * 2);
    ctx.fillStyle = ringColor;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // object-fit: cover
  const iw = "naturalWidth" in img ? img.naturalWidth : (img as ImageBitmap).width;
  const ih = "naturalHeight" in img ? img.naturalHeight : (img as ImageBitmap).height;
  const scale = Math.max((r * 2) / iw, (r * 2) / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
  ctx.restore();
}

function pill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const rad = Math.min(r, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

// ─── Job Alert Card — 1200 × 675 ─────────────────────────────────────────────

export async function generateJobAlertCard(
  opts: ImageGenOpts
): Promise<ImageGenResult> {
  validate(opts);

  const W = 1200;
  const H = 675;
  const HEADER_H = 84;
  const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  const [avatar, icon] = await Promise.all([
    loadAvatar(opts.avatarSource),
    loadJobIcon(),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) throw new Error("Could not get 2D context.");

  // ── White base ──────────────────────────────────────────────────────────────
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);

  // ── Header strip ────────────────────────────────────────────────────────────
  ctx.fillStyle = "#F3F4F6";
  ctx.fillRect(0, 0, W, HEADER_H);

  // Icon in header
  let headerTextX = 28;
  if (icon) {
    const iconSize = 44;
    ctx.save();
    ctx.beginPath();
    ctx.arc(28 + iconSize / 2, HEADER_H / 2, iconSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(icon, 28, (HEADER_H - iconSize) / 2, iconSize, iconSize);
    ctx.restore();
    headerTextX = 28 + iconSize + 12;
  }

  ctx.font = `bold 16px ${FONT}`;
  ctx.fillStyle = "#374151";
  ctx.textBaseline = "middle";
  ctx.fillText("$JOB", headerTextX, HEADER_H / 2);

  ctx.fillStyle = "#D1D5DB";
  ctx.fillRect(headerTextX + 48, HEADER_H / 2 - 10, 1, 20);

  ctx.font = `500 15px ${FONT}`;
  ctx.fillStyle = "#6B7280";
  ctx.fillText("New job alert", headerTextX + 60, HEADER_H / 2);

  // ── Avatar ──────────────────────────────────────────────────────────────────
  const AV_R = 72;
  const AV_CX = 72 + 56; // 56px left margin
  const AV_CY = HEADER_H + 80 + AV_R; // 80px top margin below header

  drawCircleAvatar(ctx, avatar, AV_CX, AV_CY, AV_R);

  // ── Text block ──────────────────────────────────────────────────────────────
  const TX = AV_CX + AV_R + 32;

  // @username
  ctx.font = `bold 34px ${FONT}`;
  ctx.fillStyle = "#111827";
  ctx.textBaseline = "top";
  const displayName = opts.username.trim().startsWith("@")
    ? opts.username.trim()
    : `@${opts.username.trim()}`;
  ctx.fillText(displayName, TX, AV_CY - AV_R + 4);

  // Subtitle
  ctx.font = `400 22px ${FONT}`;
  ctx.fillStyle = "#6B7280";
  ctx.fillText("just started a new $job", TX, AV_CY - AV_R + 48);

  // Role pill
  const PILL_LABEL =
    opts.role.charAt(0).toUpperCase() + opts.role.slice(1);
  ctx.font = `600 15px ${FONT}`;
  const labelW = ctx.measureText(PILL_LABEL).width;
  const PW = labelW + 28;
  const PH = 32;
  const PX = TX;
  const PY = AV_CY - AV_R + 88;

  ctx.fillStyle = "#EFF6FF";
  pill(ctx, PX, PY, PW, PH, 16);
  ctx.fill();

  ctx.fillStyle = "#2563EB";
  ctx.textBaseline = "middle";
  ctx.fillText(PILL_LABEL, PX + 14, PY + PH / 2);

  // ── Bottom buttons (visual) ──────────────────────────────────────────────────
  const BTN_CY = H - 68;
  const BTN_H = 46;
  const RIGHT_EDGE = W - 60;

  // "Send a message" (filled blue)
  const MSG = "Send a message";
  ctx.font = `600 17px ${FONT}`;
  const mW = ctx.measureText(MSG).width + 40;
  const MX = RIGHT_EDGE - mW;

  ctx.fillStyle = "#2563EB";
  pill(ctx, MX, BTN_CY - BTN_H / 2, mW, BTN_H, BTN_H / 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.textBaseline = "middle";
  ctx.fillText(MSG, MX + 20, BTN_CY);

  // "Congrats 💙" (outlined)
  const CG = "Congrats 💙";
  ctx.font = `600 17px ${FONT}`;
  const cW = ctx.measureText(CG).width + 40;
  const CX = MX - cW - 12;

  ctx.strokeStyle = "#D1D5DB";
  ctx.lineWidth = 2;
  pill(ctx, CX, BTN_CY - BTN_H / 2, cW, BTN_H, BTN_H / 2);
  ctx.stroke();
  ctx.fillStyle = "#374151";
  ctx.fillText(CG, CX + 20, BTN_CY);

  // ── Subtle bottom border ────────────────────────────────────────────────────
  ctx.fillStyle = "#F9FAFB";
  ctx.fillRect(0, H - 1, W, 1);

  const blob = await canvasToBlob(canvas);
  return { blob, url: URL.createObjectURL(blob) };
}

// ─── Badge PFP — 1024 × 1024 ─────────────────────────────────────────────────

const STAMP_TEXT: Record<Stamp, string> = {
  none: "",
  star: "ALL STAR",
  rocket: "HIRED",
  crown: "LEGEND",
  lightning: "NIGHT SHIFT",
  heart: "UNFIREABLE",
};

const STAMP_COLOR: Record<Stamp, string> = {
  none: "#3B82F6",
  star: "#F59E0B",
  rocket: "#10B981",
  crown: "#8B5CF6",
  lightning: "#3B82F6",
  heart: "#EF4444",
};

export async function generateBadgePfp(
  opts: ImageGenOpts
): Promise<ImageGenResult> {
  validate(opts);

  const S = 1024;
  const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  const avatar = await loadAvatar(opts.avatarSource);

  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) throw new Error("Could not get 2D context.");

  // ── Background gradient ──────────────────────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, "#0A0A0A");
  grad.addColorStop(1, "#111827");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  // Subtle radial highlight
  const radial = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.7);
  radial.addColorStop(0, "rgba(59,130,246,0.08)");
  radial.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, S, S);

  // ── "$JOB" top ───────────────────────────────────────────────────────────────
  ctx.font = `bold 72px ${FONT}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.fillText("$JOB", S / 2, 44);

  // ── Avatar circle ────────────────────────────────────────────────────────────
  const AV_R = 196;
  const AV_CX = S / 2;
  const AV_CY = S / 2 - 20; // slightly above center

  // Outer glow ring
  ctx.save();
  ctx.shadowColor = "rgba(59,130,246,0.5)";
  ctx.shadowBlur = 32;
  ctx.beginPath();
  ctx.arc(AV_CX, AV_CY, AV_R + 8, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(59,130,246,0.2)";
  ctx.fill();
  ctx.restore();

  drawCircleAvatar(ctx, avatar, AV_CX, AV_CY, AV_R, "#FFFFFF", 5);

  // ── @username ────────────────────────────────────────────────────────────────
  const displayName = opts.username.trim().startsWith("@")
    ? opts.username.trim()
    : `@${opts.username.trim()}`;
  ctx.font = `600 26px ${FONT}`;
  ctx.fillStyle = "#E5E7EB";
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.fillText(displayName, S / 2, AV_CY + AV_R + 24);

  // ── Role ─────────────────────────────────────────────────────────────────────
  const roleLabel = opts.role.charAt(0).toUpperCase() + opts.role.slice(1);
  ctx.font = `400 20px ${FONT}`;
  ctx.fillStyle = "#6B7280";
  ctx.fillText(roleLabel, S / 2, AV_CY + AV_R + 60);

  // ── Stamp ────────────────────────────────────────────────────────────────────
  const stampText = STAMP_TEXT[opts.stamp];
  if (stampText) {
    ctx.font = `bold 52px ${FONT}`;
    ctx.fillStyle = STAMP_COLOR[opts.stamp];
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";
    ctx.fillText(stampText, S / 2, S - 40);
  }

  // ── Subtle corner decoration ─────────────────────────────────────────────────
  ctx.textBaseline = "bottom";
  ctx.font = `400 13px ${FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.textAlign = "right";
  ctx.fillText("$JOB • employee wall", S - 20, S - 16);

  const blob = await canvasToBlob(canvas);
  return { blob, url: URL.createObjectURL(blob) };
}
