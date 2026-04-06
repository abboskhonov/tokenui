"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Download, 
  Eye, 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileCode,
  Terminal,
  Globe,
} from "lucide-react";
import { 
  useCliAnalytics, 
  useViewAnalytics, 
  useTopDesigns,
  useSummaryAnalytics,
} from "../queries";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";

// Bar chart component for daily data
function DailyBarChart({ data, labels, color = "bg-primary" }: { 
  data: number[]; 
  labels: string[];
  color?: string;
}) {
  const max = Math.max(...data, 1);
  
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-32">
        {data.map((value, i) => {
          const height = (value / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className={`w-full ${color} rounded-t transition-all`}
                style={{ height: `${Math.max(height, 4)}%` }}
                title={`${labels[i]}: ${value.toLocaleString()}`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        {labels.map((label, i) => (
          <span key={i} className="flex-1 text-center">{label}</span>
        ))}
      </div>
    </div>
  );
}

// Version breakdown chart
function VersionChart({ versions }: { versions: { version: string; count: number }[] }) {
  const total = versions.reduce((sum, v) => sum + Number(v.count), 0);
  const colors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-purple-500", "bg-pink-500"];
  
  return (
    <div className="space-y-3">
      {versions.slice(0, 5).map((v, i) => {
        const count = Number(v.count);
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={v.version} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{v.version || "unknown"}</span>
              <span className="text-muted-foreground">{count.toLocaleString()} ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className={`h-full ${colors[i % colors.length]} transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AdminAnalyticsPage() {
  const { data: summary, isLoading: summaryLoading } = useSummaryAnalytics();
  const { data: cliAnalytics, isLoading: cliLoading } = useCliAnalytics();
  const { data: viewAnalytics, isLoading: viewsLoading } = useViewAnalytics();
  const { data: topDesigns, isLoading: topDesignsLoading } = useTopDesigns(10);

  const isLoading = summaryLoading || cliLoading || viewsLoading || topDesignsLoading;

  // Generate day labels for the chart
  const dayLabels = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString("en-US", { weekday: "short" }));
    }
    return days;
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights into platform usage and growth.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{summary?.newUsersToday} new today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Designs</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalDesigns.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Submitted designs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CLI Installs</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalCliInstalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{summary?.installsToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{summary?.viewsToday} today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="cli" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cli" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            CLI Analytics
          </TabsTrigger>
          <TabsTrigger value="views" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            View Analytics
          </TabsTrigger>
          <TabsTrigger value="designs" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Top Designs
          </TabsTrigger>
        </TabsList>

        {/* CLI Analytics Tab */}
        <TabsContent value="cli" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Daily Installs (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cliAnalytics?.dailyInstalls && (
                  <DailyBarChart 
                    data={cliAnalytics.dailyInstalls} 
                    labels={dayLabels}
                    color="bg-blue-500"
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CLI Install Stats</CardTitle>
                <CardDescription>Overview of CLI installations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Installs</p>
                    <p className="text-2xl font-bold">{cliAnalytics?.totalInstalls.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Unique Machines</p>
                    <p className="text-2xl font-bold">{cliAnalytics?.uniqueInstalls.toLocaleString()}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Install Rate</p>
                  <p className="text-sm text-muted-foreground">
                    Avg {Math.round((cliAnalytics?.dailyInstalls.reduce((a, b) => a + b, 0) || 0) / 7).toLocaleString()} installs per day
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Version Breakdown</CardTitle>
              <CardDescription>CLI installations by version</CardDescription>
            </CardHeader>
            <CardContent>
              {cliAnalytics?.versionBreakdown && cliAnalytics.versionBreakdown.length > 0 ? (
                <VersionChart versions={cliAnalytics.versionBreakdown} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No version data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Views Analytics Tab */}
        <TabsContent value="views" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Daily Views (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewAnalytics?.dailyViews && (
                  <DailyBarChart 
                    data={viewAnalytics.dailyViews} 
                    labels={dayLabels}
                    color="bg-green-500"
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>View Stats</CardTitle>
                <CardDescription>Overview of design page views</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">{viewAnalytics?.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Unique Viewers</p>
                    <p className="text-2xl font-bold">{viewAnalytics?.uniqueViewers.toLocaleString()}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">View Rate</p>
                  <p className="text-sm text-muted-foreground">
                    Avg {Math.round((viewAnalytics?.dailyViews.reduce((a, b) => a + b, 0) || 0) / 7).toLocaleString()} views per day
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Designs Tab */}
        <TabsContent value="designs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Most Viewed Designs
              </CardTitle>
              <CardDescription>
                Designs with the highest view counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topDesigns?.map((design, index) => (
                  <Link 
                    key={design.id}
                    to="/s/$username/$designSlug"
                    params={{ username: design.author, designSlug: design.slug || design.id }}
                  >
                    <div className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors group">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted shrink-0">
                        {design.thumbnailUrl ? (
                          <img 
                            src={design.thumbnailUrl} 
                            alt={design.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            {design.category.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{design.name}</p>
                        <p className="text-sm text-muted-foreground">
                          @{design.author} · {design.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium tabular-nums">{design.viewCount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">views</p>
                      </div>
                    </div>
                  </Link>
                ))}
                {!topDesigns?.length && (
                  <p className="text-sm text-muted-foreground text-center py-8">No designs yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
