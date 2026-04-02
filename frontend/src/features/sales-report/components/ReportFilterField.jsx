const ReportFilterField = ({ label, children }) => {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2.5">
      <span className="text-base font-medium text-[#5B5B5B] md:text-lg">
        {label}
      </span>
      {children}
    </label>
  );
};

export default ReportFilterField;
