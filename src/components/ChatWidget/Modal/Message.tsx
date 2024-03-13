import { MessageProps } from ".";

export const Message = ({ message, sender }: MessageProps) => (
  <div
    className={`mb-2 flex ${
      sender === "user" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`inline-block px-4 py-2 text-start rounded-3xl max-w-[95%] sm:max-w-11/12 ${
        sender === "user"
          ? "bg-blue-500 text-white rounded-br-none"
          : "bg-gray-300 text-black rounded-bl-none"
      }`}
    >
      {message}
    </div>
  </div>
);
