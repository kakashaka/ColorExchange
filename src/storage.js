import { makeAutoObservable } from "mobx";
const convert = require("color-convert");

class Storage {
  rgb = { r: 251, g: 128, b: 255 };
  _hueHSL = null;
  constructor() {
    makeAutoObservable(this);
    this._hueHSL = this.hsl;
  }
  get hueHSL() {
    return { ...this._hueHSL, h: this.hsv.h };
  }

  get hsl() {
    const hsl = convert.rgb.hsl(this._rgb);
    return { h: hsl[0], s: hsl[1], l: hsl[2] };
  }
  set hsl(hsl) {
    this._rgb = convert.hsl.rgb([hsl.h, hsl.s, hsl.l]);
  }
  get cssColor() {
    return `rgb(${this.rgb.r},${this.rgb.g},${this.rgb.b})`;
  }
  get hsv() {
    const hsv = convert.rgb.hsv(this._rgb);
    return { h: hsv[0], s: hsv[1], v: hsv[2] };
  }
  get _rgb() {
    return [this.rgb.r, this.rgb.g, this.rgb.b];
  }
  set _rgb(rgb) {
    this.rgb = { r: rgb[0], g: rgb[1], b: rgb[2] };
  }
  set hsv(hsv) {
    this._rgb = convert.hsv.rgb([hsv.h, hsv.s, hsv.v]);
  }
  get cmyk() {
    const cmyk = convert.rgb.cmyk(this._rgb);
    return { c: cmyk[0], m: cmyk[1], y: cmyk[2], k: cmyk[3] };
  }
  set cmyk(cmyk) {
    this._rgb = convert.cmyk.rgb([cmyk.c, cmyk.m, cmyk.y, cmyk.k]);
  }
  get lab() {
    const lab = convert.rgb.lab(this._rgb);
    return { l: lab[0], a: lab[1], b: lab[2] };
  }
  set lab(lab) {
    this._rgb = convert.lab.rgb([lab.l, lab.a, lab.b]);
  }
  get xyz() {
    const xyz = convert.rgb.xyz(this._rgb);
    return { x: xyz[0], y: xyz[1], z: xyz[2] };
  }
  set xyz(xyz) {
    this._rgb = convert.xyz.rgb([xyz.x, xyz.y, xyz.z]);
  }
  get hslView() {
    const hsl = this.hsl;
    return { h: hsl.h, s: hsl.s / 100, l: hsl.l / 100 };
  }
  get hsvView() {
    const hsv = this.hsv;
    return { h: hsv.h, s: hsv.s / 100, v: hsv.v / 100 };
  }
}
export const storage = new Storage();
