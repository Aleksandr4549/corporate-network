import {body} from 'express-validator';

export const registerbody = [
  body('email', 'input e-mail').isEmail().withMessage('bad e-mail'),

  body('fullname', 'input fullname')
    .isString()
    .isLength({min: 2})
    .withMessage('fullname min length 2 symbols'),

  body('username', 'input login')
    .isString()
    .isLength({min: 2, max: 10})
    .withMessage('login min length 2 symbols, max 10'),

  body('password', 'input password')
    .isString()
    .isLength({min: 4})
    .withMessage('password min length 4 symbols'),
]