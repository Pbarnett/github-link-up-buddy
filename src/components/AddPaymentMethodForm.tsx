import * as React from 'react';
import { FC } from 'react';
import { useState, use } from 'react';
type FormEvent<T = Element> = React.FormEvent<T>;
type ChangeEvent<T = Element> = React.ChangeEvent<T>;

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
interface AddPaymentMethodFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddPaymentMethodForm: FC<AddPaymentMethodFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    card_number: '',
    cardholder_name: '',
    exp_month: '',
    exp_year: '',
    cvv: '',
    is_default: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPaymentMethod } = usePaymentMethods();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts: string[] = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber((e.target as HTMLInputElement).value);
    setFormData(prev => ({ ...prev, card_number: formatted }));
  };

  const handleExpMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.length <= 2) {
      setFormData(prev => ({ ...prev, exp_month: value }));
    }
  };

  const handleExpYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.length <= 4) {
      setFormData(prev => ({ ...prev, exp_year: value }));
    }
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.length <= 4) {
      setFormData(prev => ({ ...prev, cvv: value }));
    }
  };

  const validateForm = () => {
    const { card_number, cardholder_name, exp_month, exp_year, cvv } = formData;

    if (!card_number || card_number.replace(/\s/g, '').length < 13) {
      toast({
        title: 'Invalid card number',
        description: 'Please enter a valid card number.',
        variant: 'destructive',
      });
      return false;
    }

    if (!cardholder_name.trim()) {
      toast({
        title: 'Missing cardholder name',
        description: "Please enter the cardholder's name.",
        variant: 'destructive',
      });
      return false;
    }

    const monthNum = parseInt(exp_month);
    if (!exp_month || monthNum < 1 || monthNum > 12) {
      toast({
        title: 'Invalid expiry month',
        description: 'Please enter a valid expiry month (1-12).',
        variant: 'destructive',
      });
      return false;
    }

    const yearNum = parseInt(exp_year);
    const currentYear = new Date().getFullYear();
    if (!exp_year || yearNum < currentYear || yearNum > currentYear + 20) {
      toast({
        title: 'Invalid expiry year',
        description: 'Please enter a valid expiry year.',
        variant: 'destructive',
      });
      return false;
    }

    if (!cvv || cvv.length < 3) {
      toast({
        title: 'Invalid CVV',
        description: 'Please enter a valid CVV.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addPaymentMethod({
        card_number: formData.card_number.replace(/\s/g, ''),
        cardholder_name: formData.cardholder_name,
        exp_month: parseInt(formData.exp_month),
        exp_year: parseInt(formData.exp_year),
        cvv: formData.cvv,
        is_default: formData.is_default,
      });

      toast({
        title: 'Payment method added',
        description: 'Your payment method has been successfully added.',
      });

      // Reset form
      setFormData({
        card_number: '',
        cardholder_name: '',
        exp_month: '',
        exp_year: '',
        cvv: '',
        is_default: false,
      });

      onSuccess?.();
    } catch (error: unknown) {
      toast({
        title: 'Error adding payment method',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to add payment method. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add Payment Method</CardTitle>
        <CardDescription>
          Add a new credit or debit card to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card_number">Card Number</Label>
            <Input
              id="card_number"
              name="card_number"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.card_number}
              onChange={handleCardNumberChange}
              maxLength={19}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholder_name">Cardholder Name</Label>
            <Input
              id="cardholder_name"
              name="cardholder_name"
              type="text"
              placeholder="John Doe"
              value={formData.cardholder_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exp_month">Expiry Month</Label>
              <Input
                id="exp_month"
                name="exp_month"
                type="text"
                placeholder="MM"
                value={formData.exp_month}
                onChange={handleExpMonthChange}
                maxLength={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp_year">Expiry Year</Label>
              <Input
                id="exp_year"
                name="exp_year"
                type="text"
                placeholder="YYYY"
                value={formData.exp_year}
                onChange={handleExpYearChange}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              type="text"
              placeholder="123"
              value={formData.cvv}
              onChange={handleCvvChange}
              maxLength={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="is_default">Set as default payment method</Label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Payment Method'
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
