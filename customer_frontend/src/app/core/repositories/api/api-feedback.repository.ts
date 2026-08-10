import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackRepository } from '../contracts/feedback.repository';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { Feedback, SubmitFeedbackInput, ApiResponse } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiFeedbackRepository implements FeedbackRepository {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  submitFeedback(input: SubmitFeedbackInput): Observable<ApiResponse<Feedback>> {
    return this.http.post<ApiResponse<Feedback>>(`${this.baseUrl}${API_ENDPOINTS.FEEDBACK.SUBMIT}`, input);
  }

  getFeedbackForRoom(roomNumber: string): Observable<ApiResponse<Feedback[]>> {
    const params = new HttpParams().set('roomNumber', roomNumber);
    return this.http.get<ApiResponse<Feedback[]>>(`${this.baseUrl}${API_ENDPOINTS.FEEDBACK.SUBMIT}`, { params });
  }
}
