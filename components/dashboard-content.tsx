import { AccountsOverview } from "@/components/accounts-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { CoreMetrics } from "@/components/core-metrics"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col">
          <AccountsOverview className="flex-1" />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <RecentTransactions className="flex-1" />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <CoreMetrics className="flex-1" />
        </div>
      </div>
    </div>
  )
}

