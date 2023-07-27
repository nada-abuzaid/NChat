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

export const getUsersQuery = (id: number) => {
  const query: Query = {
    text: `SELECT id, username, email, isAvatarImageSet, avatarImage FROM users where id != ${id}`,
    values: [],
  };
  return connection.query(query);
}

export const getMessagesQuery = (senderId: number, receiverId: number) => {  
  const query: Query = {
    text: `SELECT * FROM chats 
    WHERE (sender_id = $1 AND receiver_id = $2) 
    OR (sender_id = $2 AND receiver_id = $1) 
    ORDER BY created_at ASC`,
    values: [senderId, receiverId],
  };
  return connection.query(query);
}

export const insertMessageQuery = (senderId: number, receiverId: number, message: string) => {
  const query: Query = {
    text: `INSERT INTO chats (sender_id, receiver_id, message) 
    VALUES ($1, $2, $3) 
    RETURNING *`,
    values: [senderId, receiverId, message],
  };
  return connection.query(query);
}