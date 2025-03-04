"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, CheckCircle } from "lucide-react";
import { useTransactions } from "@/contexts/transaction-context";
import { getFinancialMetrics } from "@/lib/utils";

const reportTypes = [
  "Financial Summary",
  "Income Analysis",
  "Expense Analysis",
  "Cash Flow",
  "Balance Sheet",
  "Transaction Analysis",
];

export function ReportsTab() {
  const [selectedReport, setSelectedReport] = useState(reportTypes[0]);
  const [isCopied, setIsCopied] = useState(false);
  const { transactions } = useTransactions();
  const metrics = getFinancialMetrics(transactions);

  // Generate report data based on actual transactions
  const reportData = {
    "Financial Summary": [
      {
        id: 1,
        metric: "Total Income",
        value: `$${metrics.totalIncome.toLocaleString()}`,
      },
      {
        id: 2,
        metric: "Total Expenses",
        value: `$${metrics.totalExpenses.toLocaleString()}`,
      },
      {
        id: 3,
        metric: "Net Profit",
        value: `$${(metrics.totalIncome - metrics.totalExpenses).toLocaleString()}`,
      },
      {
        id: 4,
        metric: "Profit Margin",
        value: `${metrics.profitMargin.toFixed(2)}%`,
      },
      {
        id: 5,
        metric: "Net Worth",
        value: `$${metrics.netWorth.toLocaleString()}`,
      },
    ],
    "Income Analysis": [
      {
        id: 1,
        metric: "Total Income",
        value: `$${metrics.totalIncome.toLocaleString()}`,
      },
      {
        id: 2,
        metric: "Income from Services",
        value: `$${metrics.totalIncome.toLocaleString()}`,
      }, // Simplified
      {
        id: 3,
        metric: "Average Income per Transaction",
        value: `$${(metrics.totalIncome / (transactions.filter((tx) => tx.creditAccount === "income").length || 1)).toLocaleString()}`,
      },
      {
        id: 4,
        metric: "Largest Income Transaction",
        value: `$${Math.max(...transactions.filter((tx) => tx.creditAccount === "income").map((tx) => tx.amount), 0).toLocaleString()}`,
      },
      { id: 5, metric: "Income Growth Rate", value: "N/A" }, // Would need historical data
    ],
    "Expense Analysis": [
      {
        id: 1,
        metric: "Total Expenses",
        value: `$${metrics.totalExpenses.toLocaleString()}`,
      },
      { id: 2, metric: "Largest Expense Category", value: "Operations" }, // Simplified
      {
        id: 3,
        metric: "Average Expense per Transaction",
        value: `$${(metrics.totalExpenses / (transactions.filter((tx) => tx.debitAccount === "expenses").length || 1)).toLocaleString()}`,
      },
      {
        id: 4,
        metric: "Largest Expense Transaction",
        value: `$${Math.max(...transactions.filter((tx) => tx.debitAccount === "expenses").map((tx) => tx.amount), 0).toLocaleString()}`,
      },
      {
        id: 5,
        metric: "Expense to Income Ratio",
        value: `${((metrics.totalExpenses / metrics.totalIncome) * 100).toFixed(2)}%`,
      },
    ],
    "Cash Flow": [
      {
        id: 1,
        metric: "Net Cash Flow",
        value: `$${metrics.cashFlow.toLocaleString()}`,
      },
      {
        id: 2,
        metric: "Operating Cash Flow",
        value: `$${(metrics.totalIncome - metrics.totalExpenses).toLocaleString()}`,
      },
      {
        id: 3,
        metric: "Cash Flow to Income Ratio",
        value: `${((metrics.cashFlow / metrics.totalIncome) * 100).toFixed(2)}%`,
      },
      {
        id: 4,
        metric: "Cash Flow Trend",
        value: metrics.cashFlow > 0 ? "Positive" : "Negative",
      },
      {
        id: 5,
        metric: "Cash Reserves",
        value: `$${Math.max(metrics.accountBalances.assets, 0).toLocaleString()}`,
      },
    ],
    "Balance Sheet": [
      {
        id: 1,
        metric: "Total Assets",
        value: `$${Math.abs(metrics.accountBalances.assets).toLocaleString()}`,
      },
      {
        id: 2,
        metric: "Total Liabilities",
        value: `$${Math.abs(metrics.accountBalances.liabilities).toLocaleString()}`,
      },
      {
        id: 3,
        metric: "Net Worth",
        value: `$${metrics.netWorth.toLocaleString()}`,
      },
      {
        id: 4,
        metric: "Debt to Asset Ratio",
        value: `${((Math.abs(metrics.accountBalances.liabilities) / Math.abs(metrics.accountBalances.assets)) * 100).toFixed(2)}%`,
      },
      { id: 5, metric: "Asset Growth", value: "N/A" }, // Would need historical data
    ],
    "Transaction Analysis": [
      {
        id: 1,
        metric: "Total Transactions",
        value: transactions.filter((tx) => !tx.draft).length.toString(),
      },
      {
        id: 2,
        metric: "Average Transaction Value",
        value: `$${metrics.avgTransactionValue.toLocaleString()}`,
      },
      {
        id: 3,
        metric: "Income Transactions",
        value: transactions
          .filter((tx) => !tx.draft && tx.creditAccount === "income")
          .length.toString(),
      },
      {
        id: 4,
        metric: "Expense Transactions",
        value: transactions
          .filter((tx) => !tx.draft && tx.debitAccount === "expenses")
          .length.toString(),
      },
      {
        id: 5,
        metric: "Transaction Authenticity",
        value: metrics.lastTransactionHash ? "Verified" : "N/A",
      },
    ],
  };

  const handleShare = () => {
    // Create the URL to copy
    const reportUrl = `${window.location.origin}/live-report`;

    // Copy to clipboard
    navigator.clipboard.writeText(reportUrl).then(() => {
      setIsCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {selectedReport} Report
          </CardTitle>
          <div className="flex space-x-2">
            <select
              className="px-2 py-1 border rounded-md text-sm"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={handleShare}>
              {isCopied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Share
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData[selectedReport]?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.metric}</TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
