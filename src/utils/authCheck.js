import jwt from "jsonwebtoken";

export function isAuthenticated(req, res, next) {
  if(!req.headers.authorization) {
    res.status(401).json({errors : {global : "Invalid credentials/missing token"}});
  }
  
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({errors : {global : `Credentials check error : ${err}`}});
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({errors : {global : "Invalid credentials"}});
  }
}
