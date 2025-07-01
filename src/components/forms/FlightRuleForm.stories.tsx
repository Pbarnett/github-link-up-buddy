import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FlightRuleForm } from './FlightRuleForm';

const meta: Meta<typeof FlightRuleForm> = {
  title: 'Forms/FlightRuleForm',
  component: FlightRuleForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'onSubmit' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: action('onSubmit'),
  },
};

export const WithDefaults: Story = {
  args: {
    onSubmit: action('onSubmit'),
    defaultValues: {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: new Date('2024-07-15'),
      latestReturn: new Date('2024-07-22'),
      cabinClass: 'economy',
      budget: 800,
    },
  },
};

export const AutoBookingEnabled: Story = {
  args: {
    onSubmit: action('onSubmit'),
    defaultValues: {
      origin: ['JFK', 'LGA'],
      destination: 'SFO',
      earliestOutbound: new Date('2024-08-01'),
      latestReturn: new Date('2024-08-08'),
      cabinClass: 'business',
      budget: 2000,
      autoBookEnabled: true,
      paymentMethodId: 'pm_1234567890',
    },
  },
};

export const PremiumSearch: Story = {
  args: {
    onSubmit: action('onSubmit'),
    defaultValues: {
      origin: ['EWR'],
      destination: 'LHR',
      earliestOutbound: new Date('2024-09-10'),
      latestReturn: new Date('2024-09-20'),
      cabinClass: 'first',
      budget: 5000,
    },
  },
};
