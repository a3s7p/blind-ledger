import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Transaction = {
  id: string
  date: Date
  partner: string
  description?: string
  currency: "USD" | "EUR"
  amount: number
  debitAccount: "assets" | "income" | "liabilities" | "expenses"
  creditAccount: "assets" | "income" | "liabilities" | "expenses"
  draft: boolean
  hash?: string
  previousHash?: string
}

export const accountTypes = [
  { id: "assets", name: "Assets", number: "1000" },
  { id: "income", name: "Income", number: "2000" },
  { id: "liabilities", name: "Liabilities", number: "3000" },
  { id: "expenses", name: "Expenses", number: "4000" },
]

export const currencyOptions = [
  { id: "USD", symbol: "$", name: "USD" },
  { id: "EUR", symbol: "€", name: "EUR" },
]

export function formatCurrency(amount: number, currency: "USD" | "EUR"): string {
  const symbol = currency === "USD" ? "$" : "€"
  return `${symbol}${amount.toFixed(2)}`
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Function to compute SHA-1 hash of a transaction
export function computeTransactionHash(transaction: Omit<Transaction, "hash">): string {
  // Create a copy of the transaction without the hash field
  const { hash, ...transactionWithoutHash } = transaction as any

  // Convert to JSON string
  const jsonString = JSON.stringify(transactionWithoutHash)

  // Compute SHA-1 hash
  return crypto.createHash("sha1").update(jsonString).digest("hex")
}

// Function to get financial metrics from transactions
export function getFinancialMetrics(transactions: Transaction[]) {
  const nonDraftTransactions = transactions.filter((tx) => !tx.draft)

  // Total Income (sum of all transactions where creditAccount is "income")
  const totalIncome = nonDraftTransactions
    .filter((tx) => tx.creditAccount === "income")
    .reduce((sum, tx) => sum + tx.amount, 0)

  // Total Expenses (sum of all transactions where debitAccount is "expenses")
  const totalExpenses = nonDraftTransactions
    .filter((tx) => tx.debitAccount === "expenses")
    .reduce((sum, tx) => sum + tx.amount, 0)

  // Profit Margin
  const profitMargin = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Net Worth (Assets - Liabilities)
  const accountBalances = accountTypes.reduce(
    (acc, accountType) => {
      const balance = nonDraftTransactions.reduce((sum, transaction) => {
        let change = 0
        if (transaction.debitAccount === accountType.id) {
          change += transaction.amount
        }
        if (transaction.creditAccount === accountType.id) {
          change -= transaction.amount
        }
        return sum + change
      }, 0)

      return { ...acc, [accountType.id]: balance }
    },
    {} as Record<string, number>,
  )

  const netWorth = accountBalances.assets - accountBalances.liabilities

  // Cash Flow (Income - Expenses)
  const cashFlow = totalIncome - totalExpenses

  // Average Transaction Value
  const avgTransactionValue =
    nonDraftTransactions.length > 0
      ? nonDraftTransactions.reduce((sum, tx) => sum + tx.amount, 0) / nonDraftTransactions.length
      : 0

  // Group transactions by month for trend analysis
  const transactionsByMonth = nonDraftTransactions.reduce(
    (acc, tx) => {
      const monthYear = `${tx.date.getFullYear()}-${tx.date.getMonth() + 1}`
      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expenses: 0, date: new Date(tx.date.getFullYear(), tx.date.getMonth(), 1) }
      }

      if (tx.creditAccount === "income") {
        acc[monthYear].income += tx.amount
      }
      if (tx.debitAccount === "expenses") {
        acc[monthYear].expenses += tx.amount
      }

      return acc
    },
    {} as Record<string, { income: number; expenses: number; date: Date }>,
  )

  // Convert to array and sort by date
  const monthlyData = Object.values(transactionsByMonth).sort((a, b) => a.date.getTime() - b.date.getTime())

  // Group transactions by day for detailed trend analysis
  const transactionsByDay = nonDraftTransactions.reduce(
    (acc, tx) => {
      const dayKey = tx.date.toISOString().split("T")[0]
      if (!acc[dayKey]) {
        acc[dayKey] = {
          income: 0,
          expenses: 0,
          date: new Date(tx.date.getFullYear(), tx.date.getMonth(), tx.date.getDate()),
          netWorth: 0,
          cashFlow: 0,
        }
      }

      if (tx.creditAccount === "income") {
        acc[dayKey].income += tx.amount
      }
      if (tx.debitAccount === "expenses") {
        acc[dayKey].expenses += tx.amount
      }

      return acc
    },
    {} as Record<string, { income: number; expenses: number; date: Date; netWorth: number; cashFlow: number }>,
  )

  // Convert to array and sort by date
  let dailyData = Object.values(transactionsByDay).sort((a, b) => a.date.getTime() - b.date.getTime())

  // Calculate running totals for net worth and cash flow
  let runningNetWorth = 0
  let runningCashFlow = 0

  dailyData = dailyData.map((day) => {
    runningCashFlow += day.income - day.expenses
    // A simplified calculation for demonstration
    runningNetWorth += day.income - day.expenses

    return {
      ...day,
      netWorth: runningNetWorth,
      cashFlow: runningCashFlow,
    }
  })

  return {
    totalIncome,
    totalExpenses,
    profitMargin,
    netWorth,
    cashFlow,
    avgTransactionValue,
    accountBalances,
    monthlyData,
    dailyData,
    lastTransactionHash:
      nonDraftTransactions.length > 0
        ? nonDraftTransactions.sort((a, b) => b.date.getTime() - a.date.getTime())[0].hash
        : "",
  }
}

