/* ---------------------------------------MOCK--------------------------------------------- */

interface Review {
  user: string;
  date: string;
  rating: number;
  content: string;
  helpfulCount: number;
}

/* ------------------------------------AUTH---------------------------------------------- */

interface PersonalDetails {
  firstName: string;
  secondName: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  gender?: string;
  address?: string;
  passportDetails?: string;
}

interface SignInInput {
  username: string;
  password: string;
}

interface User {
  id_user?: number
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role?: "USER" | "ADMIN";
}

interface Token {
  access_token: string;
  token_type: string;
}

/*---------------------------------------------HOTEL-----------------------------------------*/

// Base Interface for Room
interface RoomBase {
  room_number: number;
  hotel_id?: number | null;
  bed_number?: number | null;
  room_type?: string | null;
  price_per_night_adults?: number | null; // Use `number` for Decimal fields
  price_per_night_children?: number | null;
  description?: string | null;
}

// Create Room Interface
interface RoomCreate extends RoomBase {}

// Room List Create Interface
interface RoomCreateList {
  room_list: RoomCreate[];
}

// Room Create List Output
interface RoomCreateListOut {
  rooms_created: RoomBase[];
  rooms_not_created: RoomBase[];
}

// Base Interface for Hotel
interface HotelBase {
  hotel_name?: string | null;
  hotel_address?: string | null;
  hotel_stars?: number | null;
  total_rooms?: number | null;
  hotel_city?: string | null;
  refundable?: boolean | 0;
}

// Create Hotel Interface
interface HotelCreate extends HotelBase {}

// Base Interface for Booking
interface BookingBase {
  room_number: number;
  user_id?: number | null;
  hotel_id?: number | null;
  booked_from?: string | null; // Use `string` for `datetime` fields
  booked_to?: string | null;
  adult_no?: number | null;
  children_no?: number | null;
  credit_card_no?: string | null;
  date_payment?: string | null;
  date_refound?: string | null;
  cancelled?: boolean | false;
}

// Create Booking Interface
interface BookingCreate extends BookingBase {}

// Base Interface for Photo
interface PhotoBase {
  photo_url?: string | null;
  room_number?: number | null;
}

// Create Photo Interface
interface PhotoCreate {
  room_number: number;
  photos: string[];
}

// Output for Saved Photos
interface PhotoOut {
  photos_saved: string[];
  photos_not_saved: string[];
  error_message: string;
}

// Base Interface for Service
interface ServiceBase {
  service_name?: string | null;
  service_icon?: string | null;
}

// Create Service Interface
interface ServiceCreate {
  services: ServiceBase[];
}

// Service Output Interface
interface ServiceOut extends ServiceBase {
  service_id: number;
}

// List Output for Services
interface ServiceListOut {
  services: ServiceOut[];
}

// Service Creation Output
interface ServiceCreationOut {
  saved_service: string[];
  not_saved_service: string[];
}

// Base Interface for Room Service
interface RoomServiceBase {
  room_id: number;
  service_id: number;
}

// Create Room Service Interface
interface RoomServiceCreate extends RoomServiceBase {}

// Output for Room Service
interface RoomServiceOut extends RoomServiceBase {
  service_name: string;
  room_number: number;
}

// Associate Room with Services Interface
interface AssociateRoomWithServices {
  room_id: number;
  services: number[];
}

// Room Output Interface
interface RoomOut extends RoomBase {
  photos: string[];
  room_services: ServiceBase[];
  hotel?: HotelBase | null;
}

// Hotel Output Interface
interface HotelOut extends HotelBase {
  hotel_id: number;
  rooms: RoomOut[];
}

// Booking Output Interface
interface BookingOut extends BookingBase {
  hotel?: HotelOut | null;
  payment_amount?: number | null; // Use `number` for Decimal fields
}

// Booking Room Output Interface
interface BookingRoomOut extends BookingBase {
  room?: RoomOut | null;
  payment_amount?: number | null;
}

// Associate Room with Services Output
interface AssociateRoomWithServicesOut {
  associated_services: number[];
  not_associated_services: number[];
}

interface RoomOutAndBookRoomOut {
  room: RoomOut | null
  booking: BookingRoomOut | null
}
