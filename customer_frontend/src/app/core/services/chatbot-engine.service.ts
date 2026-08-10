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

  private defaultKnowledge: KnowledgeItem[] = [
    {
      keywords: ['wifi', 'wi-fi', 'internet', 'password'],
      answer: 'Complimentary high-speed fiber Wi-Fi is available across the resort. Network: SmartStay_Guest (No password required; authenticate with room number).'
    },
    {
      keywords: ['breakfast', 'timing', 'food', 'buffet', 'dining'],
      answer: 'Breakfast buffet is served daily at The Grand Palm Restaurant on Level 1 from 7:00 AM to 10:30 AM.'
    },
    {
      keywords: ['checkin', 'check-in', 'check in', 'time'],
      answer: 'Standard check-in time is 2:00 PM (14:00). You can unlock your room door using your digital 6-digit passcode as soon as check-in opens.'
    },
    {
      keywords: ['checkout', 'check-out', 'check out'],
      answer: 'Standard check-out time is 11:00 AM. You can express check-out directly via your mobile customer portal.'
    },
    {
      keywords: ['key', 'passcode', 'unlock', 'door', 'code'],
      answer: 'Your 6-digit room passcode is visible under My Reservations -> View Digital Door Keycode. Enter the PIN on your room door keypad to unlock.'
    },
    {
      keywords: ['pool', 'spa', 'gym', 'pool hours'],
      answer: 'The Infinity Pool & Luxury Spa on the Roof Deck are open daily from 6:00 AM to 10:00 PM.'
    },
    {
      keywords: ['staff', 'admin', 'human', 'reception', 'front desk', 'help'],
      answer: 'I can connect you directly to our Front Desk Concierge staff. Click "Connect to Front Desk Staff" below.'
    }
  ];

  public loadKnowledge(): Observable<KnowledgeItem[]> {
    if (this.isLoaded && this.knowledgeBase.length > 0) {
      return of(this.knowledgeBase);
    }

    return this.http.get<KnowledgeItem[]>('assets/mock-data/chatbot-knowledge.json').pipe(
      map(items => {
        this.knowledgeBase = (items && Array.isArray(items) && items.length > 0) ? items : this.defaultKnowledge;
        this.isLoaded = true;
        return this.knowledgeBase;
      }),
      catchError(() => {
        this.knowledgeBase = this.defaultKnowledge;
        this.isLoaded = true;
        return of(this.defaultKnowledge);
      })
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

        if (bestMatch && highestSim >= 0.4) {
          return {
            answer: bestMatch.answer,
            matched: true,
            confidence: highestSim
          };
        }

        return {
          answer: "I'm sorry, I didn't quite catch that. You can ask me about Wi-Fi, breakfast hours, pool timings, or click below to speak directly with front desk staff.",
          matched: false,
          confidence: 0,
          shouldSuggestEscalation: true
        };
      })
    );
  }
}
