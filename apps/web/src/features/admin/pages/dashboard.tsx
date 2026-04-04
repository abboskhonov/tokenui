import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileCode, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useAdminStats } from "../queries";
import { Link } from "@tanstack/react-router";

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      description: "Registered users",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Total Designs",
      value: stats?.totalDesigns ?? 0,
      description: "All submissions",
      icon: FileCode,
      href: "/admin/designs",
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const content = (
            <Card className={stat.highlight ? "border-amber-500/50" : "hover:bg-muted/50 transition-colors cursor-pointer"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );

          if (stat.href) {
            return (
              <Link key={stat.title} to={stat.href}>
                {content}
              </Link>
            );
          }

          return <div key={stat.title}>{content}</div>;
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/review">
              <button className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                <p className="font-medium text-sm">Review Pending Designs</p>
                <p className="text-xs text-muted-foreground">{stats?.pendingReview ?? 0} items waiting</p>
              </button>
            </Link>
            <Link to="/admin/users">
              <button className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                <p className="font-medium text-sm">View All Users</p>
                <p className="text-xs text-muted-foreground">Manage user accounts</p>
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
