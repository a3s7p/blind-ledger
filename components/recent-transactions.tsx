import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTransactions } from "@/contexts/transaction-context"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { format } from "date-fns"

interface RecentTransactionsProps {
  className?: string
}

export function RecentTransactions({ className }: RecentTransactionsProps) {
  const { transactions } = useTransactions()

  // Filter out draft transactions and sort by date (newest first)
  const sortedTransactions = [...transactions]
    .filter((tx) => !tx.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3) // Get only the 3 most recent transactions

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTransactions.map((transaction) => {
            // Determine if this is an income or expense transaction
            const isIncome = transaction.creditAccount === "income" || transaction.debitAccount === "assets"

            return (
              <div key={transaction.id} className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium">{transaction.partner}</p>
                  <p className="text-xs text-muted-foreground">{format(transaction.date, "MMM d, yyyy")}</p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      isIncome ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                  {isIncome ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400 ml-1" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <Button className="w-full mt-4" variant="outline" asChild>
          <Link href="/transactions">
            More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

