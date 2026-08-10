export type ServiceRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ServicePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ServiceRequest {
  id: number;
  referenceNumber: string;
  bookingId: number;
  bookingReference: string;
  roomId: number;
  roomNumber: string;
  userId: number;
  guestName: string;
  category: string;
  title: string;
  description: string;
  priority: ServicePriority;
  status: ServiceRequestStatus;
  assignedStaffId?: number;
  assignedStaffName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequestInput {
  bookingId: number;
  category: string;
  title: string;
  description: string;
  priority?: ServicePriority;
}
