import React, { useRef } from "react";
import Draggable from "react-draggable";

type Props = {
  title: string;
  children: React.ReactNode;
  width: number;
  height: number;
  setIsModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Window: React.FC<Props> = ({ title, children, width, height, setIsModalVisible }) => {
  const nodeRef = useRef<HTMLDivElement>(null); // Use nodeRef to fix findDOMNode error

  return (
    <Draggable nodeRef={nodeRef as React.RefObject<HTMLElement>} handle=".winhead">
      <div ref={nodeRef} className="window" style={{ width, height }}>
        <div className="winhead">
          <div className="button">
            <div
              className="close"
              onClick={() => setIsModalVisible && setIsModalVisible(false)}
            ></div>
            <div className="min"></div>
            <div className="max"></div>
          </div>
          <div className="title">{title}</div>
        </div>
        <div className="winbody">{children}</div>
      </div>
    </Draggable>
  );
};

export default React.memo(Window);