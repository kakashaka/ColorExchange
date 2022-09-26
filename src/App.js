import reactCSS from "reactcss";
import logo from "./logo.svg";
import "./App.css";
import { ColorWrap, Saturation, Hue } from "react-color/lib/components/common";
import { PhotoshopPointerCircle } from "react-color/lib/components/photoshop/PhotoshopPointerCircle";
import { useEffect, useState } from "react";
import { PhotoshopPicker } from "react-color";
import Style from "style-it";

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
function clone(setObj, obj, property) {
  return (event) => {
    setObj({ ...obj, [property]: Number(event.target.value) });
  };
}
function App() {
  const initHSL = { h: 299.53125, s: 1, l: 0.75716 };
  const [hueHSL, setHueHSL] = useState(initHSL);
  const [hsv, setHSV] = useState({ h: 0, s: 0, v: 0 });
  const [cssColor, setCssColor] = useState("white");
  const [hsl, setHSL] = useState(initHSL);
  useEffect(() => {
    setTimeout(() => {
      setHSV({ ...hsv });
    }, 0);
  }, []);
  useEffect(() => {
    const l = hsv.v - (hsv.v * hsv.s) / 2;
    const m = Math.min(l, 1 - l);
    const s = m ? (hsv.v - l) / m : 0;
    setHSL({ h: hsv.h, s: s, l: l });
  }, [hsv]);
  useEffect(() => {
    const s = hsl.s * 100;
    const l = hsl.l * 100;
    setCssColor(`hsl(${hsl.h},${s}%,${l}%)`);
  }, [hsv]);
  useEffect(() => {
    console.log(hsl);
  }, [hsl]);
  useEffect(() => {
    console.log(hsv);
  }, [hsv]);

  return (
    <div style={styles.picker} className={`photoshop-picker`}>
      <Style>
        {`  
          .heart::before, .heart::after { 
            background-color: ${cssColor};
            box-shadow: 0px 0px 20px ${cssColor}
          }
          .heart {
            background-color: ${cssColor};
            box-shadow: 0px 0px 20px ${cssColor}
          }
        `}
      </Style>
      <div style={styles.head}>Header</div>
      <div style={styles.body} className="flexbox-fix">
        <div style={styles.saturation}>
          <Saturation
            hsl={hueHSL}
            hsv={hsv}
            pointer={PhotoshopPointerCircle}
            onChange={setHSV}
          />
        </div>
        <div style={styles.hue}>
          <Hue
            direction="vertical"
            hsl={hueHSL}
            onChange={(newHueHSL) => {
              setHueHSL(newHueHSL);
              setHSV({ ...hsv, h: newHueHSL.h });
            }}
          />
        </div>
        <div className="heart"> </div>
        <div className="HSL">
          HSV: H:
          <input
            defaultValue={String(hsv.v)}
            type="text"
            size="8"
            value={hsv.h}
            onChange={clone(setHSV, hsv, "h")}
          ></input>
          S:
          <input
            type="text"
            size="8"
            value={String(hsv.s)}
            onChange={clone(setHSV, hsv, "s")}
          ></input>
          V:
          <input
            type="text"
            size="8"
            value={hsl.v}
            onChange={clone(setHSV, hsv, "v")}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default App;
