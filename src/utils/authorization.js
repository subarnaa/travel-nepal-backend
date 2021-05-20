import createError from "http-errors";

export const denyLoggedIn = (
  req,
  _res,
  next
) => {
  if (req.isAuthenticated()) {
    throw new createError.BadRequest("User already logged in");
  }
  next();
};

export const denyGuest = (req, _res, next) => {
  if (req.isUnauthenticated()) {
    throw new createError.Unauthorized("Not logged in");
  }
  next();
};

export const adminOnly = (req, _res, next) => {
  if (!(req.user).isAdmin) {
    throw new createError.Unauthorized("Unauthorized");
  }
  next();
};
