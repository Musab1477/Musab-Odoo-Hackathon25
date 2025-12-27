import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Eye, EyeOff, Mail, Lock, User, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Password requirements
const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
  { id: 'lowercase', label: 'One lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
  { id: 'number', label: 'One number', test: (pwd: string) => /[0-9]/.test(pwd) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Password validation state
  const passwordValidation = useMemo(() => {
    return passwordRequirements.map(req => ({
      ...req,
      passed: req.test(formData.password)
    }));
  }, [formData.password]);

  const isPasswordValid = passwordValidation.every(req => req.passed);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMismatch = formData.confirmPassword.length > 0 && !passwordsMatch;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid) {
      toast({
        title: "Weak Password",
        description: "Please meet all password requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}auth/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "User Created",
          description: data.message || "Welcome to GearGuard! Please login to continue.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Signup Failed",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">GearGuard</h1>
            <p className="text-xs text-muted-foreground">Maintenance Tracker</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Sign up to start managing your maintenance tasks
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="First name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Last name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Requirements */}
                {formData.password.length > 0 && (
                  <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Password must contain:</p>
                    <div className="grid grid-cols-1 gap-1">
                      {passwordValidation.map((req) => (
                        <div key={req.id} className="flex items-center gap-2">
                          {req.passed ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-destructive" />
                          )}
                          <span className={`text-xs ${req.passed ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`h-11 pl-10 pr-10 ${showPasswordMismatch ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Match Indicator */}
                {formData.confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    {passwordsMatch ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5 text-destructive" />
                        <span className="text-xs text-destructive">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading || !isPasswordValid || !passwordsMatch}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
