<template>
  <ClientOnly>
    <div class="w-full" :style="{ height: height + 'px' }">
      <Line :data="chartData" :options="chartOptions" @click="handleClick" />
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
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface Props {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
});

const emit = defineEmits<{
  (
    e: "point-click",
    data: { label: string; value: number; datasetIndex: number },
  ): void;
}>();

const { isDark } = useTheme();

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((ds) => ({
    ...ds,
    borderColor: ds.borderColor || "rgb(99, 102, 241)",
    backgroundColor: ds.backgroundColor || "rgba(99, 102, 241, 0.08)",
    borderWidth: 2.5,
    pointRadius: 0,
    pointHoverRadius: 8,
    pointHoverBorderWidth: 3,
    pointHoverBackgroundColor: "rgb(99, 102, 241)",
    pointHoverBorderColor: "#fff",
    pointHoverBorderCapStyle: "round" as const,
    tension: 0.4,
    fill: true,
  })),
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 800,
    easing: "easeInOutQuart" as const,
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: isDark.value ? "#1e293b" : "#0f172a",
      titleColor: "#f1f5f9",
      bodyColor: "#cbd5e1",
      borderColor: isDark.value ? "#334155" : "#1e293b",
      borderWidth: 1,
      cornerRadius: 12,
      padding: 14,
      displayColors: false,
      titleFont: {
        size: 13,
        weight: "bold" as const,
      },
      bodyFont: {
        size: 14,
      },
      callbacks: {
        title: (context: any) => {
          return context[0].label;
        },
        label: (context: any) => {
          const value = context.parsed.y;
          return `${context.dataset.label}: ${value.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: isDark.value ? "#64748b" : "#94a3b8",
        font: { size: 12 },
        maxTicksLimit: 8,
      },
      border: { display: false },
    },
    y: {
      grid: {
        color: isDark.value
          ? "rgba(148, 163, 184, 0.06)"
          : "rgba(148, 163, 184, 0.1)",
      },
      ticks: {
        color: isDark.value ? "#64748b" : "#94a3b8",
        font: { size: 12 },
        callback: (value: any) => value.toLocaleString(),
      },
      border: { display: false },
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
    const value =
      props.datasets[firstPoint.datasetIndex].data[firstPoint.index];

    emit("point-click", {
      label,
      value,
      datasetIndex: firstPoint.datasetIndex,
    });
  }
};
</script>
