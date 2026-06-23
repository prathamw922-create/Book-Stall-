const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, is_admin')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.is_admin ? 'admin' : 'user'
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
