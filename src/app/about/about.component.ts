import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, fromEvent, interval, noop } from "rxjs";

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
      fetch('http://localhost:9090/api/courses')
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


  }

}
