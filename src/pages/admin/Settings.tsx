import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiActive, setApiActive] = useState(false);
  const { user, updateUserSettings } = useAuth();
  const [defaultVitalsRanges, setDefaultVitalsRanges] = useState({
    hrMin: 60,
    hrMax: 100,
    spo2Min: 95,
    tempMin: 36.5,
    tempMax: 37.5,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    queueNotifications: true,
    securityAlerts: true,
  });
  
  // Load API key from user data on component mount
  useEffect(() => {
    if (user?.geminiApiKey) {
      console.log('Loading Gemini API key from user profile');
      setApiKey(user.geminiApiKey);
      setApiActive(true);
    } else {
      // No need to check localStorage since we're moving to a new system
      setApiActive(false);
      setApiKey("");
    }
  }, [user]);
  
  const handleApiKeySave = async () => {
    if (apiActive && apiKey.trim()) {
      try {
        console.log('Saving Gemini API key to user profile');
        // Save to Firebase user profile
        await updateUserSettings({ geminiApiKey: apiKey.trim() });
        
        toast({
          title: "API key saved",
          description: "Your Gemini API key has been saved successfully.",
        });
      } catch (error) {
        console.error("Error saving API key:", error);
        toast({
          title: "Error saving API key",
          description: "There was an error saving your API key. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      try {
        console.log('Removing Gemini API key from user profile');
        // Clear API key from user profile
        await updateUserSettings({ geminiApiKey: "" });
        
        toast({
          title: "API integration disabled",
          description: "The Gemini API integration has been disabled.",
        });
      } catch (error) {
        console.error("Error disabling API key:", error);
      }
    }
  };
  
  const handleApiToggle = (checked: boolean) => {
    setApiActive(checked);
    if (!checked) {
      toast({
        title: "API integration disabled",
        description: "The Gemini API integration has been disabled.",
      });
    }
  };
  
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  
  const handleVitalsRangeSave = () => {
    // In a real app, you would save these ranges to your system
    console.log("Saving vitals ranges:", defaultVitalsRanges);
    toast({
      title: "Vitals ranges updated",
      description: "Default vitals ranges have been updated successfully.",
    });
  };
  
  const handleNotificationSave = () => {
    // In a real app, you would save notification settings
    console.log("Saving notification settings:", notificationSettings);
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure system settings and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="api-integration">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="api-integration">API Integration</TabsTrigger>
            <TabsTrigger value="system-config">System Configuration</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-integration">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage Gemini API key and other external service integrations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                  <div className="flex">
                    <Input 
                      id="gemini-api-key" 
                      type={showApiKey ? "text" : "password"} 
                      placeholder="AIzaSy..." 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)} 
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={toggleApiKeyVisibility}
                      className="ml-2"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your API key is stored securely and used for AI-powered diagnostics.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-active">API Integration Active</Label>
                    <Switch 
                      id="api-active" 
                      checked={apiActive}
                      onCheckedChange={handleApiToggle}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the Gemini API integration. If disabled, the system will use mock data.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleApiKeySave}>Save API Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system-config">
            <Card>
              <CardHeader>
                <CardTitle>Default Values</CardTitle>
                <CardDescription>
                  Configure default vitals ranges and alert thresholds.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label>Heart Rate Range (bpm)</Label>
                      <span className="text-sm">{defaultVitalsRanges.hrMin} - {defaultVitalsRanges.hrMax}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        value={defaultVitalsRanges.hrMin}
                        onChange={(e) => setDefaultVitalsRanges({...defaultVitalsRanges, hrMin: parseInt(e.target.value)})}
                        className="w-20"
                        min={40}
                        max={defaultVitalsRanges.hrMax - 1}
                      />
                      <Slider 
                        defaultValue={[defaultVitalsRanges.hrMin, defaultVitalsRanges.hrMax]} 
                        min={40} 
                        max={160} 
                        step={1}
                        value={[defaultVitalsRanges.hrMin, defaultVitalsRanges.hrMax]}
                        onValueChange={(values) => setDefaultVitalsRanges({
                          ...defaultVitalsRanges, 
                          hrMin: values[0], 
                          hrMax: values[1]
                        })}
                        className="flex-1"
                      />
                      <Input 
                        type="number" 
                        value={defaultVitalsRanges.hrMax}
                        onChange={(e) => setDefaultVitalsRanges({...defaultVitalsRanges, hrMax: parseInt(e.target.value)})}
                        className="w-20"
                        min={defaultVitalsRanges.hrMin + 1}
                        max={160}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label>SpO2 Minimum (%)</Label>
                      <span className="text-sm">{defaultVitalsRanges.spo2Min}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        value={defaultVitalsRanges.spo2Min}
                        onChange={(e) => setDefaultVitalsRanges({...defaultVitalsRanges, spo2Min: parseInt(e.target.value)})}
                        className="w-20"
                        min={80}
                        max={100}
                      />
                      <Slider 
                        defaultValue={[defaultVitalsRanges.spo2Min]} 
                        min={80} 
                        max={100} 
                        step={1}
                        value={[defaultVitalsRanges.spo2Min]}
                        onValueChange={(values) => setDefaultVitalsRanges({
                          ...defaultVitalsRanges, 
                          spo2Min: values[0]
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label>Temperature Range (°C)</Label>
                      <span className="text-sm">{defaultVitalsRanges.tempMin} - {defaultVitalsRanges.tempMax}°C</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        value={defaultVitalsRanges.tempMin}
                        onChange={(e) => setDefaultVitalsRanges({...defaultVitalsRanges, tempMin: parseFloat(e.target.value)})}
                        className="w-20"
                        min={35}
                        max={defaultVitalsRanges.tempMax - 0.1}
                        step={0.1}
                      />
                      <Slider 
                        defaultValue={[defaultVitalsRanges.tempMin, defaultVitalsRanges.tempMax]} 
                        min={35} 
                        max={40} 
                        step={0.1}
                        value={[defaultVitalsRanges.tempMin, defaultVitalsRanges.tempMax]}
                        onValueChange={(values) => setDefaultVitalsRanges({
                          ...defaultVitalsRanges, 
                          tempMin: values[0], 
                          tempMax: values[1]
                        })}
                        className="flex-1"
                      />
                      <Input 
                        type="number" 
                        value={defaultVitalsRanges.tempMax}
                        onChange={(e) => setDefaultVitalsRanges({...defaultVitalsRanges, tempMax: parseFloat(e.target.value)})}
                        className="w-20"
                        min={defaultVitalsRanges.tempMin + 0.1}
                        max={40}
                        step={0.1}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleVitalsRangeSave}>Save Default Values</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage system notifications and alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive critical alerts via email
                    </p>
                  </div>
                  <Switch 
                    id="email-alerts" 
                    checked={notificationSettings.emailAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailAlerts: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive urgent notifications via SMS
                    </p>
                  </div>
                  <Switch 
                    id="sms-alerts" 
                    checked={notificationSettings.smsAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsAlerts: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="queue-notifications">Queue Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerts when queue wait times exceed thresholds
                    </p>
                  </div>
                  <Switch 
                    id="queue-notifications" 
                    checked={notificationSettings.queueNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, queueNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security-alerts">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notifications about security events
                    </p>
                  </div>
                  <Switch 
                    id="security-alerts" 
                    checked={notificationSettings.securityAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, securityAlerts: checked})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNotificationSave}>Save Notification Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Access Control</CardTitle>
            <CardDescription>
              Manage user permissions and access levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Doctor Access Level</Label>
                  <p className="text-sm text-muted-foreground">
                    Access to patient data and prescriptions
                  </p>
                </div>
                <Select defaultValue="read-write">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read-only">Read Only</SelectItem>
                    <SelectItem value="read-write">Read & Write</SelectItem>
                    <SelectItem value="full">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>MPHW Access Level</Label>
                  <p className="text-sm text-muted-foreground">
                    Access to patient registration and queue
                  </p>
                </div>
                <Select defaultValue="limited">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="extended">Extended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Access Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;
