"use client"

import { useTransactions } from "@/contexts/transaction-context"
import { getFinancialMetrics } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Shield, Clock } from "lucide-react"

export default function LiveReportPage() {
  const { transactions } = useTransactions()
  const metrics = getFinancialMetrics(transactions)
  const timestamp = new Date()

  // Get the last transaction hash (authenticity hash)
  const nonDraftTransactions = transactions.filter((tx) => !tx.draft)
  const sortedTransactions = [...nonDraftTransactions].sort((a, b) => b.date.getTime() - a.date.getTime())
  const lastTransactionHash = sortedTransactions.length > 0 ? sortedTransactions[0].hash : "N/A"

  // Prepare financial metrics for display
  const financialMetrics = [
    { name: "Total Income", value: `$${metrics.totalIncome.toLocaleString()}` },
    { name: "Total Expenses", value: `$${metrics.totalExpenses.toLocaleString()}` },
    { name: "Net Profit", value: `$${(metrics.totalIncome - metrics.totalExpenses).toLocaleString()}` },
    { name: "Profit Margin", value: `${metrics.profitMargin.toFixed(2)}%` },
    { name: "Cash Flow", value: `$${metrics.cashFlow.toLocaleString()}` },
    { name: "Net Worth", value: `$${metrics.netWorth.toLocaleString()}` },
    { name: "Total Assets", value: `$${Math.abs(metrics.accountBalances.assets).toLocaleString()}` },
    { name: "Total Liabilities", value: `$${Math.abs(metrics.accountBalances.liabilities).toLocaleString()}` },
    { name: "Average Transaction Value", value: `$${metrics.avgTransactionValue.toLocaleString()}` },
    { name: "Total Transactions", value: nonDraftTransactions.length.toString() },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Financial Report</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Live financial metrics and authenticity verification
          </p>
        </div>

        <div className="mb-10 flex justify-between items-center">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Clock className="mr-2 h-5 w-5" />
            <span>Generated on: {format(timestamp, "MMMM d, yyyy 'at' h:mm a")}</span>
          </div>

          <div className="flex items-center text-green-600 dark:text-green-400">
            <Shield className="mr-2 h-5 w-5" />
            <span>Verified Report</span>
          </div>
        </div>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Financial Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialMetrics.map((metric) => (
                  <TableRow key={metric.name}>
                    <TableCell className="font-medium">{metric.name}</TableCell>
                    <TableCell className="text-right">{metric.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authenticity Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Authenticity Hash</h3>
                <p className="mt-1 text-sm break-all font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {lastTransactionHash}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Verification Method</h3>
                <p className="mt-1 text-sm">
                  This report is verified using SHA-1 hash chaining. Each transaction contains a hash of its contents
                  and the hash of the previous transaction, creating an immutable chain of records.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                <p className="mt-1 text-sm">
                  {nonDraftTransactions.length > 0
                    ? format(sortedTransactions[0].date, "MMMM d, yyyy 'at' h:mm a")
                    : "No transactions available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            This report is generated automatically from the transaction ledger. All financial data is calculated based
            on actual transaction records.
          </p>
        </div>
      </div>
    </div>
  )
}

