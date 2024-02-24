import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { json } from "body-parser";

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course: Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required]
        });

    }

    ngOnInit() {
        this.form.valueChanges.pipe(
            filter(() => this.form.valid),
            //When we want "each" action should be completed in "Sequential manner" - CONCAT MAP
            concatMap(changes => this.saveResultToBackend(changes)),
            //if we want thing should run in parallel like GET call for lookeup value - MERGE MAP
            //If we use merge map in POST call it is not guarantee that 2 update will happen after 1 one
            //For post call MERGE MAP is bad idea
        ).subscribe();


    }

    saveResultToBackend(changes) {
        return fromPromise(
            fetch(`http://localhost:9001/api/courses/${this.course.id}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(changes)
            })
        )
    }


    ngAfterViewInit() {
        fromEvent(this.saveButton.nativeElement, 'click')//these will "create observable(stream)" form click event only for save button
            .pipe(
                //Only after first call done then only next thing will trigger
                exhaustMap(() => this.saveResultToBackend(this.form.value))
            ).subscribe()

    }



    close() {
        this.dialogRef.close();
    }

    save() {

    }
}
