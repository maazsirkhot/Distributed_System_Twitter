
export default function getToken(req) {
  // console.log('in get token')
  const header = req.headers.authorization;
  // console.log('in ensure user', req.headers, header)
  if (!header) {
    // console.log('in not if')
    return null;
  }
  const parts = header.split(' ');
  if (parts.length !== 2) {
    // console.log('in parts')
    return null;
  }
  const scheme = parts[0];
  const token = parts[1];
  if (/^Bearer$/i.test(scheme)) {
    // console.log('in bearer')
    return token;
  }
  return null;
}
