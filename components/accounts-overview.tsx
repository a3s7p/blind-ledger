"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddMoneyModal } from "./add-money-modal"
import { SendMoneyModal } from "./send-money-modal"
import { RequestMoneyModal } from "./request-money-modal"
import { cn } from "@/lib/utils"
import { useTransactions } from "@/contexts/transaction-context"
import { accountTypes } from "@/lib/utils"

interface AccountsOverviewProps {
  className?: string
}

export function AccountsOverview({ className }: AccountsOverviewProps) {
  const { transactions } = useTransactions()
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false)
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false)
  const [isRequestMoneyModalOpen, setIsRequestMoneyModalOpen] = useState(false)

  // Calculate account balances based on actual transactions
  const accountBalances = accountTypes.reduce((acc, accountType) => {
    const balance = transactions.reduce((sum, transaction) => {
      if (transaction.draft) return sum // Skip draft transactions

      let change = 0
      // If this account is debited, add the amount
      if (transaction.debitAccount === accountType.id) {
        change += transaction.amount
      }
      // If this account is credited, subtract the amount
      if (transaction.creditAccount === accountType.id) {
        change -= transaction.amount
      }
      return sum + change
    }, 0)

    return { ...acc, [accountType.id]: balance }
  }, {})

  const totalBalance = Object.values(accountBalances).reduce((sum: number, balance: number) => sum + balance, 0)

  const handleAddMoney = (amount) => {
    // This would be handled by the transaction context in a real app
    console.log(`Adding ${amount} to account`)
  }

  const handleSendMoney = (amount, fromAccount) => {
    // This would be handled by the transaction context in a real app
    console.log(`Sending ${amount} from ${fromAccount}`)
  }

  const handleRequestMoney = (amount, contact) => {
    console.log(`Requested $${amount} from ${contact.name}`)
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Accounts Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${Math.abs(totalBalance).toLocaleString()}</div>
        <div className="mt-4 space-y-2">
          {accountTypes.map((account) => (
            <div key={account.id} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{account.name}</span>
              <span className="text-sm font-medium">${Math.abs(accountBalances[account.id]).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
        onAddMoney={handleAddMoney}
      />
      <SendMoneyModal
        isOpen={isSendMoneyModalOpen}
        onClose={() => setIsSendMoneyModalOpen(false)}
        onSendMoney={handleSendMoney}
        accounts={accountTypes.map((a) => ({ name: a.name, balance: accountBalances[a.id] }))}
      />
      <RequestMoneyModal
        isOpen={isRequestMoneyModalOpen}
        onClose={() => setIsRequestMoneyModalOpen(false)}
        onRequestMoney={handleRequestMoney}
      />
    </Card>
  )
}

