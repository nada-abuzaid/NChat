import { NextFunction, Request, Response } from 'express';
import { loginSchema, signupSchema } from '../utils/validation';
import {
  emailExistsQuery,
  getUserDataQuery,
  signupQuery,
} from '../database/query';
import CustomError from '../utils/customError';
import bcrypt, { compare } from 'bcrypt';
import { signToken } from '../utils/jwt';

export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { password, username },
  } = req;

  let userInfo = {
    id: '',
    username: '',
    email: '',
  };

  loginSchema
    .validateAsync({ password, username })
    .then((data) => getUserDataQuery(data.username))
    .then(({ rows }) => {
      if (rows.length <= 0) throw new CustomError(406, 'wrong email');
      userInfo = {
        id: rows[0].id,
        username: rows[0].username,
        email: rows[0].email,
      };
      return compare(password, rows[0].password);
    })
    .then((isMatch) => {
      if (!isMatch) throw new CustomError(406, 'Please enter correct password');
      return signToken({
        email: userInfo.email,
        id: userInfo.id,
        username: userInfo.username,
      });
    })
    .then((token) =>
      res
        .status(200)
        .cookie('token', token, {
          httpOnly: true,
        })
        .json({
          message: 'Logged In Successfully',
          data: [userInfo],
        })
    )
    .catch((err: any) => {
      if ('isJoi' in err) {
        next(new CustomError(406, err.details[0].message));
      } else {
        next(err);
      }
    });
};

export const signupController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email: string;
  } = req.body;

  signupSchema
    .validateAsync(
      {
        username,
        password,
        email,
      },
      { abortEarly: true }
    )
    .then(() => emailExistsQuery(email))
    .then((exists) => {
      if (exists.rows[0].exists !== false) {
        throw new CustomError(406, 'Email already exists');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash: string) =>
      signupQuery({
        username,
        email,
        password: hash,
      })
    )
    .then((data) => data.rows[0])
    .then((row) => signToken(row))
    .then((token) =>
      res
        .status(201)
        .cookie('token', token, {
          httpOnly: true,
        })
        .json({
          message: 'Created successfully',
          data: [{ username, email }],
        })
    )
    .catch((err: any) => {
      if ('isJoi' in err) {
        next(new CustomError(406, err.details[0].message));
      } else {
        next(err);
      }
    });
};
