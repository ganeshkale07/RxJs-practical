import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservableForCourses } from "../common/util";

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    begineerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    constructor() {

    }

    ngOnInit() {
        //common utility function to create separate stream of observable
        const http$ = createHttpObservableForCourses('http://localhost:9001/api/courses');
        const courses$: Observable<Course[]> = http$.pipe(
            tap(val => console.log(val['payload'])),
            map(res => res['payload']),
            //instead of calling api again and again save result as observable and share same
            shareReplay()
        )

        //create separate stream for each use case
        this.begineerCourses$ = courses$.pipe(
            map((courses) => courses.filter((course) => course['category'] === "BEGINNER"))
        )
        //create separate stream for each use case
        this.advancedCourses$ = courses$.pipe(
            map((courses) => courses.filter((course) => course['category'] === "ADVANCED"))
        )
    }

}
