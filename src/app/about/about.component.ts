import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, fromEvent, interval, noop } from "rxjs";
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
    setTimeout(() => interval1$Sub.unsubscribe(), 5000);


    //How can we CANCEL Actual API call 
    let cousrses$Sub = createHttpObservableForCourses('http://localhost:9001/api/courses').subscribe((val) => {
      console.log(val)
    })

    setTimeout(() => cousrses$Sub.unsubscribe(), 0)

  }

}
