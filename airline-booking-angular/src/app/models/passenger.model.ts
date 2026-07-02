import { Flight } from "./flight.model";

// New interface for API payload
export interface PassengerCreate {
  title: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  passenger_type: string;  // Should be 'AD' | 'CH' | 'IN'
  is_pwd: boolean;
  go_rewards_id?: string;
}

// Original interface for UI
export interface Passenger {
  id: string;
  type: 'Adult' | 'Child' | 'Infant';
  isActive: boolean;
  name: {
    title: string;
    firstName: string;
    lastName: string;
    hasNoFirstName?: boolean;
  };
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  isPWD: boolean;
  nationality: string;
  goRewardsId?: string;
  selectedDepartingFlight?: Flight;
  selectedReturningFlight?: Flight;
  hasDeclaration?: boolean;
}