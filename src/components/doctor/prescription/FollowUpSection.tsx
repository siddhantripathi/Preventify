
interface FollowUpSectionProps {
  followUp: string;
}

const FollowUpSection = ({ followUp }: FollowUpSectionProps) => {
  return (
    <div className="mb-3 sm:mb-4">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Follow-up</h3>
      <p className="text-xs sm:text-sm mt-1">{followUp || "No follow-up scheduled"}</p>
    </div>
  );
};

export default FollowUpSection;
