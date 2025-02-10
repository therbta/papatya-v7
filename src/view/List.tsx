import React from 'react'

// Consts
import { opPriority, nicknames, op_colors } from '../const';


type Props = {
  hideComponent: boolean;
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number>> | any;
  chatUsers: string[];
  setChatUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

const List = (props: Props) => {

  // Props
  const { hideComponent, selected, setSelected, chatUsers, setChatUsers } = props;

  if (hideComponent) return null;

  const sortedNicknames = [...nicknames].sort((a, b) => {
    const priorityA = opPriority[a.op] || 99;
    const priorityB = opPriority[b.op] || 99;
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return a.nick.localeCompare(b.nick);
  });


  return (
    <>

      {sortedNicknames.map((item: any, index: number) => {
        const { nick, op } = item;
        const color = op_colors.find((opItem: any) => opItem.sign === op)?.color;

        return (
          <div
            key={index}
            style={{ color }}
            className={`nick-item ${selected === index ? "selected" : ""}`}
            onClick={() => setSelected(index)}
            onDoubleClick={() => {
              if (!chatUsers.includes(nick)) {
                setChatUsers([...chatUsers, nick]);
              }
            }}
          >
            {op}
            {nick}
          </div>
        );
      })}

    </>
  )

}

export default React.memo(List)