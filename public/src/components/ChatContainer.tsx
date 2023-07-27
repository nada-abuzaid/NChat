import { useState, useEffect, useRef } from 'react';
import { ChatContainer as ChatContainerStyled } from './styled';
import ChatInput from './ChatInput';
import Logout from './Logout';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { sendMessageRoute, recieveMessageRoute } from '../utils/APIRoutes';

export default function ChatContainer({ currentChat }: any) {
  const [messages, setMessages] = useState([
    {
      fromSelf: false,
      message: '',
    },
  ]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const sendData = async () => {
  //     const data = await JSON.parse(
  //       localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
  //     );
  //     const response = await axios.post(recieveMessageRoute, {
  //       from: data.id,
  //       to: currentChat.id,
  //     });
  //     setMessages(response.data);
  //   };
  //   sendData();
  // }, [currentChat]);

  // useEffect(() => {
  //   const getCurrentChat = async () => {
  //     if (currentChat) {
  //       await JSON.parse(
  //         localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
  //       ).id;
  //     }
  //   };
  //   getCurrentChat();
  // }, [currentChat]);

  const handleSendMsg = async (msg: any) => {
    const data = await JSON.parse(
      localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
    );
    }
  //   await axios.post(sendMessageRoute, {
  //     from: data._id,
  //     to: currentChat._id,
  //     message: msg,
  //   });

  //   const msgs = [...messages];
  //   msgs.push({ fromSelf: true, message: msg });
  //   setMessages(msgs);
  // };

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on('msg-recieve', (msg: any) => {
  //       setArrivalMessage({ fromSelf: false, message: msg } as any);
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  // }, [arrivalMessage]);

  // useEffect(() => {
  //   scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  return (
    <ChatContainerStyled>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={currentChat.avatarImage}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {/* {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? 'sended' : 'recieved'
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })} */}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </ChatContainerStyled>
  );
}