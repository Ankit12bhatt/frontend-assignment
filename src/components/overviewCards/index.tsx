import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import React from "react"

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  iconColor?: string
  subtitle?: string
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, iconColor = "text-gray-500", subtitle }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

export default StatsCard
