import connection from '../config/connection';
import { Query } from '../../interfaces';

export const getUserDataQuery = (username: string) => {
  const query: Query = {
    text: 'SELECT id, username, email, password FROM users WHERE username=$1;',
    values: [username],
  };
  return connection.query(query);
};
