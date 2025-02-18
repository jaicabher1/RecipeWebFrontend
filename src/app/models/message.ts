
export class Message {
  constructor(
    public _id?: string,
    public emitter: string = '',
    public receiver: string = '',
    public text?: string,
    public file?: string,
    public viewed: string = 'false',
    public createdAt?: Date
  ) {}
}
