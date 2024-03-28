import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import chat from "@/lib/bot/chat";
import { Send, ChevronDown } from "lucide-react";
import { Message } from "./Message";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  headColor: string;
  logo: string;
  title: string;
}

export interface MessageProps {
  message: string;
  sender: "user" | "bot";
  isLoading?: boolean;
}

function Modal({ visible, onClose, logo, title, headColor }: ModalProps) {
  const [, setResponse] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [greetingSent, setGreetingSent] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (visible && !greetingSent) {
      setIsLoading(true);
      setHistory((prevHistory) => [
        ...prevHistory,
        { message: "...", sender: "bot", isLoading: true },
      ]);

      chat({ question: "Hello" })
        .then((response) => {
          setResponse(response.text);
          setHistory((prevHistory) => [
            ...prevHistory.slice(0, -1),
            { message: response.text, sender: "bot" },
          ]);
          setGreetingSent(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [visible, greetingSent]);

  const handleSend = () => {
    const userMessage = inputValue;
    setInputValue("");
    setHistory((prevHistory) => [
      ...prevHistory,
      { message: userMessage, sender: "user" },
      { message: "...", sender: "bot", isLoading: true },
    ]);

    setIsLoading(true);

    chat({ question: userMessage })
      .then((response) => {
        setHistory((prevHistory) => [
          ...prevHistory.slice(0, -1),
          { message: response.text, sender: "bot", isLoading: false },
        ]);
      })
      .catch((error) => {
        console.error("Error:", error);
        setHistory((prevHistory) => [
          ...prevHistory.slice(0, -1),
          {
            message: "Error occurred, please try again.",
            sender: "bot",
            isLoading: false,
          },
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  if (!visible) return null;

  return (
    <div>
      <div
        onClick={(event) => event.stopPropagation()}
        className="fixed bottom-24 right-5 w-[400px] max-sm:w-11/12 h-[65vh] border bg-white rounded-3xl border-grey overflow-auto shadow-xl flex flex-col"
      >
        <div
          className={`w-full h-auto ${headColor} text-white flex justify-between items-center py-4 px-1`}
        >
          <div className="px-4 flex items-center">
            <img
              src={logo}
              alt="FactoryX Logo"
              className="w-10 h-10 rounded-lg mr-2 items-center"
            />
            <span className="text-xl font-normal">{title}</span>
          </div>
          <button className="mr-5" onClick={onClose}>
            <ChevronDown color="white" size={32} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto mb-4 flex flex-col p-4">
          {history.map((message, index) => (
            <div key={index}>
              {message.isLoading && (
                <div className="flex justify-start">
                  <div className="inline-block px-4 py-2 rounded-3xl bg-gray-300 text-black rounded-bl-none animate-pulse">
                    <div className="flex space-x-2 items-center h-5">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
              {!message.isLoading && (
                <Message
                  key={index}
                  message={message.message}
                  sender={message.sender}
                />
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <Separator />
        <div className="flex mt-4 m-4">
          <Input
            type="text"
            className="outline-none flex-grow mr-2"
            placeholder="Type a message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            variant={"ghost"}
            className="text-black p-2"
            onClick={handleSend}
            disabled={isLoading}
          >
            <Send />
          </Button>
        </div>
        <div className="mb-4 text-sm flex items-center justify-center">
          Powered By{" "}
          <img
            src="./ounai.jpg"
            alt="ounai logo"
            className="size-6 rounded-full ml-2"
          />
          <span className="ml-2">OunAI</span>
        </div>
      </div>
    </div>
  );
}

export default Modal;
