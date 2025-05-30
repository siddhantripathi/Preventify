
interface StatusBadgeProps {
  status: 'waiting' | 'in-progress' | 'completed';
}

const PatientStatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = () => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default PatientStatusBadge;
