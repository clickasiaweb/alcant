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

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([{
          email,
          name,
          role: 'user',
          is_active: true
        }])
        .select()
        .single();

      if (profileError) {
        // Clean up auth user if profile creation fails
        if (authData.user) {
          await supabaseService.auth.admin.deleteUser(authData.user.id);
        }
        throw profileError;
      }

      res.status(201).json({
        message: "Account created successfully",
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role
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

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        return res.status(401).json({
          error: "User profile not found"
        });
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        return res.status(401).json({
          error: "Account is deactivated"
        });
      }

      res.json({
        message: "Login successful",
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role
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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      is_active: profile.is_active
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
