export const LoadingIndicator = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="90 0 20 20" className="w-16 h-16">
      <g className=" fill-secondary animate-pulse">
        <circle cx="101.25" cy="7.47" r="1.99" />
        <circle cx="101.92" cy="1.41" r="1.41" />
        <circle cx="105.49" cy="4.58" r="1.18" />
      </g>
    </svg>
  );
};
