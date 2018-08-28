import jwt from "jsonwebtoken";

export default (authHeader) => {  
  
  if(!!authHeader) return false;

  const token = authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return true;
      } else {
        return true;
      }
    });
  } else {
    return false;
  }
};