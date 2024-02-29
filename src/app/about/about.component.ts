import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject, Subscriber, asyncScheduler, fromEvent, interval, noop, observable } from "rxjs";
import { createHttpObservableForCourses } from "../common/util";

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //Things I learn - WHAT ARE STREAMS

    //streams === observables
    //create blue print of streams

    //Blue print - definition - declaration --> They know now what to do
    const interval$ = interval(1000); //Hanuman
    //Just blurprint or definition not enough
    //they do not know what to do with it 

    //when jamwant tell hanuman you can do that
    //interval$.subscribe((val) => console.log(val));

    //If we have to create stream of click events
    let mouseClick$ = fromEvent(document, 'click');
    mouseClick$.subscribe(evt => console.log(evt));

    //Creating My own HTTP observable 😀

    const http$ = new Observable(observer => {
      fetch('http://localhost:9001/api/courses')
        .then(response => response.json())
        .then(body => {
          observer.next(body);

          observer.complete();
        })
        .catch(err => observer.error(err))

    })

    http$.subscribe(
      courses => console.log(courses),
      //If do not have error handling for now
      //so () => {} instead of writing these 
      //we will say no operation noop - in short
      noop,
      () => console.log("Completed")
    )

    //Operators 
    //deriving observable form another observable


    //What If I have to cancel the observable in between 
    const interval1$ = interval(1000);

    let interval1$Sub = interval1$.subscribe(console.log);

    //Normally way we can unsubscribe from observable with help of setTimeout 
    setTimeout(() => interval1$Sub.unsubscribe(), 2000);


    //How can we CANCEL Actual API call 
    let cousrses$Sub = createHttpObservableForCourses('http://localhost:9001/api/courses').subscribe((val) => {
      console.log(val)
    })

    setTimeout(() => cousrses$Sub.unsubscribe(), 0)


    //what are subjects - they can behave like observable and observer BOTH
    //We prefer creating observable with fromPromise() | from() | of() | formEVent(HTML_ELE , HTML_EVENT)

    //Important 
    //mySubject is observer here we can call next() | error() | complete() 
    const mySubject = new BehaviorSubject(88);

    //using asObservable() because as we do not want anyboday else emit value in out observable
    const mySubject$ = mySubject.asObservable();
    mySubject$.subscribe(val => console.log("First sub", val));

    mySubject.next(11);
    mySubject.next(22);
    mySubject.next(33);

    mySubject.complete();

    //Subject
    // what if I am Subscribing to subject later in time
    //Then old emitted data stream won't be available to me 

    //ReplaySubject - even after complete it will work
    //If I want replay of all values later in time subscription 

    //BehaviorSubject - after complete it will not work
    //It will always have by default value 
    //and last emitted value in case of late subscription condition is that subcription should not happen after completion 

    //AsyncSubject - even after complete it will work
    //what ever value emitted by observable before complete it will share with all observer 
    //even subscription happen later in time

    setTimeout(() => {
      mySubject$.subscribe(val => console.log("second sub", val));
    }, 1000);



  }

}
