import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileCode, 
  Clock, 
  CheckCircle,
  Loader2,
  Download,
  Eye,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useAdminStats, useSummaryAnalytics, useCliAnalytics, useViewAnalytics, useTopDesigns } from "../queries";
import { Link } from "@tanstack/react-router";

function AnalyticsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  href,
  highlight,
  trend,
}: { 
  title: string
  value: number
  description: string
  icon: React.ElementType
  href?: string
  highlight?: boolean
  trend?: number
}) {
  const content = (
    <Card className={highlight ? "border-amber-500/50" : "hover:bg-muted/50 transition-colors cursor-pointer"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
          {trend !== undefined && trend !== 0 && (
            <span className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend} today
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link to={href}>
        {content}
      </Link>
    );
  }

  return content;
}

function MiniChart({ data, color = "bg-primary" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((value, i) => {
        const height = ((value - min) / range) * 100;
        return (
          <div
            key={i}
            className={`w-3 ${color} rounded-t`}
            style={{ height: `${Math.max(height, 10)}%` }}
          />
        );
      })}
    </div>
  );
}

export function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: summary, isLoading: summaryLoading } = useSummaryAnalytics();
  const { data: cliAnalytics, isLoading: cliLoading } = useCliAnalytics();
  const { data: viewAnalytics, isLoading: viewsLoading } = useViewAnalytics();
  const { data: topDesigns, isLoading: topDesignsLoading } = useTopDesigns(5);

  const isLoading = statsLoading || summaryLoading || cliLoading || viewsLoading || topDesignsLoading;

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      description: "Registered users",
      icon: Users,
      href: "/admin/users",
      trend: summary?.newUsersToday,
    },
    {
      title: "Total Designs",
      value: stats?.totalDesigns ?? 0,
      description: "All submissions",
      icon: FileCode,
      href: "/admin/designs",
    },
    {
      title: "CLI Installs",
      value: summary?.totalCliInstalls ?? 0,
      description: "Total installations",
      icon: Download,
      trend: summary?.installsToday,
    },
    {
      title: "Total Views",
      value: summary?.totalViews ?? 0,
      description: "Design page views",
      icon: Eye,
      trend: summary?.viewsToday,
    },
    {
      title: "Pending Review",
      value: stats?.pendingReview ?? 0,
      description: "Needs your attention",
      icon: Clock,
      href: "/admin/review",
      highlight: true,
    },
    {
      title: "Approved Today",
      value: stats?.approvedToday ?? 0,
      description: "Published designs",
      icon: CheckCircle,
    },
  ];

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
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <AnalyticsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* CLI Installs Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4" />
              CLI Installs (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold">{cliAnalytics?.totalInstalls.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {cliAnalytics?.uniqueInstalls.toLocaleString()} unique machines
                </p>
              </div>
              {cliAnalytics?.dailyInstalls && (
                <MiniChart data={cliAnalytics.dailyInstalls} color="bg-blue-500" />
              )}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>Last 7 days: {cliAnalytics?.dailyInstalls.reduce((a, b) => a + b, 0).toLocaleString()}</span>
              <span>Avg: {Math.round((cliAnalytics?.dailyInstalls.reduce((a, b) => a + b, 0) || 0) / 7).toLocaleString()}/day</span>
            </div>
          </CardContent>
        </Card>

        {/* Views Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" />
              Design Views (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold">{viewAnalytics?.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {viewAnalytics?.uniqueViewers.toLocaleString()} unique viewers
                </p>
              </div>
              {viewAnalytics?.dailyViews && (
                <MiniChart data={viewAnalytics.dailyViews} color="bg-green-500" />
              )}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>Last 7 days: {viewAnalytics?.dailyViews.reduce((a, b) => a + b, 0).toLocaleString()}</span>
              <span>Avg: {Math.round((viewAnalytics?.dailyViews.reduce((a, b) => a + b, 0) || 0) / 7).toLocaleString()}/day</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Designs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Top Viewed Designs
            </CardTitle>
            <CardDescription>
              Most popular designs by view count
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDesigns?.map((design, index) => (
              <Link 
                key={design.id} 
                to="/s/$username/$designSlug"
                params={{ username: design.author, designSlug: design.slug || design.id }}
              >
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{design.name}</p>
                    <p className="text-xs text-muted-foreground">@{design.author} · {design.category}</p>
                  </div>
                  <div className="text-sm font-medium tabular-nums">
                    {design.viewCount.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
            {!topDesigns?.length && (
              <p className="text-sm text-muted-foreground text-center py-4">No designs yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/review">
              <button className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Review Pending Designs</p>
                    <p className="text-xs text-muted-foreground">{stats?.pendingReview ?? 0} items waiting</p>
                  </div>
                  {stats?.pendingReview ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-medium text-white">
                      {stats.pendingReview}
                    </span>
                  ) : null}
                </div>
              </button>
            </Link>
            <Link to="/admin/users">
              <button className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                <p className="font-medium text-sm">View All Users</p>
                <p className="text-xs text-muted-foreground">
                  {summary?.newUsersToday ? `${summary.newUsersToday} new today` : 'Manage user accounts'}
                </p>
              </button>
            </Link>
            <Link to="/admin/designs">
              <button className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                <p className="font-medium text-sm">All Designs</p>
                <p className="text-xs text-muted-foreground">Manage all submissions</p>
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
