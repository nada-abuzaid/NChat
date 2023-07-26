import connection from '../config/connection';
import { Query } from '../../interfaces';

export const getUserDataQuery = (username: string) => {
  const query: Query = {
    text: 'SELECT id, username, email, password FROM users WHERE username=$1;',
    values: [username],
  };
  return connection.query(query);
};

export const emailExistsQuery = (email: string) => {
  const query:Query = {
    text: 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
    values: [email],
  };
  return connection.query(query);
}

export const signupQuery = ({
  username, email, password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  const userSql = {
    text: `INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email`,
    values: [username, email, password],
  };
  return connection.query(userSql);
};