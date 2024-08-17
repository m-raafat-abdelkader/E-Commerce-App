export class ErrorClass {
  constructor(message, { status }, data, location, stack) {
    this.message = message;
    this.status = status;
    this.data = data;
    this.location = location;
    this.stack = stack;
  }
}
