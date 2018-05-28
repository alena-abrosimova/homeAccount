import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';
import {Subscription} from 'rxjs/Subscription';

import {Category} from '../../shared/models/category.model';
import {MHAEvent} from '../../shared/models/event.model';
import {EventService} from '../../shared/services/events.service';
import {BillService} from '../../shared/services/bill.service';
import {Bill} from '../../shared/models/bill.model';
import {Message} from '../../../shared/message.model';



@Component({
  selector: 'mha-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  sub2: Subscription;
  @Input() categories: Category[] = [];
  types = [
    {type: 'income', label: 'Доход'},
    {type: 'outcome', label: 'Расход'}
  ];

  message: Message;

  constructor(private eventService: EventService,
              private billService: BillService) { }

  ngOnInit() {
    this.message = new Message('', '');
  }

  private showMessage(type: string, text: string) {
    this.message.text = text;
    this.message.type = type;
    window.setTimeout(() => this.message.text = '', 5000);
  }

  onSubmit(form: NgForm) {

    const {description, category, type} = form.value;
    let {amount } = form.value;
    if (amount < 0)  {
      amount *= -1;
    }
    const event = new MHAEvent(
      type, amount, +category,
      moment().format('DD.MM.YYYY HH:mm:ss'), description
    );

    this.sub1 = this.billService.getBill().subscribe((bill: Bill) => {
      let value = 0;
      if (type === 'outcome') {
        if (amount > bill.value) {
          this.showMessage('danger', `На счету недостаточно средств. Вам не хватает ${ amount - bill.value}`);
          return;
        } else {
          value = bill.value - amount;
          this.showMessage('success', `Событие успешно добавлено!`);
        }
      } else {
        value = bill.value + amount;
        this.showMessage('success', `Событие успешно добавлено!`);
      }

      this.sub2 = this.billService.updateBill({value, currency: bill.currency})
        .mergeMap(() => this.eventService.addEvent(event))
        .subscribe(() => {
          form.setValue({
            amount: 0,
            description: '',
            category: 1,
            type: 'outcome'
          });
        });
    });
  }
   ngOnDestroy() {
     if (this.sub1) {
       this.sub1.unsubscribe();
     }
     if (this.sub2) {
       this.sub2.unsubscribe();
     }
   }

}
