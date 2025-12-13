export interface Company {
  id: string;
  name: string;
  website: string;
  industry: string;
  status: 'Active' | 'Blacklisted';
  registrationStatus: 'Submitted' | 'Pending';
  poc: string;
  hr: {
    name: string;
    phone: string;
    email: string;
  };
}

export const companies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    website: 'https://techcorp.com',
    industry: 'Information Technology',
    status: 'Active',
    registrationStatus: 'Submitted',
    poc: 'Aniket',
    hr: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@techcorp.com',
    },
  },
  {
    id: '2',
    name: 'FinanceHub Inc.',
    website: 'https://financehub.com',
    industry: 'Financial Services',
    status: 'Active',
    registrationStatus: 'Pending',
    poc: 'Aniket',
    hr: {
      name: 'Michael Chen',
      phone: '+1 (555) 234-5678',
      email: 'michael.chen@financehub.com',
    },
  },
  {
    id: '3',
    name: 'GreenEnergy Ltd.',
    website: 'https://greenenergy.com',
    industry: 'Renewable Energy',
    status: 'Blacklisted',
    registrationStatus: 'Submitted',
    poc: 'Aniket',
    hr: {
      name: 'Emily Davis',
      phone: '+1 (555) 345-6789',
      email: 'emily.davis@greenenergy.com',
    },
  },
  {
    id: '4',
    name: 'MediCare Plus',
    website: 'https://medicareplus.com',
    industry: 'Healthcare',
    status: 'Active',
    registrationStatus: 'Submitted',
    poc: 'Other Staff',
    hr: {
      name: 'Robert Wilson',
      phone: '+1 (555) 456-7890',
      email: 'robert.wilson@medicareplus.com',
    },
  },
  {
    id: '5',
    name: 'BuildRight Construction',
    website: 'https://buildright.com',
    industry: 'Construction',
    status: 'Active',
    registrationStatus: 'Pending',
    poc: 'Other Staff',
    hr: {
      name: 'Amanda Lee',
      phone: '+1 (555) 567-8901',
      email: 'amanda.lee@buildright.com',
    },
  },
];
