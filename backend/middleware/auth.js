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

    // Try to get user profile, but don't fail if it doesn't exist
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, email, id')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      role: 'authenticated' // Default role for all authenticated users
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
