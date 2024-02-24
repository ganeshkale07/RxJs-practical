import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay, mergeMap
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservableForCourses } from "../common/util";


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: number;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservableForCourses(`http://localhost:9001/api/courses/${this.courseId}`);

    }

    ngAfterViewInit() {
        const searchLessons$ = fromEvent(this.input.nativeElement, 'keyup').pipe(
            map((event: Event) => (event.target as HTMLInputElement).value),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((searchedFor) => createHttpObservableForCourses(`http://localhost:9001/api/lessons?courseId=${this.courseId}&pageSize=${6}&filter=${searchedFor}`)),
            map((resBody) => resBody['payload']));

        this.lessons$ = concat(this.loadLessons(), searchLessons$)


    }

    loadLessons(search = '') {
        return createHttpObservableForCourses(`http://localhost:9001/api/lessons?courseId=${this.courseId}&pageSize=${6}&filter=${search}`).
            pipe(
                map((resBody) => resBody['payload'])
            )
    }

}
