export const Button = ({
  onClick,
  className,
  children,
}: {
  onClick: () => any;
  className?: string;
  children: any;
}) => {
  return <button onClick={onClick} className={`px-4 py-2 font-jaro text-2xl text-black rounded-md border-black border-2 border-b-4 bg-primary ${className ?? ""}`}>
    {children}
  </button>;
};
