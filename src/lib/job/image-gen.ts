// ─── $JOB Image Generation — client-side canvas only ─────────────────────────
// No Node.js / server APIs. Runs entirely in the browser.

import type { Stamp, AvatarSource } from "@/lib/job/types";

export type ImageGenOpts = {
  username: string;
  role: string;
  stamp: Stamp;
  avatarSource: AvatarSource;
  // LinkedIn-style card copy
  roleLine?: string;      // e.g. "Chief Shill Officer · $JOB Corp"
  timestamp?: string;     // e.g. "just now · 🌐"
  statusBanner?: string;  // e.g. "started a new position"
  position?: string;      // e.g. "Full-Time Holder"
  companyLine?: string;   // e.g. "$JOB on Solana"
  content?: string;       // post body text
  likes?: number;
  comments?: number;
  shares?: number;
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

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): void {
  const words = text.split(" ");
  let line = "";
  let lineCount = 0;
  for (const word of words) {
    const testLine = line ? line + " " + word : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      lineCount++;
      if (lineCount >= maxLines) {
        let trunc = word;
        while (ctx.measureText(trunc + "…").width > maxWidth && trunc.length > 0)
          trunc = trunc.slice(0, -1);
        ctx.fillText(trunc + "…", x, y + lineCount * lineHeight);
        return;
      }
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line && lineCount < maxLines) ctx.fillText(line, x, y + lineCount * lineHeight);
}

// ─── Job Alert Card — 1200 × 675 ─────────────────────────────────────────────

export async function generateJobAlertCard(
  opts: ImageGenOpts
): Promise<ImageGenResult> {
  validate(opts);

  const W = 1200;
  const H = 675;
  const PAD = 52;
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

  // ── White base ───────────────────────────────────────────────────────────────
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);

  const displayName = opts.username.trim().startsWith("@")
    ? opts.username.trim()
    : `@${opts.username.trim()}`;

  // ── Section 1: Header — avatar + name block + Follow button ─────────────────
  const AV_R = 44;
  const AV_CX = PAD + AV_R;
  const AV_CY = 36 + AV_R;
  drawCircleAvatar(ctx, avatar, AV_CX, AV_CY, AV_R, "#E5E7EB", 3);

  const TX = AV_CX + AV_R + 20;

  ctx.font = `bold 26px ${FONT}`;
  ctx.fillStyle = "#111827";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(displayName, TX, 40);

  const roleLine = opts.roleLine ?? `${opts.role.charAt(0).toUpperCase() + opts.role.slice(1)} · $JOB Corp`;
  ctx.font = `400 17px ${FONT}`;
  ctx.fillStyle = "#6B7280";
  ctx.fillText(roleLine, TX, 74);

  const timestamp = opts.timestamp ?? "just now · 🌐";
  ctx.font = `400 13px ${FONT}`;
  ctx.fillStyle = "#9CA3AF";
  ctx.fillText(timestamp, TX, 100);

  // Follow button (outlined, top-right)
  const FOLLOW_W = 116;
  const FOLLOW_H = 36;
  const FOLLOW_X = W - PAD - FOLLOW_W;
  const FOLLOW_Y = 58;

  ctx.strokeStyle = "#2563EB";
  ctx.lineWidth = 2;
  pill(ctx, FOLLOW_X, FOLLOW_Y, FOLLOW_W, FOLLOW_H, FOLLOW_H / 2);
  ctx.stroke();
  ctx.font = `600 15px ${FONT}`;
  ctx.fillStyle = "#2563EB";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("+ Follow", FOLLOW_X + FOLLOW_W / 2, FOLLOW_Y + FOLLOW_H / 2);

  // ··· more dots
  ctx.font = `bold 22px ${FONT}`;
  ctx.fillStyle = "#9CA3AF";
  ctx.textAlign = "right";
  ctx.fillText("···", FOLLOW_X - 20, FOLLOW_Y + FOLLOW_H / 2);

  // ── Section 2: Status banner ─────────────────────────────────────────────────
  const BANNER_Y = 144;
  const BANNER_H = 60;
  ctx.fillStyle = "#EBF3FB";
  ctx.fillRect(0, BANNER_Y, W, BANNER_H);

  const statusBanner = opts.statusBanner ?? "started a new position";
  ctx.font = `500 18px ${FONT}`;
  ctx.fillStyle = "#374151";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(`🎉  ${displayName} ${statusBanner}`, PAD, BANNER_Y + BANNER_H / 2);

  // ── Section 3: Position box ───────────────────────────────────────────────────
  const BOX_Y = 220;
  const BOX_H = 112;
  ctx.fillStyle = "#F3F4F6";
  roundRect(ctx, PAD, BOX_Y, W - PAD * 2, BOX_H, 8);
  ctx.fill();

  // Company logo inside box
  const LOGO_R = 34;
  const LOGO_CX = PAD + 20 + LOGO_R;
  const LOGO_CY = BOX_Y + BOX_H / 2;
  if (icon) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(LOGO_CX, LOGO_CY, LOGO_R, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(icon, LOGO_CX - LOGO_R, LOGO_CY - LOGO_R, LOGO_R * 2, LOGO_R * 2);
    ctx.restore();
  }

  const POS_TX = LOGO_CX + LOGO_R + 18;
  const position = opts.position ?? "Full-Time Holder";
  ctx.font = `bold 22px ${FONT}`;
  ctx.fillStyle = "#111827";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(position, POS_TX, BOX_Y + 20);

  const companyLine = opts.companyLine ?? "$JOB on Solana";
  ctx.font = `400 16px ${FONT}`;
  ctx.fillStyle = "#6B7280";
  ctx.fillText(companyLine, POS_TX, BOX_Y + 50);

  ctx.font = `400 13px ${FONT}`;
  ctx.fillStyle = "#9CA3AF";
  ctx.fillText("Full-time · Just started", POS_TX, BOX_Y + 76);

  // ── Section 4: Content text ───────────────────────────────────────────────────
  const content = opts.content ??
    `Just clocked into $JOB Corp. Paying holders every 5 minutes in SOL from creator fees. AI took your job — $JOB pays you back. 💰`;
  ctx.font = `400 19px ${FONT}`;
  ctx.fillStyle = "#111827";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  wrapText(ctx, content, PAD, 350, W - PAD * 2, 34, 3);

  // ── Section 5: Engagement counts ─────────────────────────────────────────────
  const likes = opts.likes ?? 0;
  const comments = opts.comments ?? 0;
  const shares = opts.shares ?? 0;

  ctx.font = `400 13px ${FONT}`;
  ctx.fillStyle = "#6B7280";
  ctx.textBaseline = "top";
  const engParts = [
    likes > 0 ? `👍 ${likes}` : "👍 Be first to react",
    `💬 ${comments} comments`,
    `↗ ${shares} shares`,
  ];
  ctx.fillText(engParts.join("   ·   "), PAD, 466);

  // Divider
  ctx.fillStyle = "#E5E7EB";
  ctx.fillRect(PAD, 500, W - PAD * 2, 1);

  // ── Section 6: Action bar ─────────────────────────────────────────────────────
  const ACTIONS = [
    { label: "Like", icon: "👍" },
    { label: "Comment", icon: "💬" },
    { label: "Repost", icon: "🔄" },
    { label: "Send", icon: "✉" },
  ];
  const ACT_Y = 514;
  const ACT_H = 52;
  const ACT_SLOT = (W - PAD * 2) / ACTIONS.length;

  ACTIONS.forEach((action, i) => {
    const ax = PAD + i * ACT_SLOT + ACT_SLOT / 2;
    ctx.font = `600 15px ${FONT}`;
    ctx.fillStyle = "#6B7280";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(`${action.icon}  ${action.label}`, ax, ACT_Y + ACT_H / 2);
  });

  // ── Watermark ─────────────────────────────────────────────────────────────────
  ctx.font = `400 12px ${FONT}`;
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText("$JOB · refi.gg", W - PAD, H - 12);

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
