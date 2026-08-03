import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type AuditActionType = 'login' | 'create' | 'update' | 'delete' | 'export' | 'system';

export interface AuditLogEntry {
    id: number;
    timestamp: string;
    user: string;
    action: AuditActionType;
    resource: string;
    details: string;
    ipAddress: string;
    status: 'success' | 'failed';
    metadata?: Record<string, any>;
}

export const useAuditLogStore = defineStore('auditLog', () => {
    const logs = ref<AuditLogEntry[]>([
        {
            id: 1,
            timestamp: '2024-01-29T10:30:00Z',
            user: 'Emma Smith',
            action: 'login',
            resource: 'Authentication',
            details: 'Successful login from Chrome on Windows',
            ipAddress: '192.168.1.100',
            status: 'success',
            metadata: { browser: 'Chrome', os: 'Windows', location: 'New York, US' },
        },
        {
            id: 2,
            timestamp: '2024-01-29T10:25:00Z',
            user: 'John Doe',
            action: 'create',
            resource: 'User',
            details: 'Created new user account for Mike Wilson',
            ipAddress: '192.168.1.101',
            status: 'success',
            metadata: { userId: 1234, role: 'Editor' },
        },
        {
            id: 3,
            timestamp: '2024-01-29T10:20:00Z',
            user: 'Sarah Johnson',
            action: 'update',
            resource: 'Product',
            details: 'Updated product "Wireless Headphones" - changed price from $299 to $279',
            ipAddress: '192.168.1.102',
            status: 'success',
            metadata: { productId: 567, field: 'price', oldValue: 299, newValue: 279 },
        },
        {
            id: 4,
            timestamp: '2024-01-29T10:15:00Z',
            user: 'Mike Wilson',
            action: 'delete',
            resource: 'Order',
            details: 'Deleted order #ORD-2024-0892',
            ipAddress: '192.168.1.103',
            status: 'success',
            metadata: { orderId: 'ORD-2024-0892', reason: 'Customer request' },
        },
        {
            id: 5,
            timestamp: '2024-01-29T10:10:00Z',
            user: 'System',
            action: 'system',
            resource: 'Database',
            details: 'Automated backup completed successfully',
            ipAddress: '10.0.0.1',
            status: 'success',
            metadata: { backupSize: '2.4 GB', duration: '5m 23s' },
        },
        {
            id: 6,
            timestamp: '2024-01-29T10:05:00Z',
            user: 'Lisa Brown',
            action: 'export',
            resource: 'Reports',
            details: 'Exported Q4 Sales Report to CSV',
            ipAddress: '192.168.1.104',
            status: 'success',
            metadata: { reportId: 456, format: 'CSV', rows: 1234 },
        },
        {
            id: 7,
            timestamp: '2024-01-29T10:00:00Z',
            user: 'David Lee',
            action: 'login',
            resource: 'Authentication',
            details: 'Failed login attempt - invalid password',
            ipAddress: '203.0.113.42',
            status: 'failed',
            metadata: { attempts: 3, reason: 'Invalid credentials' },
        },
        {
            id: 8,
            timestamp: '2024-01-29T09:55:00Z',
            user: 'Amy Chen',
            action: 'update',
            resource: 'Settings',
            details: 'Updated notification preferences',
            ipAddress: '192.168.1.105',
            status: 'success',
            metadata: { setting: 'emailNotifications', value: true },
        },
        {
            id: 9,
            timestamp: '2024-01-29T09:50:00Z',
            user: 'Tom Harris',
            action: 'create',
            resource: 'Report',
            details: 'Generated new analytics report "Monthly Summary"',
            ipAddress: '192.168.1.106',
            status: 'success',
            metadata: { reportType: 'analytics', period: 'January 2024' },
        },
        {
            id: 10,
            timestamp: '2024-01-29T09:45:00Z',
            user: 'Emma Smith',
            action: 'update',
            resource: 'User',
            details: 'Updated user profile - changed email address',
            ipAddress: '192.168.1.100',
            status: 'success',
            metadata: { userId: 1, field: 'email', oldValue: 'emma@old.com', newValue: 'emma@new.com' },
        },
        {
            id: 11,
            timestamp: '2024-01-29T09:40:00Z',
            user: 'System',
            action: 'system',
            resource: 'API',
            details: 'Rate limit exceeded for IP 203.0.113.42',
            ipAddress: '203.0.113.42',
            status: 'failed',
            metadata: { endpoint: '/api/users', limit: 100, window: '1m' },
        },
        {
            id: 12,
            timestamp: '2024-01-29T09:35:00Z',
            user: 'John Doe',
            action: 'delete',
            resource: 'Product',
            details: 'Deleted product "Old Widget" from catalog',
            ipAddress: '192.168.1.101',
            status: 'success',
            metadata: { productId: 789, reason: 'Discontinued' },
        },
    ]);

    const dateRange = ref<'today' | 'week' | 'month' | 'all'>('all');
    const userFilter = ref('all');
    const actionFilter = ref<'all' | AuditActionType>('all');
    const searchQuery = ref('');

    const filteredLogs = computed(() => {
        let result = [...logs.value];

        // Date range filter
        if (dateRange.value !== 'all') {
            const now = new Date();
            const cutoff = new Date();

            if (dateRange.value === 'today') {
                cutoff.setHours(0, 0, 0, 0);
            } else if (dateRange.value === 'week') {
                cutoff.setDate(now.getDate() - 7);
            } else if (dateRange.value === 'month') {
                cutoff.setMonth(now.getMonth() - 1);
            }

            result = result.filter((log) => new Date(log.timestamp) >= cutoff);
        }

        // User filter
        if (userFilter.value !== 'all') {
            result = result.filter((log) => log.user === userFilter.value);
        }

        // Action type filter
        if (actionFilter.value !== 'all') {
            result = result.filter((log) => log.action === actionFilter.value);
        }

        // Search
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            result = result.filter(
                (log) =>
                    log.user.toLowerCase().includes(query) ||
                    log.resource.toLowerCase().includes(query) ||
                    log.details.toLowerCase().includes(query) ||
                    log.ipAddress.includes(query)
            );
        }

        return result;
    });

    const uniqueUsers = computed(() => {
        const users = new Set(logs.value.map((log) => log.user));
        return ['all', ...Array.from(users)];
    });

    const counts = computed(() => ({
        total: logs.value.length,
        success: logs.value.filter((log) => log.status === 'success').length,
        failed: logs.value.filter((log) => log.status === 'failed').length,
    }));

    function setDateRange(range: 'today' | 'week' | 'month' | 'all') {
        dateRange.value = range;
    }

    function setUserFilter(user: string) {
        userFilter.value = user;
    }

    function setActionFilter(action: 'all' | AuditActionType) {
        actionFilter.value = action;
    }

    function setSearchQuery(query: string) {
        searchQuery.value = query;
    }

    function clearFilters() {
        dateRange.value = 'all';
        userFilter.value = 'all';
        actionFilter.value = 'all';
        searchQuery.value = '';
    }

    return {
        logs,
        dateRange,
        userFilter,
        actionFilter,
        searchQuery,
        filteredLogs,
        uniqueUsers,
        counts,
        setDateRange,
        setUserFilter,
        setActionFilter,
        setSearchQuery,
        clearFilters,
    };
});