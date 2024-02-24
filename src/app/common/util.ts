import { Observable } from "rxjs";
import { Course } from "../model/course";

//courses observable return from http request
export function createHttpObservableForCourses(url: string) {
    return new Observable<any>(observer => {
        //These functionality provided by fetch API
        // we can bort fetch api call in between even it is promise
        //***********We do not need it if we are using switch map operators - I WAS WRONG
        //Switch operator just call subscribe automatically

        let abortController = new AbortController();
        let signal = abortController.signal;

        fetch(url, { signal })
            .then((response) => {
                //will receive response object
                //to extract body from response object in json format we use json method
                //parsing to json format will take time it is async process 
                return response.json()
            })
            .then((body) => {
                observer.next(body);
                observer.complete();
            })
            .catch(error => observer.error(error))
        //we are returning these function to call unsubscribe on it
        return () => abortController.abort();

    })
}   