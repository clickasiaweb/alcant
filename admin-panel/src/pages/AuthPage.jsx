import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiMail, FiUserPlus, FiLogIn, FiCheck, FiAlertCircle, FiRefreshCw, FiZap, FiShield, FiKey, FiActivity, FiInfo } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "../styles/AuthAnimations.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState(null);
  const [particles, setParticles] = useState([]);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10
    }));
    setParticles(newParticles);
  }, []);

  // Password strength calculator
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.match(/[a-z]/)) strength++;
    if (pwd.match(/[A-Z]/)) strength++;
    if (pwd.match(/[0-9]/)) strength++;
    if (pwd.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;
      case 'name':
        if (!value) {
          newErrors.name = 'Name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  // Handle field changes with validation
  const handleFieldChange = (name, value) => {
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        setPasswordStrength(calculatePasswordStrength(value));
        break;
      case 'name':
        setName(value);
        break;
    }
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // Handle field focus with animation
  const handleFieldFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleFieldBlur = (name, value) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
    setFocusedField(null);
  };

  // Check if form is valid
  const isFormValid = () => {
    const requiredFields = isLogin ? ['email', 'password'] : ['email', 'password', 'name'];
    return requiredFields.every(field => {
      const value = field === 'email' ? email : field === 'password' ? password : name;
      return value && !errors[field];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (isLogin) {
      validateField('email', email);
      validateField('password', password);
    } else {
      validateField('email', email);
      validateField('password', password);
      validateField('name', name);
    }
    
    if (!isFormValid()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    setIsCheckingAuth(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Login successful! Redirecting to dashboard...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        await signup(email, password, name);
        toast.success("Account created! Please wait for admin approval.");
        setIsLogin(true);
        setName("");
        setPassword("");
        setPasswordStrength(0);
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
      setIsCheckingAuth(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px]">
          
          {/* Left Panel - Branding */}
          <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-2 border-cyan-400 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-yellow-400 rounded-lg transform rotate-45"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-400 rounded-full blur-xl"></div>
            </div>
            
            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <FiShield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-white">Industrial Solutions</h1>
                  <p className="text-cyan-300 text-xs lg:text-sm">Admin Access Portal</p>
                </div>
              </div>
              
              {/* Welcome Message */}
              <div className="mb-8 lg:mb-12">
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 lg:mb-4">
                  {isLogin ? "Welcome Back" : "Join Our Team"}
                </h2>
                <p className="text-slate-300 text-sm lg:text-lg leading-relaxed">
                  {isLogin 
                    ? "Please sign in to continue to your admin dashboard and manage your industrial operations."
                    : "Create your admin account to access powerful tools for managing industrial solutions."
                  }
                </p>
              </div>
              
              {/* Features */}
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <FiShield className="h-3 w-3 lg:h-4 lg:w-4 text-cyan-400" />
                  </div>
                  <span className="text-slate-300 text-sm lg:text-base">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <FiZap className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-400" />
                  </div>
                  <span className="text-slate-300 text-sm lg:text-base">Real-time monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FiActivity className="h-3 w-3 lg:h-4 lg:w-4 text-green-400" />
                  </div>
                  <span className="text-slate-300 text-sm lg:text-base">Advanced analytics</span>
                </div>
              </div>
            </div>
            
            {/* Bottom branding */}
            <div className="relative z-10 text-center hidden lg:block">
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-yellow-400 mx-auto mb-4"></div>
              <p className="text-slate-400 text-sm">Trusted by industry leaders worldwide</p>
            </div>
          </div>
          
          {/* Right Panel - Login Form */}
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            {/* Auth Tabs */}
            <div className="mb-6 lg:mb-8">
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 lg:px-6 text-center font-semibold rounded-lg transition-all duration-200 text-sm lg:text-base ${
                    isLogin
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  aria-selected={isLogin}
                  role="tab"
                  type="button"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 lg:px-6 text-center font-semibold rounded-lg transition-all duration-200 text-sm lg:text-base ${
                    !isLogin
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  aria-selected={!isLogin}
                  role="tab"
                  type="button"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6" role="form" noValidate>
              {/* Name Field - Only for Signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      onFocus={() => handleFieldFocus('name')}
                      onBlur={() => handleFieldBlur('name', name)}
                      className={`block w-full pl-12 pr-12 py-3 lg:py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all placeholder-slate-400 text-slate-900 text-sm lg:text-base ${
                        errors.name ? 'border-red-300 bg-red-50' : 
                        focusedField === 'name' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-white'
                      }`}
                      placeholder="John Doe"
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && touched.name && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <FiAlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                    {name && !errors.name && touched.name && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <FiCheck className="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.name && touched.name && (
                    <p id="name-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                      <FiAlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address <span className="text-red-500" aria-label="required">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onFocus={() => handleFieldFocus('email')}
                    onBlur={() => handleFieldBlur('email', email)}
                    className={`block w-full pl-12 pr-12 py-3 lg:py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all placeholder-slate-400 text-slate-900 text-sm lg:text-base ${
                      errors.email ? 'border-red-300 bg-red-50' : 
                      focusedField === 'email' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-white'
                    }`}
                    placeholder="admin@example.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && touched.email && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <FiAlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                  {email && !errors.email && touched.email && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <FiCheck className="h-5 w-5 text-green-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.email && touched.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                    <FiAlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password <span className="text-red-500" aria-label="required">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onFocus={() => handleFieldFocus('password')}
                    onBlur={() => handleFieldBlur('password', password)}
                    className={`block w-full pl-12 pr-20 py-3 lg:py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all placeholder-slate-400 text-slate-900 text-sm lg:text-base ${
                      errors.password ? 'border-red-300 bg-red-50' : 
                      focusedField === 'password' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-white'
                    }`}
                    placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-12 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && touched.password && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <FiAlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                  {password && !errors.password && touched.password && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <FiCheck className="h-5 w-5 text-green-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.password && touched.password && (
                  <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                    <FiAlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Password Strength Indicator - Only for Signup */}
              {!isLogin && password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Password Strength</span>
                    <span className={`text-xs font-bold ${
                      passwordStrength < 2 ? 'text-red-600' :
                      passwordStrength < 3 ? 'text-yellow-600' :
                      passwordStrength < 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {passwordStrength < 2 ? 'Weak' :
                       passwordStrength < 3 ? 'Fair' :
                       passwordStrength < 4 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        passwordStrength < 2 ? 'bg-red-500' :
                        passwordStrength < 3 ? 'bg-yellow-500' :
                        passwordStrength < 4 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className={`w-full py-4 px-6 text-base font-semibold rounded-xl transition-all duration-200 ${
                  loading || !isFormValid()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <FiRefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isCheckingAuth ? (
                  <div className="flex items-center justify-center">
                    <FiActivity className="h-5 w-5 mr-3 animate-pulse" />
                    Authenticating...
                  </div>
                ) : (
                  <span>{isLogin ? "Sign In to Admin Panel" : "Create Admin Account"}</span>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            {isLogin && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiKey className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Demo / Development Mode</p>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        <span className="font-mono bg-white px-2 py-1 rounded">admin@example.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Password:</span>
                        <span className="font-mono bg-white px-2 py-1 rounded">admin123</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-3">
                      💡 You must create an admin account first via signup before logging in.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Signup Info */}
            {!isLogin && (
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiAlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-900">
                      <strong>Important:</strong> After signup, you'll need admin approval to access the dashboard. Contact the system administrator to upgrade your account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Creation Notice */}
            <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FiInfo className="h-4 w-4 text-slate-500" />
                <span>You must create an admin account before logging in for the first time.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="w-full h-px bg-slate-200 mb-6"></div>
          <p className="text-sm text-slate-500 mb-2">
            © 2024 Industrial Solutions. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <FiShield className="h-3 w-3 text-green-500" />
            <span>Powered by Supabase Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
