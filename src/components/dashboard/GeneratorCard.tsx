import { GeneratorState, GeneratorAction } from '@/state/generatorReducer';
import { GATEWAYS } from '@/utils/constants';
import { copyText } from '@/utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Copy, 
  RefreshCw,
  Lock,
  Mail,
  User,
  DollarSign,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface GeneratorCardProps {
  isSales: boolean;
  genState: GeneratorState;
  genDispatch: React.Dispatch<GeneratorAction>;
  onGenerate: () => void;
  showMessage: (text: string, type: 'success' | 'error' | 'info') => void;
}

export function GeneratorCard({ 
  isSales, 
  genState, 
  genDispatch, 
  onGenerate,
  showMessage 
}: GeneratorCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (genState.generatedLink) {
      const success = await copyText(genState.generatedLink);
      if (success) {
        setCopied(true);
        showMessage('Link copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleNext = () => {
    if (genState.step === 'FORM') {
      // Validate before moving to confirm
      if (!genState.customerName.trim()) {
        genDispatch({ type: 'SET_ERROR', error: 'Customer name is required' });
        return;
      }
      if (!genState.customerEmail.trim() || !genState.customerEmail.includes('@')) {
        genDispatch({ type: 'SET_ERROR', error: 'Valid email is required' });
        return;
      }
      if (!genState.amount || parseFloat(genState.amount) <= 0) {
        genDispatch({ type: 'SET_ERROR', error: 'Valid amount is required' });
        return;
      }
    }
    
    if (genState.step === 'CONFIRM') {
      onGenerate();
      return;
    }
    
    genDispatch({ type: 'NEXT_STEP' });
  };

  // Access restricted view
  if (!isSales) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-full bg-muted/30">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            Payment Link Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 rounded-full bg-muted/20 mb-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Access Restricted
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              This feature is only available for Sales team members. 
              Contact your administrator if you need access.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedGateway = GATEWAYS.find(g => g.id === genState.gateway);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-primary/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          Payment Link Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {['FORM', 'CONFIRM', 'LINK_GENERATED'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                genState.step === step 
                  ? "bg-primary text-primary-foreground" 
                  : index < ['FORM', 'CONFIRM', 'LINK_GENERATED'].indexOf(genState.step)
                    ? "bg-primary/20 text-primary"
                    : "bg-muted/30 text-muted-foreground"
              )}>
                {index + 1}
              </div>
              {index < 2 && (
                <div className={cn(
                  "w-8 h-0.5 mx-1",
                  index < ['FORM', 'CONFIRM', 'LINK_GENERATED'].indexOf(genState.step)
                    ? "bg-primary"
                    : "bg-muted/30"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Error display */}
        {genState.error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {genState.error}
          </div>
        )}

        {/* Step 1: Form */}
        {genState.step === 'FORM' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Name
              </Label>
              <Input
                value={genState.customerName}
                onChange={(e) => genDispatch({ type: 'SET_FIELD', field: 'customerName', value: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Customer Email
              </Label>
              <Input
                type="email"
                value={genState.customerEmail}
                onChange={(e) => genDispatch({ type: 'SET_FIELD', field: 'customerEmail', value: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Amount
                </Label>
                <Input
                  type="number"
                  value={genState.amount}
                  onChange={(e) => genDispatch({ type: 'SET_FIELD', field: 'amount', value: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select 
                  value={genState.currency} 
                  onValueChange={(v) => genDispatch({ type: 'SET_FIELD', field: 'currency', value: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Gateway</Label>
              <Select 
                value={genState.gateway} 
                onValueChange={(v) => genDispatch({ type: 'SET_FIELD', field: 'gateway', value: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GATEWAYS.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.icon} {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description (Optional)
              </Label>
              <Textarea
                value={genState.description}
                onChange={(e) => genDispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
                placeholder="Payment for..."
                rows={2}
              />
            </div>

            <Button onClick={handleNext} className="w-full mt-4">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Confirm */}
        {genState.step === 'CONFIRM' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border/50 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{genState.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{genState.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-primary">
                  {genState.currency} {parseFloat(genState.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gateway</span>
                <span className="font-medium">
                  {selectedGateway?.icon} {selectedGateway?.name}
                </span>
              </div>
              {genState.description && (
                <div className="pt-2 border-t border-border/50">
                  <span className="text-muted-foreground text-sm">Description:</span>
                  <p className="font-medium mt-1">{genState.description}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => genDispatch({ type: 'PREV_STEP' })}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Generate Link
                <Check className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Link Generated */}
        {genState.step === 'LINK_GENERATED' && genState.generatedLink && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Link Generated!</h3>
              <p className="text-sm text-muted-foreground">
                Share this link with your customer
              </p>
            </div>

            <div className="p-3 rounded-lg bg-muted/20 border border-border">
              <code className="text-sm break-all text-foreground">
                {genState.generatedLink}
              </code>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCopyLink} className="flex-1">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => genDispatch({ type: 'RESET' })}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
