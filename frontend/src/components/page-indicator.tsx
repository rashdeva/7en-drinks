import { cn } from '~/lib/utils';

export type PageIndicatorProps = {
  currentPage?: number;
  count: number;
  className?: string;
  onClick: (index: number) => void;
};

export const PageIndicator = ({ currentPage = 0, count, className, onClick }: PageIndicatorProps) => {
  return (
    <div className={cn('inline-flex px-2 rounded-full w-full gap-2', className)}>
      {Array.from({ length: count }).map((_, index) => {
        return (
          <div key={index} onClick={() => onClick(index)} className={'flex-1 py-2 group cursor-pointer '}>
            <div
              className={cn(
                'flex-1 bg-muted rounded-full h-1 transition-colors group-hover:bg-accent',
                currentPage === index && 'bg-ring group-hover:bg-ring'
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
