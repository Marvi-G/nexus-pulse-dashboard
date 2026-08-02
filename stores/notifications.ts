import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type NotificationType = 'mention' | 'update' | 'alert' | 'system';

export interface Notification {
    id: number;
    title: string;
    description: string;
    type: NotificationType;
    read: boolean;
    timestamp: string;
    user?: string;
    action?: string;
}

export const useNotificationsStore = defineStore('notifications', () => {
    const notifications = ref<Notification[]>([
        {
            id: 1,
            title: 'Emma Smith mentioned you',
            description: 'in the discussion about Q4 revenue targets',
            type: 'mention',
            read: false,
            timestamp: '2024-01-29T10:30:00Z',
            user: 'Emma Smith',
        },
        {
            id: 2,
            title: 'New order #1234 received',
            description: 'Order worth $2,450 from John Doe has been placed',
            type: 'update',
            read: false,
            timestamp: '2024-01-29T09:45:00Z',
        },
        {
            id: 3,
            title: 'Server CPU usage high',
            description: 'CPU usage exceeded 90% threshold on production server',
            type: 'alert',
            read: false,
            timestamp: '2024-01-29T09:15:00Z',
        },
        {
            id: 4,
            title: 'Weekly report ready',
            description: 'Your weekly analytics report is ready to view',
            type: 'system',
            read: true,
            timestamp: '2024-01-29T08:00:00Z',
        },
        {
            id: 5,
            title: 'John Doe commented on your task',
            description: '"Great work on the dashboard redesign!"',
            type: 'mention',
            read: false,
            timestamp: '2024-01-28T16:20:00Z',
            user: 'John Doe',
        },
        {
            id: 6,
            title: 'Payment failed',
            description: 'Payment for invoice #INV-2024-001 could not be processed',
            type: 'alert',
            read: false,
            timestamp: '2024-01-28T14:30:00Z',
        },
        {
            id: 7,
            title: 'New team member joined',
            description: 'Sarah Johnson has joined the Marketing team',
            type: 'update',
            read: true,
            timestamp: '2024-01-28T11:00:00Z',
        },
        {
            id: 8,
            title: 'Database backup completed',
            description: 'Automated backup finished successfully',
            type: 'system',
            read: true,
            timestamp: '2024-01-28T03:00:00Z',
        },
        {
            id: 9,
            title: 'Mike Wilson requested access',
            description: 'Mike Wilson is requesting access to the Analytics module',
            type: 'update',
            read: false,
            timestamp: '2024-01-27T15:45:00Z',
            user: 'Mike Wilson',
        },
        {
            id: 10,
            title: 'SSL certificate expiring soon',
            description: 'SSL certificate for api.example.com expires in 7 days',
            type: 'alert',
            read: false,
            timestamp: '2024-01-27T10:00:00Z',
        },
        {
            id: 11,
            title: 'Lisa Brown mentioned you',
            description: 'in a comment on the product launch plan',
            type: 'mention',
            read: true,
            timestamp: '2024-01-27T09:30:00Z',
            user: 'Lisa Brown',
        },
        {
            id: 12,
            title: 'System maintenance scheduled',
            description: 'Maintenance window: Jan 30, 2:00 AM - 4:00 AM UTC',
            type: 'system',
            read: true,
            timestamp: '2024-01-26T14:00:00Z',
        },
    ]);

    const filter = ref<'all' | NotificationType>('all');
    const showUnreadOnly = ref(false);

    const filteredNotifications = computed(() => {
        let result = [...notifications.value];

        if (filter.value !== 'all') {
            result = result.filter((n) => n.type === filter.value);
        }

        if (showUnreadOnly.value) {
            result = result.filter((n) => !n.read);
        }

        return result;
    });

    const unreadCount = computed(() =>
        notifications.value.filter((n) => !n.read).length
    );

    const counts = computed(() => ({
        all: notifications.value.length,
        mention: notifications.value.filter((n) => n.type === 'mention').length,
        update: notifications.value.filter((n) => n.type === 'update').length,
        alert: notifications.value.filter((n) => n.type === 'alert').length,
        system: notifications.value.filter((n) => n.type === 'system').length,
    }));

    function markAsRead(id: number) {
        const notification = notifications.value.find((n) => n.id === id);
        if (notification) {
            notification.read = true;
        }
    }

    function markAsUnread(id: number) {
        const notification = notifications.value.find((n) => n.id === id);
        if (notification) {
            notification.read = false;
        }
    }

    function deleteNotification(id: number) {
        notifications.value = notifications.value.filter((n) => n.id !== id);
    }

    function markAllAsRead() {
        notifications.value.forEach((n) => {
            n.read = true;
        });
    }

    function setFilter(newFilter: 'all' | NotificationType) {
        filter.value = newFilter;
    }

    function toggleUnreadOnly() {
        showUnreadOnly.value = !showUnreadOnly.value;
    }

    return {
        notifications,
        filter,
        showUnreadOnly,
        filteredNotifications,
        unreadCount,
        counts,
        markAsRead,
        markAsUnread,
        deleteNotification,
        markAllAsRead,
        setFilter,
        toggleUnreadOnly,
    };
});