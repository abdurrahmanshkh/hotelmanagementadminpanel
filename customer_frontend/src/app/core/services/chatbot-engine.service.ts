import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { calculateSimilarity } from '../utilities/string-match.utils';

export interface KnowledgeItem {
  keywords: string[];
  answer: string;
}

export interface ChatbotResponse {
  answer: string;
  matched: boolean;
  confidence: number;
  shouldSuggestEscalation?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotEngineService {
  private http = inject(HttpClient);
  private knowledgeBase: KnowledgeItem[] = [];
  private isLoaded = false;

  public loadKnowledge(): Observable<KnowledgeItem[]> {
    if (this.isLoaded && this.knowledgeBase.length > 0) {
      return of(this.knowledgeBase);
    }

    return this.http.get<KnowledgeItem[]>('assets/mock-data/chatbot-knowledge.json').pipe(
      map(items => {
        this.knowledgeBase = items;
        this.isLoaded = true;
        return items;
      }),
      catchError(() => of([]))
    );
  }

  public query(userInput: string): Observable<ChatbotResponse> {
    return this.loadKnowledge().pipe(
      map(items => {
        const text = userInput.toLowerCase().trim();

        // 1. Direct Keyword Match
        for (const item of items) {
          if (item.keywords.some(k => text.includes(k.toLowerCase()))) {
            return {
              answer: item.answer,
              matched: true,
              confidence: 0.95
            };
          }
        }

        // 2. String Similarity Match
        let bestMatch: KnowledgeItem | null = null;
        let highestSim = 0;

        for (const item of items) {
          for (const kw of item.keywords) {
            const sim = calculateSimilarity(text, kw);
            if (sim > highestSim) {
              highestSim = sim;
              bestMatch = item;
            }
          }
        }

        if (bestMatch && highestSim > 0.4) {
          return {
            answer: bestMatch.answer,
            matched: true,
            confidence: highestSim
          };
        }

        // 3. Fallback answer offering escalation
        return {
          answer: `I couldn't find a direct match for your request. Would you like me to connect you with our Front Desk Concierge staff?`,
          matched: false,
          confidence: 0,
          shouldSuggestEscalation: true
        };
      })
    );
  }
}
