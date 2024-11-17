interface Room {
    roomId: number;
    hotelName: string;
    hotelAddress: string;
    hotelStars: number;
    hotelReviewScore: number;
    hotelReviewNumber: number;
    hotelPrice: number;
    bedNumber: number;
    roomType: string
    roomLeft: number
    services?: string[];
    photo?: string[];
    description?: string
    reservedFrom?: string
    reservedTo?: string
  }

  interface PersonalDetails {
    name: string;
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
    user: string,
    date: string,
    rating: number,
    content: string,
    helpfulCount: number,
  }