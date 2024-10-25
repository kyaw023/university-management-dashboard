// Admin authorization middleware
const adminMiddleware = (req: any, res: any, next: any) => {
  // Check if user information is attached to the request
  // if (!req.user) {
  //   return res.status(401).json({ message: "Unauthorized. No user found." });
  // }

  // Check if the user has admin privileges
  if (req.user.role === "admin") {
    next(); // User is an admin, proceed to the next middleware or route handler
  } else {
    return res.status(403).json({ message: "Forbidden. Admin access only." });
  }
};

export default adminMiddleware;
