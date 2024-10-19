export enum SnackbarType {
  INFO = "info",
  SUCCESS = "success",
  ERROR = "error",
}

export interface Customer {
  id: string; // ID des Kunden
  intNr: string; // Interne Kundennummer (z.B. "K-0001")
  type: "DEALER" | "COMPANY" | "PRIVATE"; // Kundentyp
  companyName: string | null; // Firmenname, falls vorhanden
  country: string; // Land
  zip: string; // Postleitzahl
  city: string; // Stadt
  street: string; // Straße und Hausnummer
  email: string | null; // Email-Adresse der Firma
  phone: string | null; // Telefonnummer der Firma
  fax: string | null; // Faxnummer der Firma
  firstName: string | null; // Vorname des Ansprechpartners
  lastName: string | null; // Nachname des Ansprechpartners
  contactEmail: string | null; // E-Mail des Ansprechpartners
  contactPhone: string | null; // Telefonnummer des Ansprechpartners
  birthDate: string | null; // Geburtsdatum des Ansprechpartners (YYYY-MM-DD)
}
