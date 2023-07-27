import { useEffect, useState } from 'react';
import { Container } from './styled';
import axios from 'axios';
import loader from '../assets/loader.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { SET_AVATAR } from '../utils/APIRoutes';

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(-1);
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

  useEffect(() => {
    if (!localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY))
      navigate('/login');
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === -1) {
      toast.error('Please select an avatar', toastOptions as any);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)!
      );      
      const { data } = await axios.post(`${SET_AVATAR}/${user[0].id}`, {
        image: avatars[selectedAvatar],
      });    

      if (data.isavatarimageset) {
        user[0].isAvatarImageSet = true;
        user[0].avatarImage = data.avatarimage;        
        localStorage.setItem(
          import.meta.env.VITE_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate('/');
      } else {
        toast.error(
          'Error setting avatar. Please try again.',
          toastOptions as any
        );
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = [];
        for (let i = 0; i < 4; i++) {
          const response = await fetch('http://localhost:3000/api/multiavatar');
          if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            data.push(imageUrl);
          }
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [api]);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? 'selected' : ''
                  }`}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}
