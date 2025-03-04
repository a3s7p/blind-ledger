import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Help & Documentation</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Understanding Double-Entry Bookkeeping</CardTitle>
          <CardDescription>The foundation of modern accounting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Double-entry bookkeeping is an accounting system where every financial transaction has equal and opposite
            effects in at least two different accounts. This system ensures that the accounting equation (Assets =
            Liabilities + Equity) always remains balanced.
          </p>
          <p>For example, when you make a sale:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You debit an asset account (like Cash or Accounts Receivable) to show an increase in assets</li>
            <li>You credit an income account to show an increase in revenue</li>
          </ul>
          <p>Similarly, when you pay an expense:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You debit an expense account to record the expense</li>
            <li>You credit an asset account (like Cash) to show the decrease in assets</li>
          </ul>
          <p>
            This system provides a built-in error checking mechanism and gives a complete picture of your financial
            situation.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Privacy in Accounting</CardTitle>
          <CardDescription>Protecting your financial data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Keeping your accounting data private is crucial for several reasons:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>It protects sensitive business information from competitors</li>
            <li>It safeguards personal financial details</li>
            <li>It prevents unauthorized access that could lead to fraud or identity theft</li>
            <li>It maintains confidentiality of client and vendor relationships</li>
          </ul>
          <p>
            At the same time, businesses need to maintain transparency with stakeholders and comply with regulatory
            requirements. Finding the right balance between privacy and disclosure is essential.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>The Importance of Sharing Business Metrics</CardTitle>
          <CardDescription>Building trust through transparency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            While privacy is important, selectively sharing business metrics with partners and stakeholders offers
            significant benefits:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Builds trust with investors, clients, and partners</li>
            <li>Demonstrates financial stability and business health</li>
            <li>Facilitates better collaboration and informed decision-making</li>
            <li>Attracts potential investors and business opportunities</li>
            <li>Shows commitment to transparency and accountability</li>
          </ul>
          <p>
            The key is to share meaningful metrics that provide insight without compromising sensitive details or
            competitive advantages.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Blind Ledger: Our Solution</CardTitle>
          <CardDescription>Balancing privacy and transparency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Blind Ledger provides a solution to the privacy-transparency conundrum by:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Keeping your detailed transaction data private and secure</li>
            <li>Providing tools to generate aggregated business metrics that can be safely shared</li>
            <li>Allowing you to control exactly what information is disclosed and to whom</li>
            <li>Maintaining the integrity of your financial data through double-entry bookkeeping</li>
            <li>Offering analytics that help you understand your business without exposing raw data</li>
          </ul>
          <p>
            Our platform gives you the best of both worlds: the privacy you need and the transparency that builds trust.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Your first steps with Blind Ledger</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>To begin using Blind Ledger for your accounting needs:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Create a transaction:</strong> Navigate to the Transactions page and click "New Transaction." Fill
              in the required details, including date, partner, amount, and the appropriate debit and credit accounts.
            </li>
            <li>
              <strong>Understand account types:</strong>
              <ul className="list-disc pl-6 space-y-1 mt-1">
                <li>
                  <strong>Assets:</strong> Resources owned by your business (cash, inventory, equipment)
                </li>
                <li>
                  <strong>Liabilities:</strong> What your business owes to others (loans, accounts payable)
                </li>
                <li>
                  <strong>Income:</strong> Revenue generated by your business activities
                </li>
                <li>
                  <strong>Expenses:</strong> Costs incurred in running your business
                </li>
              </ul>
            </li>
            <li>
              <strong>Check your analytics:</strong> After recording transactions, visit the Analytics page to see how
              they affect your financial position and performance metrics.
            </li>
            <li>
              <strong>Use draft mode:</strong> For transactions you're not ready to finalize, use the draft option.
              These won't affect your analytics until you're ready.
            </li>
            <li>
              <strong>Review regularly:</strong> Make it a habit to review your transactions and analytics regularly to
              stay on top of your financial situation.
            </li>
          </ol>
          <p className="mt-4">
            Remember, consistent and accurate record-keeping is the foundation of good financial management. Blind
            Ledger makes this process straightforward while protecting your sensitive financial data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

