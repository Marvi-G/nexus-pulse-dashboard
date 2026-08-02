<template>
  <ClientOnly>
    <div class="w-full" :style="{ height: height + 'px' }">
      <Bar :data="chartData" :options="chartOptions" @click="handleClick" />
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
} from "chart.js";
import { Bar } from "vue-chartjs";

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

const emit = defineEmits<{
  (
    e: "bar-click",
    data: { label: string; value: number; datasetIndex: number; index: number },
  ): void;
}>();

const { isDark } = useTheme();

const defaultColors = [
  "rgb(99, 102, 241)",
  "rgb(139, 92, 246)",
  "rgb(167, 139, 250)",
  "rgb(196, 181, 253)",
  "rgb(129, 140, 248)",
  "rgb(165, 180, 252)",
];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((ds, i) => ({
    ...ds,
    backgroundColor:
      ds.backgroundColor || defaultColors[i % defaultColors.length],
    borderRadius: ds.borderRadius ?? 8,
    borderSkipped: false,
    maxBarThickness: 48,
    hoverBackgroundColor: ds.backgroundColor
      ? Array.isArray(ds.backgroundColor)
        ? ds.backgroundColor.map((c) =>
            c.replace("rgb", "rgba").replace(")", ", 0.8)"),
          )
        : ds.backgroundColor.replace("rgb", "rgba").replace(")", ", 0.8)")
      : defaultColors[i % defaultColors.length]
          .replace("rgb", "rgba")
          .replace(")", ", 0.8)"),
  })),
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 800,
    easing: "easeInOutQuart" as const,
  },
  indexAxis: props.horizontal ? ("y" as const) : ("x" as const),
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
      displayColors: false,
      titleFont: {
        size: 13,
        weight: "bold" as const,
      },
      bodyFont: {
        size: 14,
      },
      callbacks: {
        label: (context: any) => {
          const value = context.parsed[props.horizontal ? "x" : "y"];
          return `${context.dataset.label}: ${value.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: props.horizontal,
        color: isDark.value
          ? "rgba(148, 163, 184, 0.06)"
          : "rgba(148, 163, 184, 0.1)",
      },
      ticks: {
        color: isDark.value ? "#64748b" : "#94a3b8",
        font: { size: 12 },
      },
      border: { display: false },
    },
    y: {
      grid: {
        display: !props.horizontal,
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

    emit("bar-click", {
      label,
      value,
      datasetIndex: firstPoint.datasetIndex,
      index: firstPoint.index,
    });
  }
};
</script>
