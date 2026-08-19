export interface IEventCardProps {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  bookings: string;
}

export interface IBookEventProps {
  eventId: string;
}

export interface IActionsEventProps extends IBookEventProps {
  slug:string
}

export interface ICreateBookingProps extends IBookEventProps {
  email:string
}

export interface IModalProps {
  isOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
  children: React.ReactNode
}
