import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {EventService} from '../../shared/services/events.service';
import {CategoriesService} from '../../shared/services/categories.service';
import {MHAEvent} from '../../shared/models/event.model';
import {Category} from '../../shared/models/category.model';

@Component({
  selector: 'mha-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  event: MHAEvent;
  category: Category;

  isLoaded = false;
  sub1: Subscription;

  constructor( private route: ActivatedRoute,
               private eventService: EventService,
               private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.sub1 = this.route.params
      .mergeMap((params: Params) => this.eventService.getEventById(params['id']))
      .mergeMap((event: MHAEvent) => {
      this.event = event;
      return this.categoriesService.getCategoryById(event.category);
      })
      .subscribe((category: Category) => {
      this.category = category;
      this.isLoaded = true;
      });
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

}
