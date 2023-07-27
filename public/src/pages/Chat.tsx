import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ALL_USERS } from '../utils/APIRoutes';
import ChatContainer from '../components/ChatContainer';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';

export const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>([]);
  const [currentChat, setCurrentChat] = useState<any>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const setData = async () => {
      if (!localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)) {
        navigate('/login');
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
          )
        );
      }
    };
    setData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser.length) {
        if (currentUser[0].isAvatarImageSet) {
        const data = await axios.get(`${ALL_USERS}/${currentUser[0].id}`);
        setContacts(data.data);
        } else {
        navigate('/setAvatar');
        }
      }
    };
    fetchData();
  }, [currentUser]);

  //   useEffect(() => {
  //   if (currentUser) {
  //     socket.current = io(host);
  //     socket.current.emit('add-user', currentUser._id);
  //   }
  // }, [currentUser]);

  const handleChatChange = (chat: any) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat.length === 0 ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} />
          )}
        </div>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
