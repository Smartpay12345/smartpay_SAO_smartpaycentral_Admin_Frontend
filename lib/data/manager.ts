import type {Manager} from '@/lib/types/manager'


export const MOCK_MANAGERS: Manager[] = [
  {
    id: "MGR-8492",
    name: "Rukayat Akorede",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    email: "Akorede1012@gmail.com",
    phone: "+234 7033303853",
    serviceYears: "3 Years 7 Months",
    started: "20 Aug 2019",
    assignedStation: "Sanyo",
    stationId: "SAO 2123",
    homeAddress: "Sanyo bus stop, Ibadan Oyo State",
    lastActive: "20 Minutes Ago",
    totalSales: "₦125.4m",
    totalRevenue: "₦12.5m",
    status: "active",
    staffs: [
      { id: "1", name: "Pristia Candra", email: "tecan@upixel.com", phone: "08092139441", role: "Sales Point Staff", dateJoined: "01 Mar 2023", status: "Active" },
      { id: "2", name: "Adejuyigbe Kenny", email: "kscan@upixel.com", phone: "08092139441", role: "Sales Point Staff", dateJoined: "01 Mar 2023", status: "Suspended" },
      { id: "3", name: "Olorunfemi Femi", email: "ofemi@upixel.com", phone: "08092139441", role: "Sales Point Staff", dateJoined: "01 Mar 2023", status: "Active" },
      { id: "4", name: "Sadie Clower", email: "clowssade1@unpixel.com", phone: "08092139441", role: "Sales Point Staff", dateJoined: "01 Mar 2023", status: "Active" },
      { id: "5", name: "Pristia Candra", email: "tecan@upixel.com", phone: "08092139441", role: "Sales Point Staff", dateJoined: "01 Mar 2023", status: "Suspended" },
      { id: "6", name: "Pristia Candra", email: "tecan@upixel.com", phone: "08092139441", role: "Sales Point Staff", dateJoined: "01 Mar 2023", status: "Active" },
    ],
  },
  {
    id: "MGR-8493",
    name: "Oluwaseun Adebayo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    email: "seun.ade@gmail.com",
    phone: "+234 8031122334",
    serviceYears: "2 Years 4 Months",
    started: "12 Jan 2021",
    assignedStation: "Bodija",
    status: "suspended",
    stationId: "SAO 4102",
    homeAddress: "Bodija Market, Ibadan Oyo State",
    lastActive: "1 Hour Ago",
    totalSales: "₦98.2m",
    totalRevenue: "₦9.1m",
    staffs: [
      { id: "1", name: "Ibrahim Musa", email: "ibrahim@upixel.com", phone: "08031112222", role: "Sales Point Staff", dateJoined: "15 Feb 2023", status: "Active" },
      { id: "2", name: "Grace Effiong", email: "grace@upixel.com", phone: "08043334444", role: "Sales Point Staff", dateJoined: "20 Mar 2023", status: "Active" },
    ],
  },
  // Add more managers as needed
];