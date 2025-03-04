"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Search, Clipboard, Check } from "lucide-react"
import { useTransactions } from "@/contexts/transaction-context"
import { TransactionDialog } from "@/components/transaction-dialog"
import { TransactionDeleteDialog } from "@/components/transaction-delete-dialog"
import { formatCurrency, accountTypes, type Transaction } from "@/lib/utils"
import { toast } from "sonner"

export default function TransactionsPage() {
  const { transactions } = useTransactions()
  const [searchTerm, setSearchTerm] = useState("")
  const [accountFilter, setAccountFilter] = useState("all")
  const [currencyFilter, setCurrencyFilter] = useState("all")
  const [draftFilter, setDraftFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const itemsPerPage = 10

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesAccount =
      accountFilter === "all" ||
      transaction.debitAccount === accountFilter ||
      transaction.creditAccount === accountFilter

    const matchesCurrency = currencyFilter === "all" || transaction.currency === currencyFilter

    const matchesDraft =
      draftFilter === "all" ||
      (draftFilter === "draft" && transaction.draft) ||
      (draftFilter === "active" && !transaction.draft)

    return matchesSearch && matchesAccount && matchesCurrency && matchesDraft
  })

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Paginate transactions
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const paginatedTransactions = sortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setEditDialogOpen(true)
  }

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDeleteDialogOpen(true)
  }

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopiedHash(hash)
      toast.success("Hash copied to clipboard")

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedHash(null)
      }, 2000)
    })
  }

  const getAccountName = (accountId: string) => {
    const account = accountTypes.find((acc) => acc.id === accountId)
    return account ? `${account.number} - ${account.name}` : accountId
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={accountFilter} onValueChange={setAccountFilter} className="w-auto">
          <SelectTrigger className="w-auto min-w-[140px]">
            <SelectValue placeholder="Filter by account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accountTypes.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.number} - {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={currencyFilter} onValueChange={setCurrencyFilter} className="w-auto">
          <SelectTrigger className="w-auto min-w-[120px]">
            <SelectValue placeholder="Filter by currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Currencies</SelectItem>
            <SelectItem value="USD">$ USD</SelectItem>
            <SelectItem value="EUR">€ EUR</SelectItem>
          </SelectContent>
        </Select>
        <Select value={draftFilter} onValueChange={setDraftFilter} className="w-auto">
          <SelectTrigger className="w-auto min-w-[120px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New
        </Button>
      </div>

      {paginatedTransactions.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Debit Account</TableHead>
                <TableHead>Credit Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(transaction.date, "MMM d, yyyy")}</TableCell>
                  <TableCell>{transaction.partner}</TableCell>
                  <TableCell>{transaction.description || "-"}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount, transaction.currency)}</TableCell>
                  <TableCell>{getAccountName(transaction.debitAccount)}</TableCell>
                  <TableCell>{getAccountName(transaction.creditAccount)}</TableCell>
                  <TableCell>
                    {transaction.draft ? (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      >
                        Draft
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyHash(transaction.hash || "")}
                      className="mr-1"
                      title="Copy Hash"
                    >
                      {copiedHash === transaction.hash ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                      <span className="sr-only">Copy Hash</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)} className="mr-1">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">No transactions found.</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Transaction
            </Button>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <TransactionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} mode="create" />

      {selectedTransaction && (
        <>
          <TransactionDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            transaction={selectedTransaction}
            mode="edit"
          />
          <TransactionDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            transactionId={selectedTransaction.id}
          />
        </>
      )}
    </div>
  )
}

