// middleware/auth.js

const protectRoute = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized - Please login",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export { protectRoute };
