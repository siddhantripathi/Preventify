
interface AdviceSectionProps {
  advice: string[];
}

const AdviceSection = ({ advice }: AdviceSectionProps) => {
  return (
    <div className="mb-3 sm:mb-4">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Advice</h3>
      {advice?.length > 0 ? (
        <ul className="list-disc list-inside mt-1 text-xs sm:text-sm">
          {advice.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs sm:text-sm text-gray-500 italic mt-1">No specific advice</p>
      )}
    </div>
  );
};

export default AdviceSection;
