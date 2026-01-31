const { supabase } = require("../config/supabase");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No authentication token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, email, id')
      .eq('email', user.email)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ error: "User profile not found" });
    }

    req.user = {
      id: profile.id,
      email: profile.email,
      role: profile.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
