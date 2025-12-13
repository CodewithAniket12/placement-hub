import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <SettingsIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account preferences and configurations
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Profile</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Aniket" className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="aniket@university.edu" className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Coordinator" disabled className="rounded-xl bg-muted" />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-card-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive email updates about your companies</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-card-foreground">Registration Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when companies submit forms</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-card-foreground">Weekly Summary</p>
              <p className="text-sm text-muted-foreground">Receive a weekly report of activities</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" className="rounded-xl" />
          </div>
          <Button className="rounded-xl">Update Password</Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="rounded-xl px-8" size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
