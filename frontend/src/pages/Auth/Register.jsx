import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DotmSquare18 } from "@/components/ui/dotm-square-18";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    topSize: "",
    bottomSize: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.topSize) {
      newErrors.topSize = "Tops size is required";
    }

    if (!formData.bottomSize) {
      newErrors.bottomSize = "Bottoms size is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        "https://fitzy-f7uv.onrender.com/api/v1/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            gender: formData.gender,
            topSize: formData.topSize,
            bottomSize: formData.bottomSize,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Automatically login the user after successful registration
        const loginResponse = await fetch(
          "https://fitzy-f7uv.onrender.com/api/v1/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              username: formData.email,
              password: formData.password,
            }),
          }
        );

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem("token", loginData.access_token);
          navigate("/dashboard");
        } else {
          setApiError("Registration succeeded, but auto-login failed. Please login manually.");
        }
      } else {
        setApiError(data.detail || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setApiError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#000000] flex items-center justify-center px-4 py-10 transition-colors duration-500">
      <Card className="w-full max-w-md shadow-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-display font-extrabold text-red-600 dark:text-red-500">Create Account</CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Start your AI styling journey with Fitzy today
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
              <Label htmlFor="fullName" className="text-zinc-700 dark:text-zinc-300">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
                className={`bg-transparent text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800 focus-visible:ring-red-500 ${
                  errors.fullName ? "border-red-500 focus-visible:ring-red-500 animate-shake" : ""
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
              <Label htmlFor="gender" className="text-zinc-700 dark:text-zinc-300">Gender</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value,
                  })
                }
                className={`h-10 w-full rounded-md border bg-transparent text-zinc-950 dark:text-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                  errors.gender
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <option value="" className="bg-white dark:bg-zinc-950">Select Gender</option>
                <option value="Male" className="bg-white dark:bg-zinc-950">Male</option>
                <option value="Female" className="bg-white dark:bg-zinc-950">Female</option>
                <option value="Other" className="bg-white dark:bg-zinc-950">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.gender}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="topSize" className="text-zinc-700 dark:text-zinc-300">Tops Size</Label>
                <select
                  id="topSize"
                  value={formData.topSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      topSize: e.target.value,
                    })
                  }
                  className={`h-10 w-full rounded-md border bg-transparent text-zinc-950 dark:text-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    errors.topSize
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <option value="" className="bg-white dark:bg-zinc-950">Select Top Size</option>
                  <option value="XS" className="bg-white dark:bg-zinc-950">XS</option>
                  <option value="S" className="bg-white dark:bg-zinc-950">S</option>
                  <option value="M" className="bg-white dark:bg-zinc-950">M</option>
                  <option value="L" className="bg-white dark:bg-zinc-950">L</option>
                  <option value="XL" className="bg-white dark:bg-zinc-950">XL</option>
                </select>
                {errors.topSize && (
                  <p className="text-red-500 text-xs font-medium mt-1">
                    {errors.topSize}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bottomSize" className="text-zinc-700 dark:text-zinc-300">Bottoms Size</Label>
                <select
                  id="bottomSize"
                  value={formData.bottomSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bottomSize: e.target.value,
                    })
                  }
                  className={`h-10 w-full rounded-md border bg-transparent text-zinc-950 dark:text-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    errors.bottomSize
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <option value="" className="bg-white dark:bg-zinc-950">Select Bottom Size</option>
                  <option value="XS" className="bg-white dark:bg-zinc-950">XS</option>
                  <option value="S" className="bg-white dark:bg-zinc-950">S</option>
                  <option value="M" className="bg-white dark:bg-zinc-950">M</option>
                  <option value="L" className="bg-white dark:bg-zinc-950">L</option>
                  <option value="XL" className="bg-white dark:bg-zinc-950">XL</option>
                </select>
                {errors.bottomSize && (
                  <p className="text-red-500 text-xs font-medium mt-1">
                    {errors.bottomSize}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-700 dark:text-zinc-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className={`bg-transparent text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800 focus-visible:ring-red-500 ${
                  errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500 animate-shake" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4"
            >
              {loading && <DotmSquare18 className="mr-2 h-4 w-4 text-current" />}
              {loading ? "Registering..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red-500 hover:text-red-600 hover:underline font-semibold"
              >
                Log In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;