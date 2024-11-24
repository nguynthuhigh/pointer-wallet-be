module.exports = {
  setCookie: (res, token, key_word, expire) => {
    res.cookie(key_word, token, {
      httpOnly: true,
      sameSite: process.env.PRODUCTION ? "none" : "lax",
      secure: process.env.PRODUCTION === "PRODUCTION",
      path: "/",
      maxAge: expire,
    });
  },
};
