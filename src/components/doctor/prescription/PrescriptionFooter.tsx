
import { useAuth } from "@/contexts/AuthContext";

const PrescriptionFooter = () => {
  const { user } = useAuth();
  
  return (
    <div className="mt-8 flex flex-col items-end">
      <div className="text-center">
        <div className="border-t border-gray-300 pt-2 w-48 mb-2"></div>
        <p className="font-semibold text-xs sm:text-sm">Dr. {user?.name || "Doctor"}</p>
        <p className="text-xs text-gray-500">{user?.specialization || "Medical Doctor"}</p>
      </div>
    </div>
  );
};

export default PrescriptionFooter;
