import { PaymentLink } from '@/types/dashboard';
import { copyText } from '@/utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link2, Copy, Check, ExternalLink, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RecentLinksCardProps {
  paymentLinks: PaymentLink[];
  showMessage: (text: string, type: 'success' | 'error' | 'info') => void;
}

export function RecentLinksCard({ paymentLinks, showMessage }: RecentLinksCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (link: PaymentLink) => {
    const success = await copyText(link.link);
    if (success) {
      setCopiedId(link.id);
      showMessage('Link copied to clipboard!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const statusColors = {
    Active: 'bg-primary/10 text-primary border-primary/20',
    Paid: 'bg-green-500/10 text-green-600 border-green-500/20',
    Expired: 'bg-muted/30 text-muted-foreground border-muted/40',
  };

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-primary/10">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          Recent Payment Links
          <Badge variant="outline" className="ml-auto">
            {paymentLinks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paymentLinks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Link2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No payment links yet</p>
            <p className="text-sm">Links will appear here once created</p>
          </div>
        ) : (
          <ScrollArea className="h-[320px] -mx-2 px-2">
            <div className="space-y-3">
              {paymentLinks.map((link) => (
                <div 
                  key={link.id} 
                  className="p-4 rounded-lg bg-card border border-border/50 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground truncate">
                          {link.customerName}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", statusColors[link.status])}
                        >
                          {link.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {link.customerEmail}
                      </p>
                      
                      {link.description && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {link.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-lg font-bold text-primary">
                          {currencySymbols[link.currency] || link.currency}
                          {link.amount.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {link.createdByName}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(link.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(link)}
                        className="h-8 w-8"
                      >
                        {copiedId === link.id ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(link.link, '_blank')}
                        className="h-8 w-8"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
