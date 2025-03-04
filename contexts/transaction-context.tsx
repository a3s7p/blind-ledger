"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { type Transaction, generateId, computeTransactionHash } from "@/lib/utils"

// Sample transactions for demonstration
const sampleTransactions: Omit<Transaction, "hash" | "previousHash">[] = [
  {
    id: "tx1",
    date: new Date(2023, 6, 15),
    partner: "Office Supplies Co.",
    description: "Monthly office supplies",
    currency: "USD",
    amount: 250.75,
    debitAccount: "expenses",
    creditAccount: "assets",
    draft: false,
  },
  {
    id: "tx2",
    date: new Date(2023, 6, 10),
    partner: "Client XYZ",
    description: "Consulting services",
    currency: "USD",
    amount: 1500.0,
    debitAccount: "assets",
    creditAccount: "income",
    draft: false,
  },
  {
    id: "tx3",
    date: new Date(2023, 6, 5),
    partner: "Rent LLC",
    description: "Office rent payment",
    currency: "USD",
    amount: 2000.0,
    debitAccount: "expenses",
    creditAccount: "assets",
    draft: false,
  },
  {
    id: "tx4",
    date: new Date(2023, 6, 1),
    partner: "Insurance Provider",
    description: "Monthly insurance premium",
    currency: "USD",
    amount: 350.5,
    debitAccount: "expenses",
    creditAccount: "assets",
    draft: false,
  },
  {
    id: "tx5",
    date: new Date(2023, 5, 28),
    partner: "Client ABC",
    description: "Project payment",
    currency: "EUR",
    amount: 3000.0,
    debitAccount: "assets",
    creditAccount: "income",
    draft: false,
  },
  {
    id: "tx6",
    date: new Date(2023, 5, 25),
    partner: "Utility Company",
    description: "Electricity bill",
    currency: "USD",
    amount: 175.25,
    debitAccount: "expenses",
    creditAccount: "assets",
    draft: true,
  },
  {
    id: "tx7",
    date: new Date(2023, 5, 20),
    partner: "Marketing Agency",
    description: "Social media campaign",
    currency: "USD",
    amount: 750.0,
    debitAccount: "expenses",
    creditAccount: "assets",
    draft: false,
  },
  {
    id: "tx8",
    date: new Date(2023, 5, 15),
    partner: "Bank",
    description: "Loan payment",
    currency: "USD",
    amount: 1200.0,
    debitAccount: "liabilities",
    creditAccount: "assets",
    draft: false,
  },
  {
    id: "tx9",
    date: new Date(2023, 5, 10),
    partner: "Client DEF",
    description: "Monthly retainer",
    currency: "USD",
    amount: 2500.0,
    debitAccount: "assets",
    creditAccount: "income",
    draft: false,
  },
  {
    id: "tx10",
    date: new Date(2023, 5, 5),
    partner: "Software Vendor",
    description: "Annual subscription",
    currency: "USD",
    amount: 599.99,
    debitAccount: "expenses",
    creditAccount: "assets",
    draft: false,
  },
  {
    id: "tx11",
    date: new Date(2023, 4, 30),
    partner: "Contractor",
    description: "Website development",
    currency: "USD",
    amount: 1800.0,
    debitAccount: "expenses",
    creditAccount: "assets",
    draft: false,
  },
  {
    id: "tx12",
    date: new Date(2023, 4, 25),
    partner: "Client GHI",
    description: "Project milestone payment",
    currency: "EUR",
    amount: 5000.0,
    debitAccount: "assets",
    creditAccount: "income",
    draft: false,
  },
]

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "hash" | "previousHash">) => void
  updateTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
  getTransaction: (id: string) => Transaction | undefined
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Function to compute hashes for all transactions
  const computeTransactionHashes = useCallback((txs: Transaction[]): Transaction[] => {
    // Sort transactions by date (oldest first)
    const sortedTxs = [...txs].sort((a, b) => a.date.getTime() - b.date.getTime())

    // Compute hashes
    let previousHash = ""
    return sortedTxs.map((tx) => {
      // Create a copy without hash and previousHash
      const { hash, previousHash: prevHash, ...txWithoutHash } = tx

      // Set the previous hash
      const txWithPrevHash = { ...txWithoutHash, previousHash }

      // Compute the hash
      const newHash = computeTransactionHash(txWithPrevHash)

      // Update previousHash for next transaction
      previousHash = newHash

      // Return transaction with hash and previousHash
      return { ...txWithPrevHash, hash: newHash, previousHash: txWithPrevHash.previousHash }
    })
  }, [])

  // Initialize with sample data or load from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions")
    if (savedTransactions) {
      // Parse the JSON and convert date strings back to Date objects
      const parsedTransactions = JSON.parse(savedTransactions).map((tx: any) => ({
        ...tx,
        date: new Date(tx.date),
      }))

      // Compute hashes for loaded transactions
      const txsWithHashes = computeTransactionHashes(parsedTransactions)
      setTransactions(txsWithHashes)
    } else {
      // Use sample data for demonstration and compute hashes
      const txsWithHashes = computeTransactionHashes(sampleTransactions as Transaction[])
      setTransactions(txsWithHashes)
    }
  }, [computeTransactionHashes])

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  const addTransaction = (transaction: Omit<Transaction, "id" | "hash" | "previousHash">) => {
    setTransactions((prev) => {
      // Sort existing transactions by date (newest first)
      const sortedPrev = [...prev].sort((a, b) => b.date.getTime() - a.date.getTime())

      // Get the hash of the most recent transaction
      const previousHash = sortedPrev.length > 0 ? sortedPrev[0].hash : ""

      // Create new transaction with ID and previousHash
      const newTransaction = {
        ...transaction,
        id: generateId(),
        previousHash,
      }

      // Compute hash for the new transaction
      const hash = computeTransactionHash(newTransaction)

      // Add hash to the transaction
      const completeTransaction = { ...newTransaction, hash }

      // Return updated transactions array
      return [completeTransaction, ...prev]
    })
  }

  const updateTransaction = (transaction: Transaction) => {
    setTransactions((prev) => {
      // Find the index of the transaction to update
      const index = prev.findIndex((tx) => tx.id === transaction.id)

      if (index === -1) return prev

      // Create a new array with the updated transaction
      const updatedTransactions = [...prev]
      updatedTransactions[index] = transaction

      // Recompute hashes for all transactions
      return computeTransactionHashes(updatedTransactions)
    })
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => {
      // Filter out the transaction to delete
      const filteredTransactions = prev.filter((tx) => tx.id !== id)

      // Recompute hashes for all transactions
      return computeTransactionHashes(filteredTransactions)
    })
  }

  const getTransaction = (id: string) => {
    return transactions.find((tx) => tx.id === id)
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}

