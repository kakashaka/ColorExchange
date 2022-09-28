import reactCSS from "reactcss";

import "./style.sass";

import { Saturation, Hue } from "react-color/lib/components/common";
import { PhotoshopPointerCircle } from "react-color/lib/components/photoshop/PhotoshopPointerCircle";
import Style from "style-it";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { storage } from "./storage";
import {
  HSLInputs,
  RGBInputs,
  HSVInputs,
  LABInputs,
  XYZInputs,
  CMYKInputs,
} from "./inputs";
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
