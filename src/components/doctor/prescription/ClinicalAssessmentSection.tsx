
interface ClinicalAssessmentSectionProps {
  clinicalAssessment: string;
}

const ClinicalAssessmentSection = ({ clinicalAssessment }: ClinicalAssessmentSectionProps) => {
  if (!clinicalAssessment) return null;
  
  return (
    <div className="mb-3 sm:mb-4">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Clinical Assessment</h3>
      <div className="bg-gray-50 p-2 sm:p-3 rounded-md text-xs sm:text-sm mt-1">
        {clinicalAssessment}
      </div>
    </div>
  );
};

export default ClinicalAssessmentSection;
