import { Message } from '@/types/dashboard';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageDisplayProps {
  message: Message | null;
  onClose?: () => void;
}

export function MessageDisplay({ message, onClose }: MessageDisplayProps) {
  if (!message) return null;

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const styles = {
    success: 'bg-primary/10 border-primary/30 text-primary',
    error: 'bg-destructive/10 border-destructive/30 text-destructive',
    info: 'bg-secondary/10 border-secondary/30 text-secondary',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm',
        styles[message.type]
      )}>
        {icons[message.type]}
        <span className="font-medium">{message.text}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
