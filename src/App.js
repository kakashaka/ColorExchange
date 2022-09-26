import reactCSS from "reactcss";
import logo from "./logo.svg";
import "./App.css";
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
})
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
function hslToHsv(hsl) {
  const v = hsl.s * Math.min(hsl.l, 1 - hsl.l) + hsl.l;
  const s = v ? 2 - (2 * hsl.l) / v : 0;
  return { h: hsl.h, s, v };
}
const HSLInputs = observer(() => {
  return (
    <div className="HSL">
      <span className="HSL__span">HSL</span>: H:
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
    <div style={styles.picker} className={`photoshop-picker`}>
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
      <div style={styles.head}>Header</div>
      <div style={styles.body} className="flexbox-fix">
        <div style={styles.saturation}>
          <Saturation
            hsl={storage.hsl}
            hsv={storage.hsv}
            pointer={PhotoshopPointerCircle}
            onChange={(hsv) => runInAction(() => {
              storage.hsv = hsv;
            })}
          />
        </div>
        <div style={styles.hue}>
          <Hue
            direction="vertical"
            hsl={storage.hueHSL}
            onChange={(hueHSL) => runInAction(() => {
              storage._hueHSL = hueHSL;
              storage.hsv.h = hueHSL.h;
            })}
          />
        </div>
        <div className="heart"> </div>
        <HSVInputs />
        <HSLInputs />
      </div>
    </div>
  );
});

export default App;
