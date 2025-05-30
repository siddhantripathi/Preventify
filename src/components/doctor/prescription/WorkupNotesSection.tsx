
interface WorkupNotesSectionProps {
  workupNotes: {[key: string]: string};
}

const WorkupNotesSection = ({ workupNotes }: WorkupNotesSectionProps) => {
  if (!workupNotes || Object.keys(workupNotes).length === 0) return null;
  
  return (
    <div className="mb-3 sm:mb-4">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Workup Results</h3>
      <div className="mt-1 space-y-1 sm:space-y-2">
        {Object.entries(workupNotes).map(([diagnosis, notes], index) => (
          <div key={index} className="p-1.5 sm:p-2 border rounded-md">
            <p className="text-xs font-medium">{diagnosis}</p>
            <p className="text-xs mt-0.5 sm:mt-1">{String(notes)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkupNotesSection;
