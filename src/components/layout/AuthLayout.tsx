import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import Logo from "@/assets/Logo-2.png"

interface AuthLayoutProps {
  title: string
  description: string
  icon?: React.ReactNode
  children: React.ReactNode
}

const AuthLayout = ({
  title,
  description,
  children,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-8">
      <Card className="shadow-xl border border-gray-300 bg-white max-w-lg w-full mx-auto rounded-2xl">
        <CardHeader className="space-y-2 text-center pb-4 pt-8 px-6 lg:px-8 xl:px-10">
          <div className="mx-auto w-65 h-65  bg-[#627192] rounded-full flex items-center justify-center mb-4  ">
            <img src={Logo} alt="RW Logo"/>
          </div>
          <CardTitle className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-base lg:text-lg xl:text-xl text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 lg:px-8 xl:px-10 pb-8">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthLayout
