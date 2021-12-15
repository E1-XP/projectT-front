import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { GroupedEntries } from "./../../selectors/groupEntriesByDays";
import { whiteGrey } from "../../styles/variables";

import { Entry } from "./entry";

interface Props {
  data: GroupedEntries;
}

const Project_item = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin: auto 0;
  align-items: center;

  &:hover {
    background-color: ${whiteGrey};
  }
`;

const Entry_list = styled.ul`
  width: 100%;
`;

export const EntryGroup = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const setIsOpenCB = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return (
    <Project_item>
      <Entry_list>
        {data.entries.length > 1 && (
          <Entry
            key={data.entries.length}
            asEntryHeader={true}
            size={data.entries.length}
            data={data}
            isOpen={isOpen}
            setIsOpen={setIsOpenCB}
          />
        )}
        {(isOpen || data.entries.length === 1) &&
          data.entries.map((entry) => <Entry key={entry._id} data={entry} />)}
      </Entry_list>
    </Project_item>
  );
};
