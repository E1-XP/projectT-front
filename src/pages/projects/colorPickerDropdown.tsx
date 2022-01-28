import React, { useCallback, useState } from "react";
import styled from "styled-components";
import shuffle from "lodash/fp/shuffle";

import { Icon } from "../../components/icon";

import { greyWhite, white, whiteGrey } from "../../styles/variables";

interface Props {
  isOpen: boolean;
  colors: string[];
  selectedColor: string | undefined;
  setSelectedColor: any;
  closeDropdown: any;
}

const Color_Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 140px;
  position: absolute;
  z-index: 90;
  padding: 0.5rem;
  border: 1px solid ${greyWhite};
`;

const Color_Indicator = styled.div`
  padding: 0.5rem;
  width: 1.5rem;
  background-color: ${(props) => props.color};
`;

const Color_Indicator_Multi = styled(Color_Indicator)`
  margin: 0.2rem;
  height: 1.5rem;
  position: relative;
  cursor: pointer;
`;

const Color_Indicator_Inner = styled.span`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  margin: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const Screen_blocker = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
  z-index: 50;
`;

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
      {isOpen && <Screen_blocker onClick={closeDropdown} />}
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
