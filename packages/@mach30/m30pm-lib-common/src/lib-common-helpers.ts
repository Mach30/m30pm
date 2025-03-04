export class Helpers {
    public static toJsonString(o : Object) : string {
        return JSON.stringify(o, null, 2)
    }
}