"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TransactionForm } from "@/components/transaction-form"
import { useTransactions } from "@/contexts/transaction-context"
import type { Transaction } from "@/lib/utils"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
  mode: "create" | "edit"
}

export function TransactionDialog({ open, onOpenChange, transaction, mode }: TransactionDialogProps) {
  const { addTransaction, updateTransaction } = useTransactions()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: Omit<Transaction, "id">) => {
    setIsSubmitting(true)
    try {
      if (mode === "create") {
        addTransaction(values)
      } else if (mode === "edit" && transaction) {
        updateTransaction({ ...values, id: transaction.id })
      }
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create" : "Edit"} Transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm transaction={transaction} onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

