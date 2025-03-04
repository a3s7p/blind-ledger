"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { TrendingUp, DollarSign, BarChart2, Percent } from "lucide-react"
import { useTransactions } from "@/contexts/transaction-context"
import { getFinancialMetrics } from "@/lib/utils"
import { format } from "date-fns"

export function BusinessMetricsAnalytics() {
  const { transactions } = useTransactions()
  const metrics = getFinancialMetrics(transactions)

  // Create metrics cards based on actual transaction data
  const metricCards = [
    {
      id: 1,
      title: "Total Income",
      icon: DollarSign,
      status: "On Track",
      progress: metrics.totalIncome > 0 ? 100 : 0,
      target: metrics.totalIncome,
      current: metrics.totalIncome,
      unit: "$",
      data: metrics.dailyData.map((day) => ({ date: day.date, value: day.income })),
    },
    {
      id: 2,
      title: "Total Expenses",
      icon: DollarSign,
      status: metrics.totalExpenses < metrics.totalIncome ? "On Track" : "Behind",
      progress:
        metrics.totalIncome > 0
          ? Math.min(((metrics.totalIncome - metrics.totalExpenses) / metrics.totalIncome) * 100, 100)
          : 0,
      target: metrics.totalIncome > metrics.totalExpenses ? metrics.totalExpenses : metrics.totalIncome,
      current: metrics.totalExpenses,
      unit: "$",
      data: metrics.dailyData.map((day) => ({ date: day.date, value: day.expenses })),
    },
    {
      id: 3,
      title: "Profit Margin",
      icon: Percent,
      status: metrics.profitMargin > 20 ? "Ahead" : metrics.profitMargin > 0 ? "On Track" : "Behind",
      progress: Math.max(metrics.profitMargin, 0),
      target: 20, // Target profit margin of 20%
      current: metrics.profitMargin,
      unit: "%",
      data: metrics.dailyData.map((day) => ({
        date: day.date,
        value: day.income > 0 ? ((day.income - day.expenses) / day.income) * 100 : 0,
      })),
    },
    {
      id: 4,
      title: "Cash Flow",
      icon: TrendingUp,
      status: metrics.cashFlow > 0 ? "On Track" : "Behind",
      progress: metrics.cashFlow > 0 ? 100 : 0,
      target: Math.max(metrics.cashFlow, 0),
      current: metrics.cashFlow,
      unit: "$",
      data: metrics.dailyData.map((day) => ({ date: day.date, value: day.cashFlow })),
    },
    {
      id: 5,
      title: "Net Worth",
      icon: BarChart2,
      status: metrics.netWorth > 0 ? "On Track" : "Behind",
      progress: metrics.netWorth > 0 ? 100 : 0,
      target: Math.max(metrics.netWorth, 0),
      current: metrics.netWorth,
      unit: "$",
      data: metrics.dailyData.map((day) => ({ date: day.date, value: day.netWorth })),
    },
    {
      id: 6,
      title: "Avg Transaction Value",
      icon: DollarSign,
      status: "On Track",
      progress: 100,
      target: metrics.avgTransactionValue,
      current: metrics.avgTransactionValue,
      unit: "$",
      data: metrics.dailyData.map((day) => ({
        date: day.date,
        value: (day.income + day.expenses) / 2, // Simplified for demonstration
      })),
    },
  ]

  const statusColors = {
    "On Track": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Behind: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Ahead: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric) => (
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
                    {metric.unit.startsWith("$") ? "$" : ""}
                    {metric.current.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    {!metric.unit.startsWith("$") ? metric.unit : ""}
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
                    {metric.unit.startsWith("$") ? "$" : ""}
                    {metric.target.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    {!metric.unit.startsWith("$") ? metric.unit : ""}
                  </span>
                  <span className="text-muted-foreground">{metric.progress.toFixed(1)}% complete</span>
                </div>
                <div className="h-24 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metric.data}>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(new Date(date), "MM/dd")}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) =>
                          metric.unit === "$"
                            ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                            : `${value.toFixed(0)}${metric.unit}`
                        }
                      />
                      <Tooltip
                        labelFormatter={(date) => format(new Date(date), "MMM dd, yyyy")}
                        formatter={(value) => [
                          `${metric.unit.startsWith("$") ? "$" : ""}${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}${!metric.unit.startsWith("$") ? metric.unit : ""}`,
                          metric.title,
                        ]}
                      />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 2 }} />
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

