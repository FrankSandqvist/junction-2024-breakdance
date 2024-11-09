export const InfoBox = ({
  wide,
  value,
  title,
  onValueChange,
}: {
  wide?: boolean;
  value?: string;
  onValueChange?: (v: string) => any;
  title: string;
}) => {
  return (
    <div
      className={`border-dashed border-primary backdrop-blur-lg border p-2 flex flex-col items-center ${
        value ? "" : "text-white/50"
      } ${wide ? "col-span-2" : ""}`}
    >
      <div className="bg-primary -mt-6 text-black px-4 font-jaro rounded-sm">
        {title}
      </div>
      <input
        type="text"
        value={value ?? ""}
        onChange={
          onValueChange ? (e) => onValueChange(e.target.value) : undefined
        }
        readOnly={!onValueChange}
        className="bg-transparent text-white w-full text-center"
      />
    </div>
  );
};
