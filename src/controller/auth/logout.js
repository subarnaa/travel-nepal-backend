import createError from "http-errors";

export const logOutRoute = (req, res) => {
  //  terminate a login session from passport
  req.logout();

  // destroys session from redis store
  // because passport doesn't do this
  req.session.destroy((err) => {
    if (err) throw new createError.InternalServerError();
    // delete coolie on the client
    res.clearCookie("qid");
    res.sendStatus(200);
  });
};
