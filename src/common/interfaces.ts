export enum SnackbarType {
  INFO = "info",
  SUCCESS = "success",
  ERROR = "error",
}

export interface Customer {
  id: string; // Customer ID
  intNr: string; // Internal customer number (e.g., "K-0001")
  type: "DEALER" | "COMPANY" | "PRIVATE"; // Customer type
  companyName: string | null; // Company name, if available
  country: string; // Country
  zip: string; // Postal code
  city: string; // City
  street: string; // Street and house number
  email: string | null; // Company email address
  phone: string | null; // Company phone number
  fax: string | null; // Company fax number
  firstName: string | null; // First name of the contact person
  lastName: string | null; // Last name of the contact person
  contactEmail: string | null; // Contact person's email
  contactPhone: string | null; // Contact person's phone number
  birthDate: string | null; // Contact person's birthdate (YYYY-MM-DD)
  cId: string | null; // Contact ID, if set (Store update)
  aId: string | null; // Address ID, if set (Store update)
}

export interface Address {
  _id: string; // MongoDB ID
  companyName: string | null; // Company name
  country: string; // Country
  zip: string; // Postal code
  city: string; // City
  street: string; // Street
  email: string; // Email address
  phone: string; // Phone number
  fax: string; // Fax number
  __v?: number; // Optional, if present - not used by us
}

export interface ContactPerson {
  _id: string; // MongoDB ID
  firstName: string; // First name
  lastName: string; // Last name
  email: string; // Email address
  phone: string; // Phone number
  birthDate: string; // Birthdate
  address: string | null; // Reference to the address ID
}

export interface CustomerRaw {
  _id: string; // MongoDB ID
  intNr: string; // Unique customer number, provided by the backend
  type: "DEALER" | "COMPANY" | "PRIVATE"; // Enum for the customer type
  contactPersons: ContactPerson[]; // Array of contact persons
  addresses: Address[]; // Array of addresses
  createdAt: string; // ISO date of creation
  updatedAt: string; // ISO date of the last update
  __v?: number; // Optional, if present - not used by us
}
