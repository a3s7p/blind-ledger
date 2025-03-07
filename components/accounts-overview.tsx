"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/contexts/transaction-context";
import { accountTypes } from "@/lib/utils";

interface AccountsOverviewProps {
  className?: string;
}

export function AccountsOverview({ className }: AccountsOverviewProps) {
  const { transactions } = useTransactions();

  // Calculate account balances based on actual transactions
  const accountBalances = accountTypes.reduce((acc, accountType) => {
    const balance = transactions.reduce((sum, transaction) => {
      if (transaction.draft) return sum; // Skip draft transactions
      let change = 0;

      // If this account is debited, add the amount
      if (transaction.debitAccount === accountType.id) {
        change += transaction.amount;
      }
      // If this account is credited, subtract the amount
      if (transaction.creditAccount === accountType.id) {
        change -= transaction.amount;
      }
      return sum + change;
    }, 0);

    return { ...acc, [accountType.id]: balance };
  }, {});

  const totalBalance = Object.values(accountBalances).reduce(
    (sum, balance) => Number(sum) + Number(balance),
    0,
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Accounts Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${Math.abs(Number(totalBalance)).toLocaleString()}
        </div>
        <div className="mt-4 space-y-2">
          {accountTypes.map((account) => (
            <div key={account.id} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {account.name}
              </span>
              <span className="text-sm font-medium">
                $
                {Math.abs(Number(accountBalances[account.id])).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
