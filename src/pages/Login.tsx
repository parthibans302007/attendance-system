import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Role } from "@/data/mockData";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, loginAs } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Use quick login below.");
    }
  };

  const handleQuickLogin = (role: Role) => {
    loginAs(role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f0f7fc] relative overflow-hidden">
      {/* Subtle pattern background like MyCamu */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%230284c7' stroke-width='1.5'%3E%3Cpath d='M22 10v6M2 10l10-5 10 5-10 5z'/%3E%3Cpath d='M6 12v5c3 3 9 3 12 0v-5'/%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
      }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">my</span>
            <span className="text-lg font-bold text-primary">AttendPro</span>
          </div>
        </div>
      </header>

      {/* Center card */}
      <div className="relative z-10 flex items-center justify-center px-4" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl shadow-lg border p-8">
            <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">User name</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-right mt-1.5">
                  <button type="button" className="text-xs text-accent hover:underline">Forgot password?</button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-medium">
                Login
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">OR</span>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4 mb-3">Quick Demo Login</p>
              <div className="grid grid-cols-3 gap-2">
                {(["admin", "faculty", "student"] as Role[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleQuickLogin(role)}
                    className="py-2.5 px-3 rounded-lg border text-sm font-medium capitalize transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By logging in, you agree to our Terms of Use and Privacy Policy.
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            2024 © AttendPro. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
