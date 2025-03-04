"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportsTab } from "@/components/analytics/reports-tab"
import { DashboardContent } from "@/components/dashboard-content"
import { BusinessMetricsAnalytics } from "@/components/analytics/business-metrics-analytics"

export default function AnalyticsPage() {
  return (
    <div className="flex-1">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Insights</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardContent />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <BusinessMetricsAnalytics />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

