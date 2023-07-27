import { useState, useEffect, useRef } from 'react';
import { ChatContainer as ChatContainerStyled } from './styled';
import ChatInput from './ChatInput';
import Logout from './Logout';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { SEND_MESSAGE, RECEIVE_MESSAGE } from '../utils/APIRoutes';

export default function ChatContainer({ currentChat }: any) {
  const [messages, setMessages] = useState<any>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);

  useEffect(() => {
    const postData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
      );
      const response = await axios.post(RECEIVE_MESSAGE, {
        senderId: data[0].id,
        receiverId: currentChat.id,
      });
      setMessages(response.data);
    };
    postData();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
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
    // socket.current.emit('send-msg', {
    //   to: currentChat._id,
    //   from: data._id,
    //   msg,
    // });
    await axios.post(SEND_MESSAGE, {
      senderId: data[0].id,
      receiverId: currentChat.id,
      message: msg,
    });
    const msgs: any = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on('msg-recieve', (msg: any) => {
  //       setArrivalMessage({ fromSelf: false, message: msg });
  //     });
  //   }
  // }, []);

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
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
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
        {messages.map((message: any) => {
          console.log(message);
          const data = JSON.parse(
            localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
          );
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.sender_id ===  data[0].id || message.fromSelf ? 'sended' : 'recieved'
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
