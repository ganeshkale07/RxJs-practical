import { Observable } from "rxjs";

//courses observable return from http request
export function createHttpObservableForCourses() {
    return new Observable(observer => {
        fetch('http://localhost:9001/api/courses')
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

    })
}   