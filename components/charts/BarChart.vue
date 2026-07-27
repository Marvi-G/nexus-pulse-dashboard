<template>
  <ClientOnly>
    <div class="w-full" :style="{ height: height + 'px' }">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <template #fallback>
      <div class="w-full skeleton" :style="{ height: height + 'px' }" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderRadius?: number;
  }[];
  height?: number;
  horizontal?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  horizontal: false,
});

const { isDark } = useTheme();

const defaultColors = [
  'rgb(99, 102, 241)',
  'rgb(139, 92, 246)',
  'rgb(167, 139, 250)',
  'rgb(196, 181, 253)',
  'rgb(129, 140, 248)',
  'rgb(165, 180, 252)',
];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((ds, i) => ({
    ...ds,
    backgroundColor: ds.backgroundColor || defaultColors[i % defaultColors.length],
    borderRadius: ds.borderRadius ?? 8,
    borderSkipped: false,
    maxBarThickness: 48,
  })),
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: props.horizontal ? ('y' as const) : ('x' as const),
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: isDark.value ? '#1e293b' : '#0f172a',
      titleColor: '#f1f5f9',
      bodyColor: '#cbd5e1',
      borderColor: isDark.value ? '#334155' : '#1e293b',
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: props.horizontal,
        color: isDark.value ? 'rgba(148, 163, 184, 0.06)' : 'rgba(148, 163, 184, 0.1)',
      },
      ticks: {
        color: isDark.value ? '#64748b' : '#94a3b8',
        font: { size: 12 },
      },
      border: { display: false },
    },
    y: {
      grid: {
        display: !props.horizontal,
        color: isDark.value ? 'rgba(148, 163, 184, 0.06)' : 'rgba(148, 163, 184, 0.1)',
      },
      ticks: {
        color: isDark.value ? '#64748b' : '#94a3b8',
        font: { size: 12 },
      },
      border: { display: false },
    },
  },
}));
</script>
