import { cn } from '../lib/cn';

/** Figma: `divider` — orientation horizontal | vertical, neutral-40 1px */
export function Divider({
  orientation = 'horizontal',
  className,
}: {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <span
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-neutral-40',
        orientation === 'horizontal' ? 'block h-px w-full' : 'inline-block h-3 w-px self-center',
        className,
      )}
    />
  );
}
