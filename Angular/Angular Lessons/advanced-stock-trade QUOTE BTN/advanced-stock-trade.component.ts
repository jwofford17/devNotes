import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {MyLookupDTO} from "../models/my-lookup-dto";
import {MyLookupService} from "../services/my-lookup.service";
import {QuoteService} from "../services/quote.service";
import {GetQuoteDetailsDTO} from "../models/get-quote-details-dto";

@Component({
  selector: 'app-advanced-stock-trade',
  templateUrl: './advanced-stock-trade.component.html',
  styleUrls: ['./advanced-stock-trade.component.scss']
})
export class AdvancedStockTradeComponent implements OnInit {

  public myForm: FormGroup;

  public isHelpOpen: boolean = false;

  public actionsObs: Observable<MyLookupDTO[]>;
  public ordersObs: Observable<MyLookupDTO[]>;
  public symbolObs: Observable<GetQuoteDetailsDTO>;

  public quote: GetQuoteDetailsDTO;

  constructor(private formBuilder: FormBuilder,
              private myLookupService: MyLookupService,
              private quoteService: QuoteService) {
  }


  // Initialize
  ngOnInit() {

    // Init form
    this.myForm = this.formBuilder.group({
      symbol:      [null, null],
      action:      [null, null],
      quantity:      [null, null],
      orderType:      [null, null],
      limitPrice:      [null, null],
    });

    this.actionsObs = this.myLookupService.getOrderActions();
    this.ordersObs = this.myLookupService.getOrders();




  }



  public onResetClick(): void {
    this.myForm.reset();
  }


  public onHelpClick(): void{
    this.isHelpOpen = true;
  }


  public onHelpClose(): void {
    this.isHelpOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  // Handle Escape Key with overlay
  public userPressedEscape(): void {
    this.onHelpClose();
  }


  public quoteClicked() {
    // Use subscribe to actually (manually) invoke the service, then use arrow function to get the result
    // of the Observable, then you can set this.quote = result
    this.quoteService.getQuote(this.myForm.controls.symbol.value).subscribe((aData: GetQuoteDetailsDTO) => {
      this.quote = aData;
    }).add(() => {
      // finally block
      // called whether REST call succeeds or not
      // can be used to 'stop spinner' if rest call fails
    })
  }


}
