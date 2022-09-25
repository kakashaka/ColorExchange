import reactCSS from "reactcss";
import logo from "./logo.svg";
import "./App.css";
import { ColorWrap, Saturation, Hue } from "react-color/lib/components/common";
import { PhotoshopPointerCircle } from "react-color/lib/components/photoshop/PhotoshopPointerCircle";
import { useEffect, useState } from "react";
import { PhotoshopPicker } from "react-color";

const styles = reactCSS({
  default: {
    picker: {
      background: "#DCDCDC",
      borderRadius: "4px",
      boxShadow: "0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)",
      boxSizing: "initial",
      width: "513px",
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

function App() {
  const [hsl, setHSL] = useState({ h: 0, s: 0, l: 0});
  const [hsv, setHSV] = useState({ h: 0, s: 0, v: 0});

  useEffect(() => {
    console.log(hsl);
  }, [hsl]);
  useEffect(() => {
    console.log(hsv);
  }, [hsv]);

  return (
    <div style={styles.picker} className={`photoshop-picker`}>
      <div style={styles.head}>Header</div>

      <div style={styles.body} className="flexbox-fix">
        <div style={styles.saturation}>
          <Saturation
            hsl={hsl}
            hsv={hsv}
            pointer={PhotoshopPointerCircle}
            onChange={setHSV}
          />
        </div>
        <div style={styles.hue}>
          <Hue direction="vertical" hsl={hsl} onChange={setHSL} />
        </div>
      </div>
    </div>
  );
}

export default App;