import { NextFunction, Request, Response } from 'express';
import { loginSchema, signupSchema } from '../utils/validation';
import {
  emailExistsQuery,
  getMessagesQuery,
  getUserById,
  getUserDataQuery,
  getUsersQuery,
  insertMessageQuery,
  signupQuery,
  updateUserAvatar,
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
    isAvatarImageSet: false,
    avatarImage: '',
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
        isAvatarImageSet: rows[0].isavatarimageset,
        avatarImage: rows[0].avatarimage,
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

  let userInfo = {
    id: '',
    username: '',
    email: '',
    isAvatarImageSet: false,
    avatarImage: '',
  };

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
    .then((data) => {
      userInfo = data.rows[0];
      userInfo.isAvatarImageSet = data.rows[0].isAvatarImageSet;
      userInfo.avatarImage = data.rows[0].avatarImage;
      return Promise.resolve(data.rows[0]);
    })
    .then((row) => signToken(row))
    .then((token) =>
      res
        .status(201)
        .cookie('token', token, {
          httpOnly: true,
        })
        .json({
          message: 'Created successfully',
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

export const setAvatarController = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.params.id;
  const avatarImage = req.body.image;
  getUserById(+userId)
    .then((data) => {
      if (!data.rowCount) throw new CustomError(404, "User doesn't exist!");
      return Promise.resolve(data.rows[0]);
    })
    .then(() => updateUserAvatar({ userId, image: avatarImage }))
    .then((data) => res.json(data.rows[0]))
    .catch((err: any) => {
      console.log(err, userId);
    });
};

export const getUsersController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  getUsersQuery(+id)
    .then((data) => {
      res.send(data.rows);
    })
    .catch((err) => console.log(err));
};

export const logoutController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.clearCookie('token').json({
    message: 'Logged out successfully',
  });
};

export const insertMessageController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { senderId, receiverId, message } = req.body;
  insertMessageQuery(senderId, receiverId, message)
    .then((data) => {
      res.send(data.rows);
    })
    .catch((err) => console.log(err));
};

export const getMessagesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { senderId, receiverId } = req.body;  
  getMessagesQuery(senderId, receiverId)
    .then((data) => {
      res.send(data.rows);
    })
    .catch((err) => console.log(err));
}