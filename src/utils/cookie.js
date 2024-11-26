module.exports = {
  setCookie: (res, token, key_word, expire) => {
    res.cookie(key_word, token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: expire,
    });
  },
};
