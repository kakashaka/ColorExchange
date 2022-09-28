import { useEffect, useRef, useState } from "react";
import Style from "style-it";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { storage } from "./storage";

const NumberInput = observer((props) => {
  const [value, setValue] = useState(props.value);
  const [blurTimeoutId, setBlurTimeoutId] = useState();
  const [inputColor, setInputColor] = useState("black");
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
        if (inputColor === "black") {
          runInAction(() => props.onChange(value));
        }
      }}
    >
      <input
        {...props}
        type="text"
        ref={inputRef}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          const formattedValue = Math.ceil(Number(event.target.value));
          if (
            (formattedValue !== 0 && !formattedValue) ||
            formattedValue < props.from ||
            formattedValue > props.to
          ) {
            setInputColor("red");
            return;
          }
          setInputColor("black");
          setValue(formattedValue);
        }}
        style={{ borderColor: inputColor }}
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
export const HSVInputs = observer(() => {
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
export const RGBInputs = observer(() => {
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
export const HSLInputs = observer(() => {
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
export const CMYKInputs = observer(() => {
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
export const LABInputs = observer(() => {
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
export const XYZInputs = observer(() => {
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
