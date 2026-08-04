import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserProfile {
    name: string;
    email: string;
    role: string;
    avatar: string;
    bio: string;
    phone: string;
    location: string;
    timezone: string;
    language: string;
}

export const useProfileStore = defineStore('profile', () => {
    const profile = ref<UserProfile>({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Administrator',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        bio: 'Full-stack developer passionate about building great user experiences.',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
        language: 'English',
    });

    const notifications = ref({
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: false,
        securityAlerts: true,
    });

    const security = ref({
        twoFactorEnabled: false,
        lastPasswordChange: '2024-01-15',
        sessions: [
            {
                id: 1,
                device: 'Chrome on MacOS',
                location: 'San Francisco, US',
                lastActive: '2024-01-29T10:30:00Z',
                current: true,
            },
            {
                id: 2,
                device: 'Safari on iPhone',
                location: 'San Francisco, US',
                lastActive: '2024-01-28T15:45:00Z',
                current: false,
            },
        ],
    });

    function updateProfile(updates: Partial<UserProfile>) {
        profile.value = { ...profile.value, ...updates };
    }

    function updateNotifications(updates: Partial<typeof notifications.value>) {
        notifications.value = { ...notifications.value, ...updates };
    }

    function toggleTwoFactor() {
        security.value.twoFactorEnabled = !security.value.twoFactorEnabled;
    }

    function revokeSession(sessionId: number) {
        security.value.sessions = security.value.sessions.filter(
            (s) => s.id !== sessionId
        );
    }

    return {
        profile,
        notifications,
        security,
        updateProfile,
        updateNotifications,
        toggleTwoFactor,
        revokeSession,
    };
});