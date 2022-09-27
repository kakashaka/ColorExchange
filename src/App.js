import reactCSS from "reactcss";
import logo from "./logo.svg";
import "./style.sass";
import { ColorWrap, Saturation, Hue } from "react-color/lib/components/common";
import { PhotoshopPointerCircle } from "react-color/lib/components/photoshop/PhotoshopPointerCircle";
import { useEffect, useState } from "react";
import { PhotoshopPicker } from "react-color";
import Style from "style-it";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

const styles = reactCSS({
  default: {
    picker: {
      background: "#DCDCDC",
      borderRadius: "4px",
      boxShadow: "0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)",
      boxSizing: "initial",
      width: "440px",
    },
    head: {
      backgroundImage: "linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%)",
      borderBottom: "1px solid #B1B1B1",
      boxShadow:
        "inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02)",
      height: "23px",
      lineHeight: "24px",
      borderRadius: "4px 4px 0 0",
      fontSize: "13px",
      color: "#4D4D4D",
      textAlign: "center",
    },
    body: {
      padding: "15px 15px 0",
      display: "flex",
    },
    saturation: {
      width: "256px",
      height: "256px",
      position: "relative",
      border: "2px solid #B3B3B3",
      borderBottom: "2px solid #F0F0F0",
      overflow: "hidden",
    },
    hue: {
      position: "relative",
      height: "256px",
      width: "19px",
      marginLeft: "10px",
      border: "2px solid #B3B3B3",
      borderBottom: "2px solid #F0F0F0",
    },
    controls: {
      width: "180px",
      marginLeft: "10px",
    },
    top: {
      display: "flex",
    },
    previews: {
      width: "60px",
    },
    actions: {
      flex: "1",
      marginLeft: "20px",
    },
  },
});
function hsvToHsl(hsv) {
  const l = hsv.v - (hsv.v * hsv.s) / 2;
  const m = Math.min(l, 1 - l);
  const s = m ? (hsv.v - l) / m : 0;
  return { h: hsv.h, s: s, l: l };
}
class Storage {
  hsv = { h: 298, s: 0.5, v: 1 };
  _hueHSL = null;
  constructor() {
    makeAutoObservable(this);
    this._hueHSL = this.hsl;
  }
  get hueHSL() {
    return { ...this._hueHSL, h: this.hsv.h };
  }

  get hsl() {
    return hsvToHsl(this.hsv);
  }
  get cssColor() {
    const s = this.hsl.s * 100;
    const l = this.hsl.l * 100;
    return `hsl(${this.hsl.h},${s}%,${l}%)`;
  }
  get rgb() {
    const h = this.hsv.h / 360;
    if (this.hsv.s == 0) {
      return { r: this.hsv.v * 255, g: this.hsv.v * 255, b: this.hsv.v * 255 };
    }
    const var_h = h * 6;
    const var_i = Math.floor(var_h);
    const var_1 = this.hsv.v * (1 - this.hsv.s);
    const var_2 = this.hsv.v * (1 - this.hsv.s * (var_h - var_i));
    const var_3 = this.hsv.v * (1 - this.hsv.s * (1 - (var_h - var_i)));
    let var_r, var_g, var_b;
    if (var_i == 0) {
      var_r = this.hsv.v;
      var_g = var_3;
      var_b = var_1;
    } else if (var_i == 1) {
      var_r = var_2;
      var_g = this.hsv.v;
      var_b = var_1;
    } else if (var_i == 2) {
      var_r = var_1;
      var_g = this.hsv.v;
      var_b = var_3;
    } else if (var_i == 3) {
      var_r = var_1;
      var_g = var_2;
      var_b = this.hsv.v;
    } else if (var_i == 4) {
      var_r = var_3;
      var_g = var_1;
      var_b = this.hsv.v;
    } else {
      var_r = this.hsv.v;
      var_g = var_1;
      var_b = var_2;
    }

    var_r *= 255;
    var_g *= 255;
    var_b *= 255;

    var_r = Math.round(var_r);
    var_g = Math.round(var_g);
    var_b = Math.round(var_b);
    return { r: var_r, g: var_g, b: var_b };
  }
  set rgb(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const delta = maxVal - minVal;

    this.hsv.v = maxVal;

    if (delta == 0) {
      this.hsv.h = 0;
      this.hsv.s = 0;
      return;
    }
    this.hsv.s = delta / maxVal;
    const del_R = ((maxVal - r) / 6 + delta / 2) / delta;
    const del_G = ((maxVal - g) / 6 + delta / 2) / delta;
    const del_B = ((maxVal - b) / 6 + delta / 2) / delta;

    if (r == maxVal) {
      this.hsv.h = del_B - del_G;
    } else if (g == maxVal) {
      this.hsv.h = 1 / 3 + del_R - del_B;
    } else if (b == maxVal) {
      this.hsv.h = 2 / 3 + del_G - del_R;
    }

    if (this.hsv.h < 0) {
      this.hsv.h += 1;
    }
    if (this.hsv.h > 1) {
      this.hsv.h -= 1;
    }

    this.hsv.h = Math.round(this.hsv.h * 360);
    
  }
}
const storage = new Storage();
const NumberInput = observer((props) => {
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  return (
    <input
      {...props}
      type="text"
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        const value = Number(event.target.value);
        if (!!value) {
          runInAction(() => props.onChange(value));
        }
      }}
    ></input>
  );
});
const HSVInputs = observer(() => {
  return (
    <div className="HSV">
      HSV: H:
      <NumberInput
        size="8"
        value={storage.hsv.h}
        onChange={(value) => {
          storage.hsv.h = value;
        }}
      ></NumberInput>
      S:
      <NumberInput
        size="8"
        value={storage.hsv.s}
        onChange={(value) => {
          storage.hsv.s = value;
        }}
      ></NumberInput>
      V:
      <NumberInput
        size="8"
        value={storage.hsv.v}
        onChange={(value) => {
          storage.hsv.v = value;
        }}
      ></NumberInput>
    </div>
  );
});
const RGBInputs = observer(() => {
  return (
    <div className="RGB">
      RGB: R:
      <NumberInput
        size="8"
        value={storage.rgb.r}
        onChange={(r) => {
          storage.rgb = {...storage.rgb,r:r}
        }}
      ></NumberInput>
      G:
      <NumberInput
        size="8"
        value={storage.rgb.g}
        onChange={(g) => {
          storage.rgb = {...storage.rgb,g:g}
        }}
      ></NumberInput>
      B:
      <NumberInput
        size="8"
        value={storage.rgb.b}
        onChange={(b) => {
          storage.rgb = {...storage.rgb,b:b}
        }}
      ></NumberInput>
    </div>
  );
});
function hslToHsv(hsl) {
  const v = hsl.s * Math.min(hsl.l, 1 - hsl.l) + hsl.l;
  const s = v ? 2 - (2 * hsl.l) / v : 0;
  return { h: hsl.h, s, v };
}
const HSLInputs = observer(() => {
  return (
    <div className="HSL">
      HSL: H:
      <NumberInput
        size="8"
        value={storage.hsl.h}
        onChange={(h) => {
          const hsl = { ...storage.hsl, h: h };
          storage.hsv = hslToHsv(hsl);
        }}
      ></NumberInput>
      S:
      <NumberInput
        size="8"
        value={storage.hsl.s}
        onChange={(s) => {
          const hsl = { ...storage.hsl, s: s };
          storage.hsv = hslToHsv(hsl);
        }}
      ></NumberInput>
      L:
      <NumberInput
        size="8"
        value={storage.hsl.l}
        onChange={(l) => {
          const hsl = { ...storage.hsl, l: l };
          storage.hsv = hslToHsv(hsl);
        }}
      ></NumberInput>
    </div>
  );
});
const App = observer(() => {
  return (
    <div>
      <Style>
        {`
          .heart::before, .heart::after {
            background-color: ${storage.cssColor};
            box-shadow: 0px 0px 20px ${storage.cssColor}
          }
          .heart {
            background-color: ${storage.cssColor};
            box-shadow: 0px 0px 20px ${storage.cssColor}
          }
        `}
      </Style>
      <div className="flexbox-fix">
        <div style={styles.picker} className={`photoshop-picker`}>
          <div style={styles.head}>Header</div>
          <div style={styles.body}>
            <div style={styles.saturation}>
              <Saturation
                hsl={storage.hsl}
                hsv={storage.hsv}
                pointer={PhotoshopPointerCircle}
                onChange={(hsv) =>
                  runInAction(() => {
                    storage.hsv = hsv;
                  })
                }
              />
            </div>
            <div style={styles.hue}>
              <Hue
                direction="vertical"
                hsl={storage.hueHSL}
                onChange={(hueHSL) =>
                  runInAction(() => {
                    storage._hueHSL = hueHSL;
                    storage.hsv.h = hueHSL.h;
                  })
                }
              />
            </div>
            <div className="heart"> </div>
          </div>
          <HSVInputs />
          <HSLInputs />
          <RGBInputs />
        </div>
      </div>
    </div>
  );
});

export default App;
