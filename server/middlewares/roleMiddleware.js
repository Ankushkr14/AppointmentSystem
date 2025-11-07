export const requireProfessor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Authentication required",
    });
  }
  
  if (req.user.role !== 'professor') {
    return res.status(403).json({
      success: false,
      message: "Access denied: Professors only",
    });
  }
  
  next();
};
