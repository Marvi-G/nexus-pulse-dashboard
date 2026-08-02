<template>
  <ClientOnly>
    <div
      class="w-full flex items-center justify-center"
      :style="{ height: height + 'px' }"
    >
      <Doughnut
        :data="chartData"
        :options="chartOptions"
        @click="handleClick"
      />
    </div>
    <template #fallback>
      <div
        class="w-full skeleton rounded-full mx-auto"
        :style="{ width: height + 'px', height: height + 'px' }"
      />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

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

const emit = defineEmits<{
  (
    e: "segment-click",
    data: { label: string; value: number; index: number; percentage: number },
  ): void;
}>();

const { isDark } = useTheme();

const defaultColors = [
  "rgb(99, 102, 241)",
  "rgb(139, 92, 246)",
  "rgb(167, 139, 250)",
  "rgb(196, 181, 253)",
  "rgb(224, 231, 255)",
];

const total = computed(() => props.data.reduce((sum, val) => sum + val, 0));

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.colors || defaultColors,
      borderWidth: 0,
      hoverOffset: 12,
      hoverBorderWidth: 2,
      hoverBorderColor: isDark.value ? "#1e293b" : "#ffffff",
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 800,
    easing: "easeInOutQuart" as const,
    animateRotate: true,
    animateScale: true,
  },
  cutout: "70%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: isDark.value ? "#1e293b" : "#0f172a",
      titleColor: "#f1f5f9",
      bodyColor: "#cbd5e1",
      borderColor: isDark.value ? "#334155" : "#1e293b",
      borderWidth: 1,
      cornerRadius: 12,
      padding: 14,
      displayColors: true,
      titleFont: {
        size: 13,
        weight: "bold" as const,
      },
      bodyFont: {
        size: 14,
      },
      callbacks: {
        label: (context: any) => {
          const value = context.parsed;
          const percentage = ((value / total.value) * 100).toFixed(1);
          return `${value.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  },
}));

const handleClick = (event: any) => {
  const chart = (event.target as any)?.$data?._chart;
  if (!chart) return;

  const points = chart.getElementsAtEventForMode(
    event.native,
    "nearest",
    { intersect: true },
    true,
  );

  if (points.length > 0) {
    const firstPoint = points[0];
    const label = props.labels[firstPoint.index];
    const value = props.data[firstPoint.index];
    const percentage = (value / total.value) * 100;

    emit("segment-click", {
      label,
      value,
      index: firstPoint.index,
      percentage,
    });
  }
};
</script>
