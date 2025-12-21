export interface SimpleStaff {
  id: number;
  name: string;
  imageURL: string | null;
  role: string;
  office: string;
  phone: string;
  email: string;
}

export interface Staff extends SimpleStaff {
  tasks: string[];
}
