// Mały silnik wykresów na <canvas> — wszystko, czego potrzebują interaktywne widżety.

function themeColors() {
  const s = getComputedStyle(document.documentElement);
  const g = (n) => s.getPropertyValue(n).trim();
  return {
    ink: g('--ink'), muted: g('--muted'), grid: g('--grid'), line: g('--line'),
    accent: g('--accent'), accent2: g('--accent2'), good: g('--good'),
    bad: g('--bad'), warn: g('--warn'), card: g('--card'), thm: g('--thm'),
  };
}

function fmt(x, d = 3) {
  if (x === Infinity) return '+∞';
  if (x === -Infinity) return '−∞';
  if (x === null || x === undefined || Number.isNaN(x)) return '—';
  if (Math.abs(x) < 0.5 * Math.pow(10, -d)) return '0';
  let s = x.toFixed(d);
  if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s.replace('-', '−').replace('.', ',');
}

function niceStep(range, target) {
  const raw = range / target;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

class Plot {
  constructor(canvas, view) {
    this.c = canvas;
    this.v = Object.assign({ xmin: -1, xmax: 1, ymin: -1, ymax: 1 }, view);
    this.pad = { l: 40, r: 14, t: 12, b: 26 };
    this.resize();
  }
  resize() {
    const r = this.c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.w = Math.max(r.width, 50);
    this.h = Math.max(r.height, 50);
    this.c.width = this.w * dpr;
    this.c.height = this.h * dpr;
    this.g = this.c.getContext('2d');
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  set(view) { Object.assign(this.v, view); return this; }
  X(x) { return this.pad.l + (x - this.v.xmin) / (this.v.xmax - this.v.xmin) * (this.w - this.pad.l - this.pad.r); }
  Y(y) { return this.h - this.pad.b - (y - this.v.ymin) / (this.v.ymax - this.v.ymin) * (this.h - this.pad.t - this.pad.b); }
  clear() { this.col = themeColors(); this.g.clearRect(0, 0, this.w, this.h); return this; }
  clip(fn) {
    const g = this.g;
    g.save();
    g.beginPath();
    g.rect(this.pad.l, this.pad.t, this.w - this.pad.l - this.pad.r, this.h - this.pad.t - this.pad.b);
    g.clip();
    fn();
    g.restore();
  }
  axes(o = {}) {
    const g = this.g, c = this.col, v = this.v;
    g.font = '11px system-ui, sans-serif';
    g.lineWidth = 1;
    const sx = o.stepx || niceStep(v.xmax - v.xmin, 8);
    const sy = o.stepy || niceStep(v.ymax - v.ymin, 6);
    g.strokeStyle = c.grid; g.fillStyle = c.muted;
    g.textAlign = 'center'; g.textBaseline = 'top';
    for (let x = Math.ceil(v.xmin / sx) * sx; x <= v.xmax + 1e-9; x += sx) {
      const px = this.X(x);
      g.beginPath(); g.moveTo(px, this.pad.t); g.lineTo(px, this.h - this.pad.b); g.stroke();
      if (!o.nolabelx) g.fillText(fmt(Math.abs(x) < 1e-12 ? 0 : x, 3), px, this.h - this.pad.b + 5);
    }
    g.textAlign = 'right'; g.textBaseline = 'middle';
    for (let y = Math.ceil(v.ymin / sy) * sy; y <= v.ymax + 1e-9; y += sy) {
      const py = this.Y(y);
      g.beginPath(); g.moveTo(this.pad.l, py); g.lineTo(this.w - this.pad.r, py); g.stroke();
      if (!o.nolabely) g.fillText(fmt(Math.abs(y) < 1e-12 ? 0 : y, 3), this.pad.l - 6, py);
    }
    g.strokeStyle = c.muted; g.lineWidth = 1.4;
    if (v.ymin <= 0 && v.ymax >= 0) { g.beginPath(); g.moveTo(this.pad.l, this.Y(0)); g.lineTo(this.w - this.pad.r, this.Y(0)); g.stroke(); }
    if (v.xmin <= 0 && v.xmax >= 0) { g.beginPath(); g.moveTo(this.X(0), this.pad.t); g.lineTo(this.X(0), this.h - this.pad.b); g.stroke(); }
    return this;
  }
  // Wykres funkcji; łamie linię na NaN/∞ i na dużych skokach (np. tg x).
  fn(f, o = {}) {
    const g = this.g, v = this.v;
    const x0 = o.x0 !== undefined ? o.x0 : v.xmin, x1 = o.x1 !== undefined ? o.x1 : v.xmax;
    const n = o.n || 700;
    const jump = (v.ymax - v.ymin) * (o.jump || 0.9);
    this.clip(() => {
      g.lineWidth = o.width || 2.2;
      g.setLineDash(o.dash || []);
      g.lineCap = 'round'; g.lineJoin = 'round';
      let prevY = null, started = false, prevX = 0;
      const colorAt = o.colorAt;
      g.strokeStyle = o.color || this.col.accent;
      g.beginPath();
      for (let i = 0; i <= n; i++) {
        const x = x0 + (x1 - x0) * i / n;
        const y = f(x);
        const ok = Number.isFinite(y) && Math.abs(y) < 1e6;
        if (!ok) { if (started && !colorAt) g.stroke(); g.beginPath(); started = false; prevY = null; continue; }
        const px = this.X(x), py = this.Y(y);
        if (colorAt) {
          if (prevY !== null && Math.abs(y - prevY) < jump) {
            g.strokeStyle = colorAt(x);
            g.beginPath(); g.moveTo(this.X(prevX), this.Y(prevY)); g.lineTo(px, py); g.stroke();
          }
          prevY = y; prevX = x; started = true;
          continue;
        }
        if (!started || (prevY !== null && Math.abs(y - prevY) > jump)) {
          if (started) g.stroke();
          g.beginPath(); g.moveTo(px, py); started = true;
        } else g.lineTo(px, py);
        prevY = y;
      }
      if (started && !colorAt) g.stroke();
      g.setLineDash([]);
    });
    return this;
  }
  hline(y, o = {}) {
    const g = this.g;
    this.clip(() => {
      g.strokeStyle = o.color || this.col.muted; g.lineWidth = o.width || 1.4; g.setLineDash(o.dash || []);
      g.beginPath(); g.moveTo(this.pad.l, this.Y(y)); g.lineTo(this.w - this.pad.r, this.Y(y)); g.stroke(); g.setLineDash([]);
    });
    return this;
  }
  vline(x, o = {}) {
    const g = this.g;
    this.clip(() => {
      g.strokeStyle = o.color || this.col.muted; g.lineWidth = o.width || 1.4; g.setLineDash(o.dash || []);
      g.beginPath(); g.moveTo(this.X(x), this.pad.t); g.lineTo(this.X(x), this.h - this.pad.b); g.stroke(); g.setLineDash([]);
    });
    return this;
  }
  band(y0, y1, color) {
    this.clip(() => { this.g.fillStyle = color; this.g.fillRect(this.pad.l, this.Y(y1), this.w - this.pad.l - this.pad.r, this.Y(y0) - this.Y(y1)); });
    return this;
  }
  vband(x0, x1, color) {
    this.clip(() => { this.g.fillStyle = color; this.g.fillRect(this.X(x0), this.pad.t, this.X(x1) - this.X(x0), this.h - this.pad.t - this.pad.b); });
    return this;
  }
  // Punkt; poza zakresem Y rysuje znacznik przy krawędzi (clamp).
  dot(x, y, o = {}) {
    const g = this.g, r = o.r || 3.5;
    const px = this.X(x);
    if (px < this.pad.l - 1 || px > this.w - this.pad.r + 1) return this;
    let py = this.Y(y), out = 0;
    const top = this.pad.t + 4, bot = this.h - this.pad.b - 4;
    if (py < top) { py = top; out = -1; } else if (py > bot) { py = bot; out = 1; }
    g.beginPath();
    if (out) {
      g.moveTo(px, py + out * r); g.lineTo(px - r, py - out * r * 0.8); g.lineTo(px + r, py - out * r * 0.8);
      g.closePath();
      g.fillStyle = o.stroke || o.fill || this.col.bad; g.globalAlpha = .55; g.fill(); g.globalAlpha = 1;
      return this;
    }
    g.arc(px, py, r, 0, Math.PI * 2);
    if (o.open) { g.fillStyle = this.col.card; g.fill(); g.lineWidth = 2; g.strokeStyle = o.stroke || this.col.ink; g.stroke(); }
    else { g.fillStyle = o.fill || this.col.accent; g.fill(); }
    return this;
  }
  text(x, y, s, o = {}) {
    const g = this.g;
    g.font = (o.size || 12) + 'px system-ui, sans-serif';
    g.fillStyle = o.color || this.col.ink; g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'middle';
    g.fillText(s, this.X(x) + (o.dx || 0), this.Y(y) + (o.dy || 0));
    return this;
  }
}
