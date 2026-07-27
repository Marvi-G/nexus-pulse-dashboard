<template>
  <ClientOnly>
    <div class="w-full flex items-center justify-center" :style="{ height: height + 'px' }">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <template #fallback>
      <div class="w-full skeleton rounded-full mx-auto" :style="{ width: height + 'px', height: height + 'px' }" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  labels: string[];
  data: number[];
  colors?: string[];
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  height: 260,
});

const { isDark } = useTheme();

const defaultColors = [
  'rgb(99, 102, 241)',
  'rgb(139, 92, 246)',
  'rgb(167, 139, 250)',
  'rgb(196, 181, 253)',
  'rgb(224, 231, 255)',
];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.colors || defaultColors,
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
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
    },
  },
}));
</script>
