export type PageIndicatorProps = {
  currentPage?: number;
  count: number;
  className?: string;
  onClick: (index: number) => void;
};

export const Footer = () => {
  return (
    <footer className="text-center">
      <div className="text-sm">2024 🌞 YASWAMI</div>
    </footer>
  );
};
