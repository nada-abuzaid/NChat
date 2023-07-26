import connection from '../config/connection';
import { Query } from '../../interfaces';

export const getUserDataQuery = (username: string) => {
  const query: Query = {
    text: 'SELECT id, username, email, password, isAvatarImageSet, avatarImage FROM users WHERE username=$1;',
    values: [username],
  };
  return connection.query(query);
};

export const emailExistsQuery = (email: string) => {
  const query: Query = {
    text: 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
    values: [email],
  };
  return connection.query(query);
};

export const getUserById = (id: number) => {
  const query: Query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [id],
  };
  return connection.query(query);
};

export const signupQuery = ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  const query: Query = {
    text: `INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, isAvatarImageSet, avatarImage`,
    values: [username, email, password],
  };
  return connection.query(query);
};

export const updateUserAvatar = ({ userId, image }: any) => {
  const query: Query = {
    text: `UPDATE users SET avatarImage = $2, isAvatarImageSet = true 
    WHERE id = $1 
    Returning isAvatarImageSet, avatarImage`,
    values: [userId, image],
  };
  return connection.query(query);
};
