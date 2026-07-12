import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DotmSquare18 } from "@/components/ui/dotm-square-18";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(
        "https://fitzy-f7uv.onrender.com/api/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      } else {
        setApiError(data.detail || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      setApiError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#000000] flex items-center justify-center px-4 transition-colors duration-500">
      <Card className="w-full max-w-md shadow-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-display font-extrabold text-red-600 dark:text-red-500">Welcome Back</CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Log in to your Fitzy account to continue styling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
              <Alert variant="destructive" className="py-2.5 bg-red-500/10 text-red-500 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className={`bg-transparent text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800 focus-visible:ring-red-500 ${
                  errors.email ? "border-red-500 focus-visible:ring-red-500 animate-shake" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className={`bg-transparent text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800 focus-visible:ring-red-500 ${
                  errors.password ? "border-red-500 focus-visible:ring-red-500 animate-shake" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading && <DotmSquare18 className="mr-2 h-4 w-4 text-current" />}
              {loading ? "Logging In..." : "Log In"}
            </Button>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-red-500 hover:text-red-600 hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;