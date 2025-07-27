import type { Meta, StoryObj } from '@storybook/angular';
import { HlmButtonDirective } from './hlm-button.directive';

const meta: Meta<HlmButtonDirective> = {
  title: 'UI Components/Button',
  component: HlmButtonDirective,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A customizable button component using the design system tokens and Spartan UI.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the button'
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button'
    },
    label: {
      control: { type: 'text' },
      description: 'The text displayed on the button'
    }
  }
};

export default meta;
type Story = StoryObj<HlmButtonDirective>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    label: 'Button'
  },
  render: (args) => ({
    template: `
      <button hlmBtn [variant]="variant" [size]="size" [label]="label">
        {{ label }}
      </button>
    `,
    props: args
  })
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex gap-4 flex-wrap">
        <button hlmBtn variant="default">Default</button>
        <button hlmBtn variant="destructive">Destructive</button>
        <button hlmBtn variant="outline">Outline</button>
        <button hlmBtn variant="secondary">Secondary</button>
        <button hlmBtn variant="ghost">Ghost</button>
        <button hlmBtn variant="link">Link</button>
      </div>
    `
  })
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex gap-4 items-center">
        <button hlmBtn size="sm">Small</button>
        <button hlmBtn size="default">Default</button>
        <button hlmBtn size="lg">Large</button>
        <button hlmBtn size="icon">🔍</button>
      </div>
    `
  })
}; 