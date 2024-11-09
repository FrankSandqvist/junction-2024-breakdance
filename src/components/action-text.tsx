export const ActionText = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={`font-jaro text-4xl text-center text-white ${className ?? ""}`}
      style={{
        filter:
          "drop-shadow(0px 4px 0px black) drop-shadow(1px 0px 0px black) drop-shadow(-1px 0px 0px black)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
