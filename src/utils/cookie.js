module.exports = {
  setCookie: (res, token, key_word) => {
    res.cookie(key_word, token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 15 * 1000,
      // expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    });
  },
};
