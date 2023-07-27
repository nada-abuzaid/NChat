import { useState, useEffect } from 'react';
import { ContactsContainer } from './styled';
import Logo from '../assets/logo.svg';
import User from '../assets/icon.png';

export default function Contacts({ contacts, changeChat }: any) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
      );
      setCurrentUserName(data[0].username);
      setCurrentUserImage(data[0].avatarImage);
    };
    fetchData();
  }, []);

  const changeCurrentChat = (index: any, contact: any) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserImage && (
        <ContactsContainer>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>NChat</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact: any, index: any) => {              
              return (
                <div
                  key={contact.id}
                  className={`contact ${
                    index === currentSelected ? 'selected' : ''
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img src={User} alt="avatar" />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img src={User} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </ContactsContainer>
      )}
    </>
  );
}
