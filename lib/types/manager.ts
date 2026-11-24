interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  dateJoined: string;
  status: "Active" | "Suspended";
}

export interface Manager {
  id?: string;
  name?: string;
  avatar?: string;
  avatarUrl?: string
   managerId?: string
  email?: string;
  phone?: string;
  serviceYears?: string;
  started?: string;
  assignedStation?: string;
  stationId?: string;
  homeAddress?: string;
  lastActive?: string;
  totalSales?: string;
  joinedYear?: string
  totalRevenue?: string;
   status: 'active' | 'suspended'
   location?: string
  yearsOfService?: number
  staffs: Staff[];
}