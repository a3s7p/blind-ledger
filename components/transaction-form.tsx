"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { cn, accountTypes, currencyOptions } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea"
import type { Transaction } from "@/lib/utils"

const formSchema = z.object({
  date: z.date({
    required_error: "A date is required",
  }),
  partner: z.string().min(1, { message: "Partner is required" }),
  description: z.string().optional(),
  currency: z.enum(["USD", "EUR"]),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be positive" })
    .min(0.01, { message: "Amount must be at least 0.01" }),
  debitAccount: z.enum(["assets", "income", "liabilities", "expenses"], {
    required_error: "Please select a debit account",
  }),
  creditAccount: z.enum(["assets", "income", "liabilities", "expenses"], {
    required_error: "Please select a credit account",
  }),
  receipt: z.any().optional(),
  draft: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface TransactionFormProps {
  transaction?: Transaction
  onSubmit: (values: FormValues) => void
  onCancel: () => void
}

export function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  // Ensure all form values have defined initial values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: transaction?.date || new Date(),
      partner: transaction?.partner || "",
      description: transaction?.description || "",
      currency: transaction?.currency || "USD",
      amount: transaction?.amount || 0,
      debitAccount: transaction?.debitAccount || "expenses",
      creditAccount: transaction?.creditAccount || "assets",
      draft: transaction?.draft !== undefined ? transaction.draft : true,
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setReceiptFile(file)

      // Log file metadata
      console.log("Receipt file metadata:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        lastModified: new Date(file.lastModified).toISOString(),
      })
    }
  }

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      // Add receipt file to values if available
      if (receiptFile) {
        values.receipt = receiptFile
      }

      // Log the transaction contents
      console.log("Transaction submitted:", values)

      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Partner Field */}
          <FormField
            control={form.control}
            name="partner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner</FormLabel>
                <FormControl>
                  <Input placeholder="Enter partner name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter transaction description (optional)" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Currency Field */}
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Currency</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? currencyOptions.find((currency) => currency.id === field.value)?.symbol +
                            " " +
                            currencyOptions.find((currency) => currency.id === field.value)?.name
                          : "Select currency"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search currency..." />
                      <CommandList>
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                          {currencyOptions.map((currency) => (
                            <CommandItem
                              key={currency.id}
                              value={currency.id}
                              onSelect={() => {
                                form.setValue("currency", currency.id as "USD" | "EUR")
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  currency.id === field.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {currency.symbol} {currency.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount Field */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Enter amount"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value === "" ? "0" : e.target.value
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Debit Account Field */}
          <FormField
            control={form.control}
            name="debitAccount"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Debit Account</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? `${accountTypes.find((account) => account.id === field.value)?.number} - ${
                              accountTypes.find((account) => account.id === field.value)?.name
                            }`
                          : "Select debit account"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search account..." />
                      <CommandList>
                        <CommandEmpty>No account found.</CommandEmpty>
                        <CommandGroup>
                          {accountTypes.map((account) => (
                            <CommandItem
                              key={account.id}
                              value={account.id}
                              onSelect={() => {
                                form.setValue("debitAccount", account.id as any)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", account.id === field.value ? "opacity-100" : "opacity-0")}
                              />
                              {account.number} - {account.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Credit Account Field */}
          <FormField
            control={form.control}
            name="creditAccount"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Credit Account</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? `${accountTypes.find((account) => account.id === field.value)?.number} - ${
                              accountTypes.find((account) => account.id === field.value)?.name
                            }`
                          : "Select credit account"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search account..." />
                      <CommandList>
                        <CommandEmpty>No account found.</CommandEmpty>
                        <CommandGroup>
                          {accountTypes.map((account) => (
                            <CommandItem
                              key={account.id}
                              value={account.id}
                              onSelect={() => {
                                form.setValue("creditAccount", account.id as any)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", account.id === field.value ? "opacity-100" : "opacity-0")}
                              />
                              {account.number} - {account.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Receipt Field */}
          <FormField
            control={form.control}
            name="receipt"
            render={() => (
              <FormItem className="md:col-span-2">
                <FormLabel>Receipt</FormLabel>
                <FormControl>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff" onChange={handleFileChange} />
                </FormControl>
                <FormDescription>Upload a receipt (PDF, JPG, PNG, or TIF)</FormDescription>
                {receiptFile && (
                  <div className="text-sm text-muted-foreground">
                    {receiptFile.name} ({(receiptFile.size / 1024).toFixed(2)} KB)
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Draft Field */}
          <FormField
            control={form.control}
            name="draft"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Draft</FormLabel>
                  <FormDescription>Draft transactions are not factored into analytics.</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {transaction ? "Update" : "Create"} Transaction
          </Button>
        </div>
      </form>
    </Form>
  )
}

