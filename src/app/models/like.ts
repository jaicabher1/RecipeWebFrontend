export class Like {
    constructor(
        public _id?: string,
        public userId: string = '',
        public publicationId: string = '',
        public createdAt?: Date,
    ) { }
}