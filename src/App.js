import reactCSS from "reactcss";
import logo from "./logo.svg";
import "./style.sass";
import { convert } from "./convertions";
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
      width: "531px",
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

function round(value_1, value_2) {
  // return Math.round(value_1 * value_2) / value_2;
  return value_1;
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
    const hsl = convert.hsv.hsl([
      this.hsv.h,
      this.hsv.s * 100,
      this.hsv.v * 100,
    ]);
    return { h: hsl[0], s: hsl[1] / 100, l: hsl[2] / 100 };
  }
  set hsl(hsl) {
    const hsv = convert.hsl.hsv([hsl.h, hsl.s * 100, hsl.l * 100]);
    this.hsv = { h: hsv[0], s: hsv[1] / 100, v: hsv[2] / 100 };
  }
  get cssColor() {
    const s = this.hsl.s * 100;
    const l = this.hsl.l * 100;
    return `hsl(${this.hsl.h},${s}%,${l}%)`;
  }
  get rgb() {
    const rgb = convert.hsv.rgb([
      this.hsv.h,
      this.hsv.s * 100,
      this.hsv.v * 100,
    ]);
    return { r: rgb[0], g: rgb[1], b: rgb[2] };
  }
  set rgb(rgb) {
    const hsv = convert.rgb.hsv([rgb.r, rgb.g, rgb.b]);
    this.hsv = { h: hsv[0], s: hsv[1] / 100, v: hsv[2] / 100 };
  }
  get cmyk() {
    return {};
    const cmyk = convert.hsv.cmyk([
      this.hsv.h,
      this.hsv.s * 100,
      this.hsv.v * 100,
    ]);
    return { c: cmyk[0], m: cmyk[1], y: cmyk[2], k: cmyk[3] };
  }
  set cmyk(cmyk) {
    const hsv = convert.hsv.cmyk([cmyk.c, cmyk.m, cmyk.y, cmyk.k]);
    this.hsv = { h: hsv[0], s: hsv[1] / 100, v: hsv[2] / 100 };
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
      HSV: <span>H:</span>
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
      RGB: <span>R:</span>
      <NumberInput
        size="8"
        value={storage.rgb.r}
        onChange={(r) => {
          storage.rgb = { ...storage.rgb, r: r };
        }}
      ></NumberInput>
      G:
      <NumberInput
        size="8"
        value={storage.rgb.g}
        onChange={(g) => {
          storage.rgb = { ...storage.rgb, g: g };
        }}
      ></NumberInput>
      B:
      <NumberInput
        size="8"
        value={storage.rgb.b}
        onChange={(b) => {
          storage.rgb = { ...storage.rgb, b: b };
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
      HSL: <span>H:</span>
      <NumberInput
        size="8"
        value={storage.hsl.h}
        onChange={(h) => {
          storage.hsl = { ...storage.hsl, h: h };
        }}
      ></NumberInput>
      S:
      <NumberInput
        size="8"
        value={storage.hsl.s}
        onChange={(s) => {
          storage.hsl = { ...storage.hsl, s: s };
        }}
      ></NumberInput>
      L:
      <NumberInput
        size="8"
        value={storage.hsl.l}
        onChange={(l) => {
          storage.hsl = { ...storage.hsl, l: l };
        }}
      ></NumberInput>
    </div>
  );
});
const CMYKInputs = observer(() => {
  return (
    <div className="CMYK">
      CMYK: C:
      <NumberInput
        size="8"
        value={storage.cmyk.c}
        onChange={(c) => {
          storage.cmyk = { ...storage.cmyk, c: c };
        }}
      ></NumberInput>
      M:
      <NumberInput
        size="8"
        value={storage.cmyk.m}
        onChange={(m) => {
          storage.cmyk = { ...storage.cmyk, m: m };
        }}
      ></NumberInput>
      Y:
      <NumberInput
        size="8"
        value={storage.cmyk.y}
        onChange={(y) => {
          storage.cmyk = { ...storage.cmyk, y: y };
        }}
      ></NumberInput>
      K:
      <NumberInput
        size="8"
        value={storage.hsl.l}
        onChange={(k) => {
          storage.cmyk = { ...storage.cmyk, k: k };
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
          <CMYKInputs />
        </div>
      </div>
    </div>
  );
});

export default App;
