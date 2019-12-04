import bcrypt from 'bcryptjs';

'use strict';

export default function updatePassword(password) {
  // console.log('in update password');
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
