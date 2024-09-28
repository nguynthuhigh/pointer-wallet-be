module.exports = {
  setCookie: (res, token, key_word) => {
    res.cookie(key_word, token, {
      // httpOnly: true,
      sameSite: "none",
      // secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 15 * 1000,
    });
  },
};
