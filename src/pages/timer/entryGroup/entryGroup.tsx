import React, { useCallback, useState } from "react";

import { GroupedEntries } from "../../../selectors/groupEntriesByDays";

import { Entry } from "../entry";

import { Project_Item, Entry_List } from "./style";

interface Props {
  data: GroupedEntries;
}

export const EntryGroup = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const setIsOpenCB = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return (
    <Project_Item>
      <Entry_List>
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
      </Entry_List>
    </Project_Item>
  );
};
