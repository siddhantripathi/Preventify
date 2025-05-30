
import AdminLayout from "@/components/admin/AdminLayout";
import FormularyManager from "@/components/admin/FormularyManager";

const FormularyManagement = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Formulary Management</h1>
        <p className="text-muted-foreground mb-6">
          Manage medications, salts, and brands for your clinic's formulary. This information will be available to doctors when writing prescriptions.
        </p>
        <FormularyManager />
      </div>
    </AdminLayout>
  );
};

export default FormularyManagement;
