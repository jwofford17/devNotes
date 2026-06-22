import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {MyLookupDTO} from "../models/my-lookup-dto";
import {MyLookupService} from "../services/my-lookup.service";
import {QuoteService} from "../services/quote.service";
import {GetQuoteDetailsDTO} from "../models/get-quote-details-dto";

@Component({
  selector: 'app-advanced-stock-trade',
  templateUrl: './advanced-stock-trade.component.html',
  styleUrls: ['./advanced-stock-trade.component.scss']
})
export class AdvancedStockTradeComponent implements OnInit, OnDestroy {

  public myForm: FormGroup;

  public isHelpOpen: boolean = false;

  public actionsObs: Observable<MyLookupDTO[]>;
  public ordersObs: Observable<MyLookupDTO[]>;

  public quoteObs: Observable<GetQuoteDetailsDTO>;

  public symbolTextSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private myLookupService: MyLookupService,
              private quoteService: QuoteService) {
  }


  // Initialize
  ngOnInit() {

    // Init form
    this.myForm = this.formBuilder.group({
      symbol:        [null, null],
      action:        [null, null],
      quantity:      [null, null],
      orderType:     [null, null],
      limitPrice:    [null, null],
    });

    this.actionsObs = this.myLookupService.getOrderActions();
    this.ordersObs = this.myLookupService.getOrders();

    // Listen on quote symbol text box
    this.symbolTextSubscription = this.myForm.controls.symbol.valueChanges.subscribe((aSymbol: string) => {
      // Updating the Observable to cause async pipe in html to automatically refresh
      this.quoteObs = this.quoteService.getQuote(aSymbol);
    })




  }


  ngOnDestroy() {
    if (this.symbolTextSubscription) {
      this.symbolTextSubscription.unsubscribe();
    }

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




}
