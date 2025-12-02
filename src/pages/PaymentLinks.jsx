import { useState, useReducer } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Copy, Check, Plus, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GATEWAYS, generateId } from '@/utils/constants';
import { generatorReducer, initialGeneratorState } from '@/state/generatorReducer';
import { PaymentLink } from '@/types/dashboard';

export default function PaymentLinks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [genState, genDispatch] = useReducer(generatorReducer, initialGeneratorState);
  const [links, setLinks] = useState<PaymentLink[]>(() => {
    const stored = localStorage.getItem(`payment_links_${user?.id}`);
    return stored ? JSON.parse(stored).map((l: any) => ({ ...l, createdAt: new Date(l.createdAt) })) : [];
  });
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    const { customerName, customerEmail, amount, currency, gateway, description } = genState;
    
    if (!customerName.trim()) {
      toast({ title: 'Error', description: 'Customer name is required', variant: 'destructive' });
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      toast({ title: 'Error', description: 'Valid email is required', variant: 'destructive' });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: 'Error', description: 'Valid amount is required', variant: 'destructive' });
      return;
    }

    const linkId = generateId().slice(0, 12);
    const newLink: PaymentLink = {
      id: generateId(),
      customerId: `cust_${generateId().slice(0, 8)}`,
      customerName,
      customerEmail,
      amount: parseFloat(amount),
      currency,
      gateway,
      description,
      link: `https://pay.example.com/link/${linkId}`,
      createdBy: user?.id || '',
      createdByName: user?.name || '',
      createdAt: new Date(),
      status: 'Active',
    };

    const updatedLinks = [newLink, ...links];
    setLinks(updatedLinks);
    localStorage.setItem(`payment_links_${user?.id}`, JSON.stringify(updatedLinks));
    genDispatch({ type: 'RESET' });
    toast({ title: 'Success', description: 'Payment link generated!' });
  };

  const copyLink = async (link: string, id: string) => {
    await navigator.clipboard.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Payment Links
        </h2>
        <p className="text-muted-foreground mt-1">Create and manage payment links</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={genState.customerName}
                  onChange={(e) => genDispatch({ type: 'SET_FIELD', field: 'customerName', value: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Email</Label>
                <Input
                  type="email"
                  value={genState.customerEmail}
                  onChange={(e) => genDispatch({ type: 'SET_FIELD', field: 'customerEmail', value: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={genState.amount}
                  onChange={(e) => genDispatch({ type: 'SET_FIELD', field: 'amount', value: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={genState.currency}
                  onValueChange={(v) => genDispatch({ type: 'SET_FIELD', field: 'currency', value: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gateway</Label>
                <Select
                  value={genState.gateway}
                  onValueChange={(v) => genDispatch({ type: 'SET_FIELD', field: 'gateway', value: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GATEWAYS.map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.icon} {g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={genState.description}
                onChange={(e) => genDispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
                placeholder="Payment description..."
                rows={2}
              />
            </div>

            <Button onClick={handleGenerate} className="w-full">
              Generate Payment Link
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Recent Links</CardTitle>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No payment links yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {links.map((link) => (
                  <div key={link.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{link.customerName}</p>
                        <p className="text-sm text-muted-foreground">{link.customerEmail}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {link.currency} {link.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input value={link.link} readOnly className="text-xs h-8" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyLink(link.link, link.id)}
                      >
                        {copied === link.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
