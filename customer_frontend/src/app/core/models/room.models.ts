export type RoomStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'OCCUPIED'
  | 'UNDER_CLEANING'
  | 'MAINTENANCE';

export interface RoomType {
  id: number;
  name: string;
  code: string;
  description: string;
  basePrice: number;
  minimumPrice: number;
  maximumPrice: number;
  maximumAdults: number;
  maximumChildren: number;
  bedType: string;
  roomSizeSqft: number;
  active: boolean;
}

export interface RoomImage {
  url: string;
  altText: string;
  displayOrder: number;
}

export interface Room {
  id: number;
  publicId: string;
  roomNumber: string;
  roomType: RoomType;
  floorNumber: number;
  status: RoomStatus;
  description: string;
  basePrice: number;
  currentPrice: number;
  currency: string;
  maximumAdults: number;
  maximumChildren: number;
  rating: number;
  amenities: string[];
  images: RoomImage[];
  featured: boolean;
  active: boolean;
}

export interface RoomSearchFilters {
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  children?: number;
  roomTypeId?: number;
  minPrice?: number;
  maxPrice?: number;
  bedType?: string;
  amenities?: string[];
  minRating?: number;
  sortBy?: 'RECOMMENDED' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING' | 'CAPACITY';
}

export interface AvailabilityRequest {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomTypeId?: number;
}

export interface RoomAvailabilityResult {
  room: Room;
  available: boolean;
  nightlyPrice: number;
  totalPriceForStay: number;
}
