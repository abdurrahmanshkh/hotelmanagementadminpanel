export interface Feedback {
  id: number;
  bookingId: number;
  bookingReference: string;
  userId: number;
  guestName: string;
  roomNumber: string;
  rating: number; // 1 to 5
  cleanlinessRating?: number;
  serviceRating?: number;
  comfortRating?: number;
  comments: string;
  createdAt: string;
}

export interface SubmitFeedbackInput {
  bookingId: number;
  rating: number;
  cleanlinessRating?: number;
  serviceRating?: number;
  comfortRating?: number;
  comments: string;
}
