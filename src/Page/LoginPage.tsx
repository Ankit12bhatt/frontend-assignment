import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logIn, setUser } from "@/store/reducer/userReducer"
import { authCred } from "@/utils/Data"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"


const Login = () => {
  const { register, handleSubmit } = useForm()
   const dispatch = useDispatch()

  const onSubmit = (data: any) => {
    console.log("Login data:", data)
    const { userName, password } = authCred
    const { email, password: inputPassword } = data

    if (email === userName && inputPassword === password) {
      const fakeToken = uuidv4()

      dispatch(logIn({ token: fakeToken }))
      dispatch(
        setUser({
          id: "1",
          name: "Ankit",
          email: userName,
          role: authCred.role,
        })
      )

      toast.success("Login successful")
    } else {
      toast.error("Invalid credentials")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md md:min-w-[400px] shadow-lg rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">Login to your account</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true })}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
