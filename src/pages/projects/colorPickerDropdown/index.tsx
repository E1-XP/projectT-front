import React, { useCallback, useState } from "react";
import shuffle from "lodash/fp/shuffle";

import { Icon } from "../../../components/icon";
import { white } from "../../../styles/variables";
import {
  Screen_Blocker,
  Color_Container,
  Color_Indicator_Multi,
  Color_Indicator_Inner,
} from "./style";

interface Props {
  isOpen: boolean;
  colors: string[];
  selectedColor: string | undefined;
  setSelectedColor: any;
  closeDropdown: any;
}

export const ColorPickerDropdown = ({
  isOpen,
  closeDropdown,
  colors: colorArr,
  selectedColor,
  setSelectedColor,
}: Props) => {
  const [colors, setColors] = useState(shuffle(colorArr));

  const onColorSelect = useCallback(
    (color) => {
      setSelectedColor(color);
      closeDropdown();
    },
    [selectedColor]
  );

  return (
    <>
      {isOpen && <Screen_Blocker onClick={closeDropdown} />}
      {isOpen && (
        <Color_Container>
          {colors.map((color) => (
            <Color_Indicator_Multi
              key={color}
              color={color}
              onClick={() => onColorSelect(color)}
            >
              <Color_Indicator_Inner>
                {selectedColor === color && (
                  <Icon name="done" fill={white} size="16px" />
                )}
              </Color_Indicator_Inner>
            </Color_Indicator_Multi>
          ))}
        </Color_Container>
      )}
    </>
  );
};
