import {Component, Input} from '@angular/core';

@Component({
  selector: 'mha-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.scss']
})
export class HistoryChartComponent {

  @Input() data;

}
