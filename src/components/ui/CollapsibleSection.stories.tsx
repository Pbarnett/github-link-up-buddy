
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { CollapsibleSection } from './CollapsibleSection';

const meta: Meta<typeof CollapsibleSection> = {
  title: 'UI/CollapsibleSection',
  component: CollapsibleSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A collapsible section component with accessibility features and smooth animations.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The title displayed in the header',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the section is open by default',
    },
    onToggle: {
      action: 'toggled',
      description: 'Callback fired when the section is toggled',
    },
    animationDuration: {
      control: { type: 'range', min: 0, max: 1000, step: 50 },
      description: 'Animation duration in milliseconds',
    },
  },
  args: {
    title: 'Sample Section',
    defaultOpen: false,
    onToggle: action('toggled'),
    animationDuration: 200,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-2">
        <p>This is the collapsible content.</p>
        <p>It can contain any React elements or components.</p>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Sample Button
        </button>
      </div>
    ),
  },
};

export const OpenByDefault: Story = {
  args: {
    ...Default.args,
    defaultOpen: true,
  },
};

export const FastAnimation: Story = {
  args: {
    ...Default.args,
    animationDuration: 100,
  },
};

export const NoAnimation: Story = {
  args: {
    ...Default.args,
    animationDuration: 0,
  },
};

export const LongContent: Story = {
  args: {
    title: 'Section with Long Content',
    children: (
      <div className="space-y-4">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded">Card 1</div>
          <div className="p-4 bg-muted rounded">Card 2</div>
        </div>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      </div>
    ),
  },
};

// Dark theme story
export const DarkTheme: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      story: {
        inline: false,
        height: '400px',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <div className="bg-background text-foreground p-4 rounded">
          <Story />
        </div>
      </div>
    ),
  ],
};
