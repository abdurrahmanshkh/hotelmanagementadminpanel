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
      keywords: ['breakfast', 'food', 'timing', 'morning', 'buffet', 'eat'],
      answer: 'Complimentary breakfast buffet is served daily at The Grand Dining Hall on Level 1 from 7:00 AM to 10:30 AM.'
    },
    {
      keywords: ['wifi', 'wi-fi', 'internet', 'password', 'connect', 'network'],
      answer: "Complimentary high-speed fiber Wi-Fi is available across the resort. Network: 'SmartStay-Guest'. Password: Your room number + last 4 digits of your mobile number."
    },
    {
      keywords: ['checkout', 'check out', 'timing', 'leave', 'departure', 'express checkout'],
      answer: 'Standard check-out time is 11:00 AM. Late check-out (up to 2:00 PM) can be requested under Service Requests on your account dashboard.'
    },
    {
      keywords: ['checkin', 'check in', 'timing', 'arrive', 'arrival', 'early check in'],
      answer: 'Standard check-in starts at 2:00 PM (14:00). Early check-in is subject to room availability. You can store your luggage at the bell desk anytime.'
    },
    {
      keywords: ['passcode', 'key', 'door', 'lock', 'access', 'pin', 'keycode'],
      answer: "Your 6-digit room door passcode is available on your Account Dashboard under 'My Passcode' once your booking is checked in."
    },
    {
      keywords: ['pool', 'swimming', 'infinity pool', 'towel', 'pool hours'],
      answer: 'Our Rooftop Infinity Pool is open daily from 6:00 AM to 10:00 PM on the 5th floor. Fresh pool towels are provided at the poolside desk.'
    },
    {
      keywords: ['gym', 'fitness', 'workout', 'exercise', 'weights'],
      answer: 'The Fitness Center on Level 2 is open 24/7. Access is complimentary using your room door passcode.'
    },
    {
      keywords: ['spa', 'massage', 'wellness', 'sauna', 'jacuzzi', 'treatment'],
      answer: 'The Serenity Spa & Sauna on Level 3 is open daily from 9:00 AM to 9:00 PM. Reservations can be made at the front desk or via Service Requests.'
    },
    {
      keywords: ['room service', 'in room dining', 'dinner', 'order food', 'menu'],
      answer: '24/7 In-Room Dining is available. You can view the digital menu and place orders by contacting the front desk or submitting a Service Request.'
    },
    {
      keywords: ['restaurant', 'dining', 'bar', 'cocktail', 'rooftop bar'],
      answer: 'The Sunset Rooftop Lounge & Cocktail Bar operates from 4:00 PM to 12:00 AM midnight. Table reservations can be booked through Concierge.'
    },
    {
      keywords: ['parking', 'valet', "car", 'vehicle', 'ev charger', 'electric car'],
      answer: 'Complimentary covered parking & 24/7 valet service are available for all registered guests. Universal EV fast chargers are located on Basement Level B1.'
    },
    {
      keywords: ['shuttle', 'airport', 'pickup', 'drop', 'transfer', 'taxi', 'cab'],
      answer: 'Complimentary airport shuttle service runs every 2 hours between 6:00 AM and 10:00 PM. Private luxury transfers can be booked 24 hours in advance.'
    },
    {
      keywords: ['housekeeping', 'towels', 'cleaning', 'linen', 'pillows', 'blanket', 'toiletries'],
      answer: 'Daily housekeeping service is conducted between 10:00 AM and 4:00 PM. For instant towel refills or extra pillows, submit a request via Service Requests.'
    },
    {
      keywords: ['pet', 'pets', 'dog', 'cat', 'animal', 'pet friendly'],
      answer: 'SmartStay offers dedicated pet-friendly garden suites (pets up to 15 kg). A one-time deep cleaning fee of ₹1,500 applies per stay.'
    },
    {
      keywords: ['smoking', 'cigarette', 'vape', 'smoke', 'balcony'],
      answer: 'SmartStay is a 100% non-smoking indoor resort. Designated outdoor smoking lounges are available near the East Garden and Rooftop Lounge.'
    },
    {
      keywords: ['luggage', 'bags', 'baggage', 'store', 'bellhop', 'bellboy'],
      answer: 'Complimentary luggage storage is available at the Front Desk Bell Counter 24/7 before check-in or after check-out.'
    },
    {
      keywords: ['emergency', 'doctor', 'medical', 'first aid', 'ambulance', 'hospital'],
      answer: "In case of medical emergency, an on-call physician is available 24/7. Press '0' on your room phone or contact Front Desk staff immediately."
    },
    {
      keywords: ['kids', 'children', 'babysitting', 'play area', 'kids club'],
      answer: 'The Little Explorers Kids Club & Play Zone on Level 1 is open daily from 9:00 AM to 6:00 PM for children aged 3-12.'
    },
    {
      keywords: ['laundry', 'dry cleaning', 'iron', 'ironing', 'wash'],
      answer: 'Same-day laundry and dry-cleaning services are available. Submit laundry bags before 10:00 AM for return by 6:00 PM.'
    },
    {
      keywords: ['payment', 'credit card', 'upi', 'cash', 'invoice', 'receipt', 'bill'],
      answer: 'We accept Credit/Debit cards (Visa, Mastercard, Amex), UPI/GPay, and NetBanking. Digital receipts and invoices are available under Account -> My Bookings.'
    },
    {
      keywords: ['staff', 'admin', 'human', 'reception', 'front desk', 'agent', 'escalate', 'help'],
      answer: "I am connecting you to our 24/7 Front Desk Concierge staff. Click 'Escalate to Front Desk Staff' to chat directly with a team member."
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
