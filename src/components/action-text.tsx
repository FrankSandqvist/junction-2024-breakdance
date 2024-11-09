export const ActionText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`font-jaro text-7xl text-white ${className ?? ""}`}
    style={{
        filter: "drop-shadow(0px 4px 0px black) drop-shadow(1px 0px 0px black) drop-shadow(-1px 0px 0px black)"
    }}>
      {children}
    </div>
  );
};
