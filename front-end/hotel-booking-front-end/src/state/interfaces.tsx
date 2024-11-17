interface Room {
  roomId: number;
  hotelName: string;
  hotelAddress: string;
  hotelStars: number;
  hotelReviewScore: number;
  hotelReviewNumber: number;
  hotelPrice: number;
  bedNumber: number;
  roomType: string;
  roomLeft: number;
  services?: string[];
  photo?: string[];
  description?: string;
  reservedFrom?: string;
  reservedTo?: string;
}

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

interface Review {
  user: string;
  date: string;
  rating: number;
  content: string;
  helpfulCount: number;
}

interface SignInInput {
  username: string;
  password: string;
}

interface User {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: "USER" | "ADMIN";
  access?: boolean;
}

interface Token {
  access_token: string;
  token_type: string;
}
