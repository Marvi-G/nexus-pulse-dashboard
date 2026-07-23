export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  avatar?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}
