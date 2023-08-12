import type { Meta, StoryObj } from '@storybook/vue3';
import TrendItem from '../vweb/common/components/mvtratetrend/ratetrend.presentational.vue';

const meta: Meta<typeof TrendItem> = {
    title: 'General/Trend Card',
    component: TrendItem,
    tags: ['autodocs'],
    argTypes: {
        iconColor: { control: 'radio', options: ['tip', 'main', 'danger', ''] },
    },
    args: {
        iconColor: '',
        header: '',
        description: '',
        footer: '',
        onClick: () => alert('onClick clicked'),
    },
};

export default meta;

type Story = StoryObj<typeof TrendItem>;

export const Default: Story = {
    args: {
        iconColor: '',
        header: ' 30-year FRM',
        description: '6.71%',
        footer: '0.87 Fees/Points',
    },
};
