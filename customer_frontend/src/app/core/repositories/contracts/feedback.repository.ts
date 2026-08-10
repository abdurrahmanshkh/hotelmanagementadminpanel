import { Observable } from 'rxjs';
import { Feedback, SubmitFeedbackInput, ApiResponse } from '../../models';

export abstract class FeedbackRepository {
  abstract submitFeedback(input: SubmitFeedbackInput): Observable<ApiResponse<Feedback>>;
  abstract getFeedbackForRoom(roomNumber: string): Observable<ApiResponse<Feedback[]>>;
}
