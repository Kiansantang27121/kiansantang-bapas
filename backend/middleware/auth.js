import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

export function requireOperator(req, res, next) {
  if (req.user.role !== 'operator' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Operator access required' });
  }
  next();
}

export function requirePK(req, res, next) {
  // Check if user has pk_id (is a PK user)
  if (!req.user.pk_id) {
    return res.status(403).json({ error: 'PK access required' });
  }
  next();
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'User role not found' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied', 
        required: allowedRoles,
        current: req.user.role 
      });
    }
    
    next();
  };
}
