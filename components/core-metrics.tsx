"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Percent } from "lucide-react";
import { useTransactions } from "@/contexts/transaction-context";
import { appendTxs, readSums } from "@/app/actions";

export function CoreMetrics({ className }: { className?: string }) {
  const { transactions } = useTransactions();

  // Calculate metrics based on actual transaction data
  const nonDraftTransactions = transactions.filter((tx) => !tx.draft);

  // Total Income (sum of all transactions where creditAccount is "income")
  const totalIncome = nonDraftTransactions
    .filter((tx) => tx.creditAccount === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Total Expenses (sum of all transactions where debitAccount is "expenses")
  const totalExpenses = nonDraftTransactions
    .filter((tx) => tx.debitAccount === "expenses")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Profit Margin
  const profitMargin =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Function to switch to Reports tab
  const handleMoreClick = async () => {
    // Find the tabs element and set its value to "reports"
    const tabsElement = document.querySelector(
      '[data-radix-collection-item][data-state="inactive"][value="reports"]',
    ) as HTMLElement;

    if (tabsElement) {
      tabsElement.click();
    }

    // TEMP
    console.log(await appendTxs(transactions));

    const sums = await readSums();
    console.log(sums);
  };

  const metrics = [
    {
      title: "Total Income",
      value: `$${totalIncome.toLocaleString()}`,
      icon: DollarSign,
      description: "All time revenue",
      trend: "up",
      color: "text-green-500",
    },
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toLocaleString()}`,
      icon: DollarSign,
      description: "All time costs",
      trend: "up",
      color: "text-red-500",
    },
    {
      title: "Profit Margin",
      value: `${profitMargin.toFixed(1)}%`,
      icon: Percent,
      description: "Income vs expenses",
      trend: "up",
      color: profitMargin >= 0 ? "text-green-500" : "text-red-500",
    },
  ];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Core Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.title} className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-primary/10">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{metric.title}</p>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
              <div className={`text-lg font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={handleMoreClick}
          >
            More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
