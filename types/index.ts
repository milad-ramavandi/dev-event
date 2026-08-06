export interface IEvent {
    slug:string;
    title:string;
    location:string;
    image:string;
    date:string;
    time:string;
}

export interface IEventCardProps extends IEvent {};