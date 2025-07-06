import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isShowed$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  show(): void {
    this.isShowed$.next(true);
  }

  hide(): void {
    this.isShowed$.next(false);
  }

}
