import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Robot from '../assets/robot.gif';

export default function Welcome() {
  const [userName, setUserName] = useState('');
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      setUserName(
        await JSON.parse(
          localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
        )[0].username
      );
      setisLoading(false);
    };
    setData();
  }, []);

  return (
    <Container>
      <img src={Robot} alt="robot" />
      {!isLoading && (
        <h1>
          Welcome, <span>{userName}!</span>
        </h1>
      )}
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
