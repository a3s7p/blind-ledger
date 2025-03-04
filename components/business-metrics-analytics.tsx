"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, DollarSign, Clock, BarChart2, Percent } from "lucide-react"

const metrics = [
  {
    id: 1,
    title: "Revenue Growth",
    icon: TrendingUp,
    status: "On Track",
    progress: 75,
    target: 100000,
    current: 75000,
    unit: "$",
    data: [{ value: 40 }, { value: 30 }, { value: 45 }, { value: 50 }, { value: 60 }, { value: 75 }],
  },
  {
    id: 2,
    title: "Customer Acquisition",
    icon: Users,
    status: "Behind",
    progress: 60,
    target: 1000,
    current: 600,
    unit: "",
    data: [{ value: 10 }, { value: 15 }, { value: 25 }, { value: 30 }, { value: 45 }, { value: 60 }],
  },
  {
    id: 3,
    title: "Average Order Value",
    icon: DollarSign,
    status: "Ahead",
    progress: 110,
    target: 150,
    current: 165,
    unit: "$",
    data: [{ value: 80 }, { value: 90 }, { value: 85 }, { value: 100 }, { value: 120 }, { value: 110 }],
  },
  {
    id: 4,
    title: "Conversion Rate",
    icon: Percent,
    status: "On Track",
    progress: 80,
    target: 5,
    current: 4,
    unit: "%",
    data: [{ value: 60 }, { value: 65 }, { value: 70 }, { value: 75 }, { value: 80 }, { value: 80 }],
  },
  {
    id: 5,
    title: "Customer Lifetime Value",
    icon: Users,
    status: "Ahead",
    progress: 115,
    target: 2000,
    current: 2300,
    unit: "$",
    data: [{ value: 90 }, { value: 95 }, { value: 100 }, { value: 110 }, { value: 115 }, { value: 115 }],
  },
  {
    id: 6,
    title: "Monthly Recurring Revenue",
    icon: DollarSign,
    status: "On Track",
    progress: 95,
    target: 50000,
    current: 47500,
    unit: "$",
    data: [{ value: 70 }, { value: 75 }, { value: 80 }, { value: 85 }, { value: 90 }, { value: 95 }],
  },
  {
    id: 7,
    title: "Customer Retention",
    icon: Users,
    status: "Behind",
    progress: 85,
    target: 90,
    current: 76.5,
    unit: "%",
    data: [{ value: 75 }, { value: 80 }, { value: 85 }, { value: 80 }, { value: 85 }, { value: 85 }],
  },
  {
    id: 8,
    title: "Average Sales Cycle",
    icon: Clock,
    status: "On Track",
    progress: 70,
    target: 30,
    current: 21,
    unit: " days",
    data: [{ value: 50 }, { value: 55 }, { value: 60 }, { value: 65 }, { value: 70 }, { value: 70 }],
  },
  {
    id: 9,
    title: "Market Share",
    icon: BarChart2,
    status: "Behind",
    progress: 65,
    target: 15,
    current: 9.75,
    unit: "%",
    data: [{ value: 40 }, { value: 45 }, { value: 50 }, { value: 55 }, { value: 60 }, { value: 65 }],
  },
]

const statusColors = {
  "On Track": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Behind: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Ahead: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

export function BusinessMetricsAnalytics() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Business Metrics</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${statusColors[metric.status]}`}>{metric.status}</span>
                  <span className="text-muted-foreground">
                    {metric.current} / {metric.target}
                    {metric.unit}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${Math.min(metric.progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">
                    {metric.unit.startsWith("$") ? metric.unit : ""}
                    {metric.target.toLocaleString()}
                    {!metric.unit.startsWith("$") ? metric.unit : ""}
                  </span>
                  <span className="text-muted-foreground">{metric.progress}% complete</span>
                </div>
                <div className="h-10 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metric.data}>
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

