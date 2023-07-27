import { useState, useEffect, useRef } from 'react';
import { ChatContainer as ChatContainerStyled } from './styled';
import ChatInput from './ChatInput';
import Logout from './Logout';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { SEND_MESSAGE, RECEIVE_MESSAGE } from '../utils/APIRoutes';
import User from "../assets/icon.png"

export default function ChatContainer({ currentChat, socket }: any) {
  const [messages, setMessages] = useState<any>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
console.log(currentChat);

  useEffect(() => {
    const postData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
      );
      if(currentChat.length){
        const response = await axios.post(RECEIVE_MESSAGE, {
        senderId: data[0].id,
        receiverId: currentChat.id,
      });
      setMessages(response.data);
    }
    };
    postData();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat.length) {
        await JSON.parse(
          localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
        ).id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg: any) => {
    const data = await JSON.parse(
      localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
    );

    socket.current.emit('send-msg', {
      to: currentChat.id,
      from: data[0].id,
      msg,
    });

    await axios.post(SEND_MESSAGE, {
      senderId: data[0].id,
      receiverId: currentChat.id,
      message: msg,
    });

    const msgs: any = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {    
    if (socket.current.connected) {
      socket.current.on('msg-receive', (data: any) => {
        console.log(data, "data from emit");
        setArrivalMessage({
          fromSelf: false,
          message: data.msg,
          sender_id: data.from,
          receiver_id: data.to,
        });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev: any) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ChatContainerStyled>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={User}
              alt="icon"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message: any) => {
          const data = JSON.parse(
            localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
          );
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.sender_id === data[0].id || message.fromSelf
                    ? 'sended'
                    : 'recieved'
                }`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </ChatContainerStyled>
  );
}
