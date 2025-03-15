export class Comment {
    constructor(
        public _id?: string,
        public userId: string = '',
        public publicationId: string = '',
        public text: string = '',
        public createdAt?: Date,
    ) { }
}