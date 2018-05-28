import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {BaseApi} from '../../../shared/core/base-api';
import {MHAEvent} from '../models/event.model';

@Injectable()

export class EventService extends BaseApi {
  constructor(public http: Http) {
    super(http);
  }

  addEvent(event: MHAEvent): Observable<MHAEvent> {
    return this.post('events', event);
  }

  getEvents(): Observable<MHAEvent[]> {
    return this.get('events');
  }

  getEventById(id: string): Observable<MHAEvent> {
    return this.get(`events/${id}`);
  }
}
