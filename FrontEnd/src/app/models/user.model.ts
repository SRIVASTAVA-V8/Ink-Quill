export interface UserAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  address?: UserAddress;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}