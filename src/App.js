import reactCSS from "reactcss";
import logo from "./logo.svg";
import "./style.sass";
// import { convert } from "color-convert";
import { ColorWrap, Saturation, Hue } from "react-color/lib/components/common";
import { PhotoshopPointerCircle } from "react-color/lib/components/photoshop/PhotoshopPointerCircle";
import { useEffect, useRef, useState } from "react";
import { PhotoshopPicker } from "react-color";
import Style from "style-it";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
const convert = require("color-convert");

const styles = reactCSS({
  default: {
    picker: {
      background: "#DCDCDC",
      borderRadius: "4px",
      boxShadow: "0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)",
      boxSizing: "initial",
      width: "551px",
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
const storage = new Storage();

const NumberInput = observer((props) => {
  const [value, setValue] = useState(props.value);
  const [blurTimeoutId, setBlurTimeoutId] = useState();
  const inputRef = useRef();

  const [sliderCoordinates, setSliderCoordinates] = useState();
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  return (
    <span
      onFocus={() => {
        const inputCoordinates = inputRef.current.getBoundingClientRect();
        setSliderCoordinates({
          x: inputCoordinates.x - 30,
          y: inputCoordinates.y + 25,
        });
        if (blurTimeoutId) {
          clearTimeout(blurTimeoutId);
          setBlurTimeoutId(null);
        }
      }}
      onBlur={() => {
        setBlurTimeoutId(
          setTimeout(() => {
            setSliderCoordinates(null);
          }, 100)
        );

        const formattedValue = Math.ceil(Number(value));
        if (formattedValue !== 0 && !formattedValue) {
          return;
        }
        runInAction(() => props.onChange(formattedValue));
      }}
    >
      <input
        {...props}
        type="text"
        ref={inputRef}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      ></input>
      {sliderCoordinates ? (
        <>
          <Style>
            {`
          .slider{
            left:${sliderCoordinates.x}px;
            top:${sliderCoordinates.y}px;
          }
        `}
          </Style>
          <div className="slider">
            <span>{props.from}</span>
            <input
              type="range"
              min={props.from}
              max={props.to}
              step="1"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
            />
            <span>{props.to}</span>
          </div>
        </>
      ) : (
        ""
      )}
    </span>
  );
});
const HSVInputs = observer(() => {
  return (
    <div className="HSV">
      HSV: <span className="span">H:</span>
      <NumberInput
        size="8"
        from={0}
        to={360}
        value={storage.hsv.h}
        onChange={(h) => {
          storage.hsv = { ...storage.hsv, h: h };
        }}
      ></NumberInput>
      S:
      <NumberInput
        size="8"
        from={0}
        to={100}
        value={storage.hsv.s}
        onChange={(s) => {
          storage.hsv = { ...storage.hsv, s: s };
        }}
      ></NumberInput>
      V:
      <NumberInput
        size="8"
        from={0}
        to={100}
        value={storage.hsv.v}
        onChange={(v) => {
          storage.hsv = { ...storage.hsv, v: v };
        }}
      ></NumberInput>
    </div>
  );
});
const RGBInputs = observer(() => {
  return (
    <div className="RGB">
      RGB: <span className="span">R:</span>
      <NumberInput
        size="8"
        from={0}
        to={255}
        value={storage.rgb.r}
        onChange={(r) => {
          storage.rgb = { ...storage.rgb, r: r };
        }}
      ></NumberInput>
      G:
      <NumberInput
        size="8"
        from={0}
        to={255}
        value={storage.rgb.g}
        onChange={(g) => {
          storage.rgb = { ...storage.rgb, g: g };
        }}
      ></NumberInput>
      B:
      <NumberInput
        size="8"
        from={0}
        to={255}
        value={storage.rgb.b}
        onChange={(b) => {
          storage.rgb = { ...storage.rgb, b: b };
        }}
      ></NumberInput>
    </div>
  );
});
const HSLInputs = observer(() => {
  return (
    <div className="HSL">
      HSL: <span className="span">H:</span>
      <NumberInput
        size="8"
        from={0}
        to={360}
        value={storage.hsl.h}
        onChange={(h) => {
          storage.hsl = { ...storage.hsl, h: h };
        }}
      ></NumberInput>
      S:
      <NumberInput
        size="8"
        from={0}
        to={100}
        value={storage.hsl.s}
        onChange={(s) => {
          storage.hsl = { ...storage.hsl, s: s };
        }}
      ></NumberInput>
      L:
      <NumberInput
        size="8"
        from={0}
        to={100}
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
        from={0}
        to={100}
        value={storage.cmyk.c}
        onChange={(c) => {
          storage.cmyk = { ...storage.cmyk, c: c };
        }}
      ></NumberInput>
      M:
      <NumberInput
        size="8"
        from={0}
        to={100}
        value={storage.cmyk.m}
        onChange={(m) => {
          storage.cmyk = { ...storage.cmyk, m: m };
        }}
      ></NumberInput>
      Y:
      <NumberInput
        size="8"
        from={0}
        to={100}
        value={storage.cmyk.y}
        onChange={(y) => {
          storage.cmyk = { ...storage.cmyk, y: y };
        }}
      ></NumberInput>
      K:
      <NumberInput
        size="8"
        from={0}
        to={100}
        value={storage.cmyk.k}
        onChange={(k) => {
          storage.cmyk = { ...storage.cmyk, k: k };
        }}
      ></NumberInput>
    </div>
  );
});
const LABInputs = observer(() => {
  return (
    <div className="LAB">
      LAB: <span className="span">L:</span>
      <NumberInput
        size="8"
        from={0}
        to={100}
        value={storage.lab.l}
        onChange={(l) => {
          storage.lab = { ...storage.lab, l: l };
        }}
      ></NumberInput>
      A:
      <NumberInput
        size="8"
        from={-128}
        to={127}
        value={storage.lab.a}
        onChange={(a) => {
          storage.lab = { ...storage.lab, a: a };
        }}
      ></NumberInput>
      B:
      <NumberInput
        size="8"
        from={-128}
        to={127}
        value={storage.lab.b}
        onChange={(b) => {
          storage.lab = { ...storage.lab, b: b };
        }}
      ></NumberInput>
    </div>
  );
});
const XYZInputs = observer(() => {
  return (
    <div className="XYZ">
      XYZ: <span className="span">X:</span>
      <NumberInput
        size="8"
        from={0}
        to={128}
        value={storage.xyz.x}
        onChange={(x) => {
          storage.xyz = { ...storage.xyz, x: x };
        }}
      ></NumberInput>
      Y:
      <NumberInput
        size="8"
        from={0}
        to={128}
        value={storage.xyz.y}
        onChange={(y) => {
          storage.xyz = { ...storage.xyz, y: y };
        }}
      ></NumberInput>
      Z:
      <NumberInput
        size="8"
        from={0}
        to={128}
        value={storage.xyz.z}
        onChange={(z) => {
          storage.xyz = { ...storage.xyz, z: z };
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
                hsl={storage.hslView}
                hsv={storage.hsvView}
                pointer={PhotoshopPointerCircle}
                onChange={(hsv) =>
                  runInAction(() => {
                    storage.hsv = { h: hsv.h, s: hsv.s * 100, v: hsv.v * 100 };
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
                    storage.hsv = { ...storage.hsv, h: hueHSL.h };
                  })
                }
              />
            </div>
            <div className="heart"> </div>
          </div>
          <div className="text">
            Базовая цветовая модель - RGB. При конвертации в/из RGB может
            происходить потеря точности при округлении. Дополнительно при
            конвертации из XYZ/LAB в RGB может происходить искажение чисел, хотя
            корректность отображения цвета остаётся правильной.
          </div>
          <HSVInputs />
          <HSLInputs />
          <RGBInputs />
          <CMYKInputs />
          <XYZInputs />
          <LABInputs />
        </div>
      </div>
    </div>
  );
});

export default App;
