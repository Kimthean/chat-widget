import { useState } from "react";
import Modal from "./Modal";

function ChatWidget() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div
        className="fixed bottom-5 right-5 p-4 bg-[#ee6e46] rounded-full"
        onClick={() => setVisible(!visible)}
      >
        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
          headColor="bg-orange-500"
          title="FactoryX"
          logo="./factoryx.webp"
        />
        <div>
          <span className="cursor-pointer ">
            <img src="./chat.svg" alt="chat" className="size-8 inline-block" />
          </span>
        </div>
      </div>
    </div>
  );
}
export default ChatWidget;
