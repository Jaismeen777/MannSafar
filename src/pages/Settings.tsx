import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Bell, Moon, Sun, Shield, Download, Upload, Trash2, AlertCircle, Globe, Smartphone, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export function Settings() {
    const { signOut } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState({
        dailyReminders: true,
        weeklyReports: true,
        moodAlerts: false,
        journalPrompts: true,
    });
    const [privacy, setPrivacy] = useState({
        dataSharing: false,
        analytics: true,
        publicProfile: false,
    });

    const handleSignOut = async () => {
        try {
            await signOut();
            toast({
                title: "Signed out successfully",
                description: "Come back soon for your wellness journey!",
            });
        } catch (error) {
            toast({
                title: "Error signing out",
                description: "Please try again",
                variant: "destructive",
            });
        }
    };

    const handleExportData = () => {
        toast({
            title: "Data export initiated",
            description: "You'll receive an email with your data within 24 hours.",
        });
    };

    const handleDeleteAccount = () => {
        toast({
            title: "Account deletion",
            description: "This feature is not available yet. Contact support for assistance.",
            variant: "destructive",
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4">
                <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
                    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/"> 
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold text-primary">Settings</h1>
                        </div>
                    </div>
                </header>
            <div className="max-w-4xl mx-auto space-y-6">
                <Separator />

                {/* Notifications */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Control how and when you receive notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Daily Wellness Reminders</Label>
                                <p className="text-sm text-muted-foreground">Get daily prompts for journaling and mood tracking</p>
                            </div>
                            <Switch
                                checked={notifications.dailyReminders}
                                onCheckedChange={(checked) =>
                                    setNotifications(prev => ({ ...prev, dailyReminders: checked }))
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Weekly Progress Reports</Label>
                                <p className="text-sm text-muted-foreground">Receive weekly insights about your wellness journey</p>
                            </div>
                            <Switch
                                checked={notifications.weeklyReports}
                                onCheckedChange={(checked) =>
                                    setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Mood Alert Notifications</Label>
                                <p className="text-sm text-muted-foreground">Get notified when patterns in your mood are detected</p>
                            </div>
                            <Switch
                                checked={notifications.moodAlerts}
                                onCheckedChange={(checked) =>
                                    setNotifications(prev => ({ ...prev, moodAlerts: checked }))
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Journal Writing Prompts</Label>
                                <p className="text-sm text-muted-foreground">Receive inspiring prompts for your journal entries</p>
                            </div>
                            <Switch
                                checked={notifications.journalPrompts}
                                onCheckedChange={(checked) =>
                                    setNotifications(prev => ({ ...prev, journalPrompts: checked }))
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sun className="h-5 w-5 text-primary" />
                            Appearance & Preferences
                        </CardTitle>
                        <CardDescription>
                            Customize the look and feel of your app
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Theme</Label>
                                <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                            </div>
                            <Select defaultValue="system">
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Language</Label>
                                <p className="text-sm text-muted-foreground">Select your preferred language</p>
                            </div>
                            <Select defaultValue="en">
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Español</SelectItem>
                                    <SelectItem value="fr">Français</SelectItem>
                                    <SelectItem value="de">Deutsch</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Time Format</Label>
                                <p className="text-sm text-muted-foreground">Choose how time is displayed</p>
                            </div>
                            <Select defaultValue="12h">
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12h">12 Hour</SelectItem>
                                    <SelectItem value="24h">24 Hour</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy & Data */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Privacy & Data
                        </CardTitle>
                        <CardDescription>
                            Control your data and privacy settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Data Sharing for Research</Label>
                                <p className="text-sm text-muted-foreground">Help improve wellness tools with anonymized data</p>
                            </div>
                            <Switch
                                checked={privacy.dataSharing}
                                onCheckedChange={(checked) =>
                                    setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Analytics & Performance</Label>
                                <p className="text-sm text-muted-foreground">Help us improve the app experience</p>
                            </div>
                            <Switch
                                checked={privacy.analytics}
                                onCheckedChange={(checked) =>
                                    setPrivacy(prev => ({ ...prev, analytics: checked }))
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Public Profile</Label>
                                <p className="text-sm text-muted-foreground">Make your wellness achievements visible to others</p>
                            </div>
                            <Switch
                                checked={privacy.publicProfile}
                                onCheckedChange={(checked) =>
                                    setPrivacy(prev => ({ ...prev, publicProfile: checked }))
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5 text-primary" />
                            Data Management
                        </CardTitle>
                        <CardDescription>
                            Export, import, or delete your wellness data
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Export Your Data</Label>
                                <p className="text-sm text-muted-foreground">Download all your wellness data in JSON format</p>
                            </div>
                            <Button variant="outline" onClick={handleExportData}>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Storage Usage</Label>
                                <p className="text-sm text-muted-foreground">Current data usage and limits</p>
                            </div>
                            <div className="text-right">
                                <Badge variant="secondary">2.3 MB / 100 MB</Badge>
                                <p className="text-xs text-muted-foreground mt-1">97.7 MB available</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="backdrop-blur-sm bg-card/50 border-destructive/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            Account Actions
                        </CardTitle>
                        <CardDescription>
                            Manage your account settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Sign Out</Label>
                                <p className="text-sm text-muted-foreground">Sign out of your current session</p>
                            </div>
                            <Button variant="outline" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </div>

                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Delete Account</Label>
                                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                            </div>
                            <Button variant="destructive" onClick={handleDeleteAccount}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* App Information */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            App Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Version</span>
                            <span>1.0.0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Last Updated</span>
                            <span>September 2025</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Platform</span>
                            <span>Web App</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}