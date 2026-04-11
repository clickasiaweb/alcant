const { supabase, supabaseService } = require("../config/supabase");
const { body, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// Signup (Registration)
exports.signup = [
  // Validation
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  handleValidationErrors,

  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Create auth user
      const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          return res.status(400).json({
            error: "Email already registered"
          });
        }
        throw authError;
      }

      // Profile is automatically created by trigger, so just return success
      res.status(201).json({
        message: "Account created successfully",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: name
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        error: error.message || "Server error during registration"
      });
    }
  },
];

// Login
exports.login = [
  // Validation
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  handleValidationErrors,

  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({
          error: "Invalid credentials"
        });
      }

      // Try to get user profile, but don't fail if it doesn't exist
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      res.json({
        message: "Login successful",
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User'
        },
        session: data.session
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Server error during login"
      });
    }
  },
];

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Try to get user profile, but don't fail if it doesn't exist
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    res.json({
      id: user.id,
      email: user.email,
      name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await supabaseService.auth.admin.signOut(token);
    }
    
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error during logout" });
  }
};
