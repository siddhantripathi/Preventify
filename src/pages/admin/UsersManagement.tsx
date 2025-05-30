import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Building2, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const specializations = [
  "General Physician",
  "Pediatrician",
  "Gynecologist",
  "Physiotherapist",
  "Nutritionist",
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Psychiatrist",
  "Orthopedic Surgeon"
];

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["doctor", "mphw", "admin"], {
    required_error: "You need to select a user role",
  }),
  specialization: z.string().optional(),
  locationIds: z.array(z.string()).optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

const UsersManagement = () => {
  const { users, locations, addUser, updateUser, deleteUser } = useAdmin();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [userForLocations, setUserForLocations] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "doctor",
      specialization: "",
      locationIds: [],
    },
  });
  
  const watchRole = form.watch("role");
  
  const handleOpenEdit = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    form.reset({
      name: user.name,
      email: user.email,
      password: undefined, // Don't populate password for security
      role: user.role,
      specialization: user.specialization || "",
      locationIds: user.locationIds || [],
    });
    
    setSelectedUser(userId);
    setIsEditing(true);
  };
  
  const handleOpenCreate = () => {
    form.reset({
      name: "",
      email: "",
      password: "",
      role: "doctor",
      specialization: "",
      locationIds: [],
    });
    
    setSelectedUser(null);
    setIsEditing(false);
  };
  
  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && selectedUser) {
        // If password is empty in edit mode, don't update it
        const dataToUpdate = values.password 
          ? values 
          : { ...values, password: undefined };
          
        await updateUser(selectedUser, dataToUpdate);
      } else {
        // For new users, make sure password is included
        if (!values.password) {
          toast({
            title: "Error",
            description: "Password is required for new users",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        // Ensure all required fields are present
        await addUser({
          name: values.name,
          email: values.email,
          role: values.role,
          password: values.password,
          specialization: values.specialization,
          locationIds: values.locationIds,
        });
      }
      
      // Close the dialog
      const closeButton = document.querySelector('[data-state="open"] [data-dialog-close]') as HTMLButtonElement | null;
      if (closeButton) {
        closeButton.click();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process user data",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setIsConfirmDeleteOpen(false);
      setUserToDelete(null);
    }
  };
  
  const openLocationDialog = (userId: string) => {
    setUserForLocations(userId);
    setIsLocationDialogOpen(true);
  };
  
  const toggleUserLocation = (userId: string, locationId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const hasLocation = user.locationIds?.includes(locationId);
    
    if (hasLocation) {
      // Remove location
      const updatedLocations = user.locationIds?.filter(id => id !== locationId) || [];
      updateUser(userId, { locationIds: updatedLocations });
    } else {
      // Add location
      const updatedLocations = [...(user.locationIds || []), locationId];
      updateUser(userId, { locationIds: updatedLocations });
    }
  };
  
  const getUserLocationNames = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.locationIds || user.locationIds.length === 0) return "None";
    
    return user.locationIds
      .map(locId => locations.find(l => l.id === locId)?.name || "Unknown")
      .join(", ");
  };
  
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">Manage doctors, MPHWs, and admins</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Edit User" : "Add New User"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing ? "Update user details" : "Create a new user account"}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isEditing ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter password" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="mphw">MPHW</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {watchRole === "doctor" && (
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a specialization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {specializations.map(specialization => (
                                <SelectItem key={specialization} value={specialization}>
                                  {specialization}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting 
                        ? "Processing..." 
                        : isEditing 
                          ? "Update User" 
                          : "Add User"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Assigned Locations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.role === 'admin' 
                            ? 'default' 
                            : user.role === 'doctor' 
                              ? 'secondary' 
                              : 'outline'
                        }>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.role === 'doctor' && user.specialization ? (
                          <div className="flex items-center gap-1">
                            <Stethoscope className="h-3 w-3 text-medical-primary" />
                            <span>{user.specialization}</span>
                          </div>
                        ) : (
                          user.role === 'doctor' ? "Not specified" : "-"
                        )}
                      </TableCell>
                      <TableCell>{getUserLocationNames(user.id)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openLocationDialog(user.id)}
                          >
                            <Building2 className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenEdit(user.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[550px]">
                              {/* This content will be replaced by the main form dialog */}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => confirmDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No users found. Add your first user.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Location Assignment Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Manage User Locations</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Assign or remove this user from locations:</p>
            
            {locations.length > 0 ? (
              <div className="space-y-2">
                {locations.map(location => {
                  const user = users.find(u => u.id === userForLocations);
                  const isAssigned = user?.locationIds?.includes(location.id);
                  
                  return (
                    <div key={location.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.city}, {location.state}</p>
                      </div>
                      <Button
                        variant={isAssigned ? "destructive" : "default"}
                        size="sm"
                        onClick={() => userForLocations && toggleUserLocation(userForLocations, location.id)}
                      >
                        {isAssigned ? "Remove" : "Assign"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No locations available. Create locations first.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsLocationDialogOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersManagement;
