import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Shield, Lock } from "lucide-react";

export function AdminSettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings and moderation preferences
        </p>
      </div>

      {/* Moderation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Moderation Settings
          </CardTitle>
          <CardDescription>
            Control how designs are reviewed and published
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-approval">Require approval for new designs</Label>
              <p className="text-sm text-muted-foreground">
                All submissions must be reviewed before going public
              </p>
            </div>
            <Switch id="require-approval" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-approve-trusted">Auto-approve trusted users</Label>
              <p className="text-sm text-muted-foreground">
                Users with 5+ approved designs bypass review queue
              </p>
            </div>
            <Switch id="auto-approve-trusted" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notify-email">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new designs are submitted
              </p>
            </div>
            <Switch id="notify-email" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Control access and security policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="restrict-signups">Restrict signups</Label>
              <p className="text-sm text-muted-foreground">
                Require invitation or approval for new accounts
              </p>
            </div>
            <Switch id="restrict-signups" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="audit-logging">Enable audit logging</Label>
              <p className="text-sm text-muted-foreground">
                Log all admin actions for security review
              </p>
            </div>
            <Switch id="audit-logging" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card className="border-amber-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5" />
            Admin Access Only
          </CardTitle>
          <CardDescription>
            These settings affect the entire platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Warning:</strong> Changes to moderation and security settings 
              affect all users. Use caution when modifying these settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
