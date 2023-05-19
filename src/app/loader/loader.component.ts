import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../service/spinner.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
loading!:boolean
  constructor(private loaderService:SpinnerService) {
    this.loaderService.isLoading.subscribe((res) => {
      this.loading = res;
    });
   }

  ngOnInit(): void {
  }

}
