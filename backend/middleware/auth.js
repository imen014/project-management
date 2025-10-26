const jwt = require('jsonwebtoken');
module.exports = (req,res,next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if(!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch(e){ res.status(401).json({ msg:'Invalid token' }); }
};
