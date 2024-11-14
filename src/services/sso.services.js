const { PointerStrategy } = require("sso-pointer");
const pointer = new PointerStrategy(
  process.env.POINTER_CLIENT_ID,
  process.env.POINTER_CLIENT_SECRET
);

module.exports = {
  getAccessToken: async (code) => {
    return await pointer.getAccessToken(code);
  },
  verifyAccessToken: async (accessToken) => {
    return await pointer.verifyAccessToken(accessToken);
  },
};
// {
//   accessToken: 'eyJhbGciOiJSUz.......',
//   user: { _id: '66f18f7c2c298da02e857d85', email: 'admin@pointer.com',image:'image.url.com',name:'Admin' }
// }
//Verify token
