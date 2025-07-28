import AuthLayout from "@/components/layout/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import  { loginSchema } from "@/schema/AuthSchme"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

type LoginFormData = z.infer<typeof loginSchema>
const Login = () => {
  const { register, handleSubmit, formState:{errors}  } = useForm({
    resolver: zodResolver(loginSchema),
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      console.log("Login data:", data)
     
    } catch (error) {
      
      toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your account to continue"
    >
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-6 lg:space-y-8"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="pl-10"
              required
            />
           

          </div>
           <div className="text-red-500 text-sm mt-1">
              {errors.email && errors.email.message}
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className="pl-10 pr-10"
            
            />
           
            <Button
              variant="ghost"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0 !bg-transparent"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
           <div className="text-red-500 text-sm mt-1">
              {errors.password && errors.password.message}
            </div>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 lg:h-12 xl:h-14 text-base lg:text-lg font-semibold  hover:bg-gray-600 text-white border-0 transition-all duration-200"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
