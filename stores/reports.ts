import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type ReportStatus = 'pending' | 'completed' | 'failed';
export type ReportType = 'sales' | 'analytics' | 'users' | 'financial' | 'inventory';

export interface Report {
    id: number;
    name: string;
    type: ReportType;
    status: ReportStatus;
    createdAt: string;
    completedAt?: string;
    size: string;
    generatedBy: string;
}

export const useReportsStore = defineStore('reports', () => {
    const reports = ref<Report[]>([
        {
            id: 1,
            name: 'Q4 Sales Report 2024',
            type: 'sales',
            status: 'completed',
            createdAt: '2024-01-29T10:30:00Z',
            completedAt: '2024-01-29T10:32:00Z',
            size: '2.4 MB',
            generatedBy: 'Emma Smith',
        },
        {
            id: 2,
            name: 'Monthly Analytics Summary',
            type: 'analytics',
            status: 'completed',
            createdAt: '2024-01-28T08:00:00Z',
            completedAt: '2024-01-28T08:05:00Z',
            size: '5.1 MB',
            generatedBy: 'System',
        },
        {
            id: 3,
            name: 'User Growth Report - January',
            type: 'users',
            status: 'pending',
            createdAt: '2024-01-29T09:15:00Z',
            size: '-',
            generatedBy: 'John Doe',
        },
        {
            id: 4,
            name: 'Financial Statement Q4',
            type: 'financial',
            status: 'completed',
            createdAt: '2024-01-27T14:20:00Z',
            completedAt: '2024-01-27T14:28:00Z',
            size: '3.8 MB',
            generatedBy: 'Sarah Johnson',
        },
        {
            id: 5,
            name: 'Inventory Audit Report',
            type: 'inventory',
            status: 'failed',
            createdAt: '2024-01-26T11:45:00Z',
            size: '-',
            generatedBy: 'Mike Wilson',
        },
        {
            id: 6,
            name: 'Weekly Sales Performance',
            type: 'sales',
            status: 'completed',
            createdAt: '2024-01-25T09:00:00Z',
            completedAt: '2024-01-25T09:03:00Z',
            size: '1.2 MB',
            generatedBy: 'System',
        },
        {
            id: 7,
            name: 'Customer Retention Analysis',
            type: 'analytics',
            status: 'completed',
            createdAt: '2024-01-24T16:30:00Z',
            completedAt: '2024-01-24T16:35:00Z',
            size: '4.5 MB',
            generatedBy: 'Lisa Brown',
        },
        {
            id: 8,
            name: 'Revenue Forecast 2024',
            type: 'financial',
            status: 'pending',
            createdAt: '2024-01-29T11:00:00Z',
            size: '-',
            generatedBy: 'Emma Smith',
        },
        {
            id: 9,
            name: 'Product Performance Report',
            type: 'inventory',
            status: 'completed',
            createdAt: '2024-01-23T10:15:00Z',
            completedAt: '2024-01-23T10:18:00Z',
            size: '2.9 MB',
            generatedBy: 'System',
        },
        {
            id: 10,
            name: 'User Activity Log - December',
            type: 'users',
            status: 'completed',
            createdAt: '2024-01-22T08:30:00Z',
            completedAt: '2024-01-22T08:34:00Z',
            size: '6.2 MB',
            generatedBy: 'John Doe',
        },
        {
            id: 11,
            name: 'Monthly Revenue Breakdown',
            type: 'sales',
            status: 'completed',
            createdAt: '2024-01-21T09:45:00Z',
            completedAt: '2024-01-21T09:48:00Z',
            size: '1.8 MB',
            generatedBy: 'Sarah Johnson',
        },
        {
            id: 12,
            name: 'Traffic Source Analysis',
            type: 'analytics',
            status: 'failed',
            createdAt: '2024-01-20T14:00:00Z',
            size: '-',
            generatedBy: 'System',
        },
    ]);

    const statusFilter = ref<'all' | ReportStatus>('all');
    const typeFilter = ref<'all' | ReportType>('all');
    const searchQuery = ref('');

    const filteredReports = computed(() => {
        let result = [...reports.value];

        if (statusFilter.value !== 'all') {
            result = result.filter((r) => r.status === statusFilter.value);
        }

        if (typeFilter.value !== 'all') {
            result = result.filter((r) => r.type === typeFilter.value);
        }

        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            result = result.filter(
                (r) =>
                    r.name.toLowerCase().includes(query) ||
                    r.generatedBy.toLowerCase().includes(query)
            );
        }

        return result;
    });

    const counts = computed(() => ({
        all: reports.value.length,
        pending: reports.value.filter((r) => r.status === 'pending').length,
        completed: reports.value.filter((r) => r.status === 'completed').length,
        failed: reports.value.filter((r) => r.status === 'failed').length,
    }));

    function setStatusFilter(status: 'all' | ReportStatus) {
        statusFilter.value = status;
    }

    function setTypeFilter(type: 'all' | ReportType) {
        typeFilter.value = type;
    }

    function setSearchQuery(query: string) {
        searchQuery.value = query;
    }

    function deleteReport(id: number) {
        reports.value = reports.value.filter((r) => r.id !== id);
    }

    function retryReport(id: number) {
        const report = reports.value.find((r) => r.id === id);
        if (report && report.status === 'failed') {
            report.status = 'pending';
            report.createdAt = new Date().toISOString();
        }
    }

    return {
        reports,
        statusFilter,
        typeFilter,
        searchQuery,
        filteredReports,
        counts,
        setStatusFilter,
        setTypeFilter,
        setSearchQuery,
        deleteReport,
        retryReport,
    };
});