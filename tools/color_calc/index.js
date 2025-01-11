function clamp(x) {
  return Math.max(Math.min(1.0, x), 0.0);
}

class Color {
    constructor(r, g, b) {
        this._r = r;
        this._g = g;
        this._b = b;
    }

    get r() { return this._r; }
    get g() { return this._g; }
    get b() { return this._b; }

    static fromHex(s) {
        s = s.trim();
        if (s.startsWith('#')) {
            s = s.substring(1);
        }
        if (!s.match(/^[0-9a-fA-F]{6}$/)) {
            return null;
        }
        const r = parseInt(s.substring(0, 2), 16) / 255.0;
        const g = parseInt(s.substring(2, 4), 16) / 255.0;
        const b = parseInt(s.substring(4, 6), 16) / 255.0;
        return new Color(r, g, b);
    }

    toHex() {
        const digit = (x) => (clamp(x) * 255.0 + 0.5) | 0;
        const hex = (x) => digit(x).toString(16).padStart(2, '0').toUpperCase();
        return hex(this.r) + hex(this.g) + hex(this.b);
    }

    toString() {
        return '#' + this.toHex();
    }
}

function mapC2(c1, c2, f) {
  return new Color(f(c1.r, c2.r), f(c1.g, c2.g), f(c1.b, c2.b));
}

function mapC3(c1, c2, c3, f) {
  return new Color(f(c1.r, c2.r, c3.r), f(c1.g, c2.g, c3.g), f(c1.b, c2.b, c3.b));
}

//------------------------------------------------------------------------------

const state = {
  baseColor: Color.fromHex("FFE6D9"),
  baseText: "FFE6D9",
  targetColor: Color.fromHex("F5B7A5"),
  targetText: "F5B7A5",
};

function updateBaseColor(newColor) {
  state.baseColor = newColor;
  state.baseText = newColor.toHex();
  render();
}

function updateBaseText(newText) {
  state.baseText = newText;
  const newColor = Color.fromHex(newText);
  if (newColor != null) {
    state.baseColor = newColor;
  }
  render();
}

function updateTargetColor(newColor) {
  state.targetColor = newColor;
  state.targetText = newColor.toHex();
  render();
}

function updateTargetText(newText) {
  state.targetText = newText;
  const newColor = Color.fromHex(newText);
  if (newColor != null) {
    state.targetColor = newColor;
  }
  render();
}

function render() {
  // 逆算
  const resultColor = mapC2(state.baseColor, state.targetColor, (b, t) => b != 0 ? clamp(t / b) : 0)
  const diff = mapC3(state.baseColor, resultColor, state.targetColor, (b, r, t) => Math.abs(b * r - t));
  const ok = diff.r + diff.g + diff.b < 1.0/256.0;

  const baseColorPickerEl = document.getElementById("base_color_picker");
  baseColorPickerEl.value = state.baseColor.toString();
  const baseColorTextEl = document.getElementById("base_color_text");
  baseColorTextEl.value = state.baseText;

  const targetColorPickerEl = document.getElementById("target_color_picker");
  targetColorPickerEl.value = state.targetColor.toString();
  const targetColorTextEl = document.getElementById("target_color_text");
  targetColorTextEl.value = state.targetText;

  const resultColorPickerEl = document.getElementById("result_color_picker");
  resultColorPickerEl.value = resultColor.toString();
  const resultColorTextEl = document.getElementById("result_color_text");
  resultColorTextEl.value = ok ? resultColor.toHex() : "N/A";
}
