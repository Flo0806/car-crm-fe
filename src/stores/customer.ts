import type {
  Address,
  ContactPerson,
  Customer,
  CustomerRaw,
} from "@/common/interfaces";
import axios from "axios";
import { defineStore } from "pinia";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [] as Array<Customer>, // Example structure
  }),
  actions: {
    async fetchCustomers() {
      try {
        const response = await axios.get<Array<Customer>>(
          `${VITE_BACKEND_URL}/customers`
        );
        this.customers = response.data;
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    },
    // We use the customer interface - with Omit we remove only the id (comes from backend!)
    async addCustomer() {
      try {
        // Payload für die Anfrage
        const customerPayload = {
          type: "COMPANY",
          contactPersons: [
            {
              firstName: "Neuer",
              lastName: "Kontakt",
              email: "kontakt@neuerkunde.de",
              phone: "123456789",
            },
          ],
          addresses: [
            {
              companyName: "Neue Firma",
              street: "Musterstraße 1",
              city: "Musterstadt",
              zip: "12345",
              country: "Deutschland",
              email: "info@neuefirma.de",
              phone: "987654321",
            },
          ],
        };

        // HTTP Request to create the new customer
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/customers",
          customerPayload
        );

        if (response.status === 201) {
          const newCustomer = response.data; // Created customer from the response

          // Now create a flat customer entry for the store
          const flatCustomerEntry = {
            id: newCustomer._id,
            intNr: newCustomer.intNr,
            type: newCustomer.type,
            companyName: newCustomer.addresses[0].companyName,
            country: newCustomer.addresses[0].country,
            zip: newCustomer.addresses[0].zip,
            city: newCustomer.addresses[0].city,
            street: newCustomer.addresses[0].street,
            email: newCustomer.addresses[0].email,
            phone: newCustomer.addresses[0].phone,
            fax: newCustomer.addresses[0].fax,
            firstName: newCustomer.contactPersons[0].firstName,
            lastName: newCustomer.contactPersons[0].lastName,
            contactEmail: newCustomer.contactPersons[0].email,
            contactPhone: newCustomer.contactPersons[0].phone,
            birthDate: newCustomer.contactPersons[0].birthDate || null,
            cId: newCustomer.contactPersons[0]._id, // Contact person ID
            aId: newCustomer.addresses[0]._id, // Address ID
          };

          // Access the customer store and add the new flat customer entry
          const copy = this.customers;
          copy.push(flatCustomerEntry);
          this.customers = [...copy];

          console.log(
            "New customer created and added to the store",
            flatCustomerEntry
          );
        }
      } catch (error: any) {
        console.error("Error creating customer:", error);
        if (error.response) {
          console.error("Error details:", error.response.data);
        }
      }
    },
    // Add a new address to an existing customer
    async addAddressToCustomer(customerId: string, newAddressData: Address) {
      try {
        // POST request to add a new address to the customer
        const response = await axios.put<{ customer: CustomerRaw }>(
          `${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}/address`,
          newAddressData
        );
        console.log("Address successfully added:", response.data);

        // Update the customer list in the store
        const updatedCustomer = response.data.customer;
        const address = updatedCustomer.addresses.find(
          (addr) =>
            addr.street === newAddressData.street &&
            addr.city === newAddressData.city
        );

        if (address) {
          // Add the new address to the customer's flat list
          this.customers.push({
            id: updatedCustomer._id,
            intNr: updatedCustomer.intNr,
            type: updatedCustomer.type,
            companyName: address.companyName || null,
            country: address.country,
            zip: address.zip,
            city: address.city,
            street: address.street,
            email: address.email || null,
            phone: address.phone || null,
            fax: address.fax || null,
            firstName: null,
            lastName: null,
            contactEmail: null,
            contactPhone: null,
            birthDate: null,
            cId: null,
            aId: address._id, // Address ID
          });
        }

        return response.data.customer;
      } catch (error) {
        console.error("Error adding new address:", error);
        throw error;
      }
    },
    // Update an address and change the flat store property
    async updateAddress(
      customerId: string,
      addressId: string,
      updatedAddressData: Address,
      customerIndex: number = -1
    ) {
      try {
        // PUT request to update the address
        const response = await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/customers/${customerId}/addresses/${addressId}`,
          updatedAddressData
        );
        console.log("Address successfully updated:", response.data);

        if (customerIndex !== -1) {
          // Update the customer entity in the list
          for (let prop in updatedAddressData) {
            // We loop through the object and replace it in the store
            if (prop === "id" || prop === "_id") continue; // Never change the ID
            if ((this.customers[customerIndex] as any)[prop]) {
              (this.customers[customerIndex] as any)[prop] = (
                updatedAddressData as any
              )[prop];
            }
          }

          return response.data as CustomerRaw;
        }
      } catch (error) {
        console.error("Error updating address:", error);
        throw error;
      }
    },
    // Deletes an address and checks if flat store property changes are needed
    async deleteAddress(customerId: string, addressId: string) {
      try {
        // Send the DELETE request to the backend to remove the address
        await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/customers/${customerId}/addresses/${addressId}`
        );
        console.log("Address successfully deleted.");

        // After successful deletion from the backend, update the customer list in the store
        // Find all entries containing the deleted address (aId)
        const cleanedData = this.customers.filter(
          (entry) => entry.aId === addressId
        );

        this.customers = [...cleanedData];
      } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
      }
    },
    // Method to add a new contact person to an existing customer
    async addContactToCustomer(
      customerId: string,
      newContactData: ContactPerson
    ) {
      try {
        // Send the POST request to add the new contact person to the customer
        const response = await axios.put<{ customer: CustomerRaw }>(
          `${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}/contact`,
          newContactData
        );
        console.log("Contact person successfully added:", response.data);

        // Find the customer in the store and update their contact persons
        const customerIndex = this.customers.findIndex(
          (customer) => customer.id === customerId
        );
        if (customerIndex !== -1) {
          const updatedCustomer = response.data.customer;

          // Find the newly added contact person in the response
          const newContact = updatedCustomer.contactPersons.find(
            (contact) =>
              contact.firstName === newContactData.firstName &&
              contact.lastName === newContactData.lastName
          );

          if (newContact) {
            // Check if the contact has an address linked
            if (newContact.address) {
              // Try to find an entry with the same address and no contact person assigned (cId is null)
              const existingAddressIndex = this.customers.findIndex(
                (entry) =>
                  entry.aId === newContact.address && entry.cId === null
              );

              if (existingAddressIndex !== -1) {
                // Update the existing entry with the new contact person
                this.customers[existingAddressIndex].cId = newContact._id;
                this.customers[existingAddressIndex].firstName =
                  newContact.firstName;
                this.customers[existingAddressIndex].lastName =
                  newContact.lastName;
                this.customers[existingAddressIndex].contactEmail =
                  newContact.email || null;
                this.customers[existingAddressIndex].contactPhone =
                  newContact.phone || null;
                this.customers[existingAddressIndex].birthDate =
                  newContact.birthDate || null;
              } else {
                // No existing entry found, create a new entry for the contact person
                this.customers.push({
                  id: updatedCustomer._id,
                  intNr: updatedCustomer.intNr,
                  type: updatedCustomer.type,
                  companyName: null, // No company data for a contact person
                  country: "",
                  zip: "",
                  city: "",
                  street: "",
                  email: null,
                  phone: null,
                  fax: null,
                  firstName: newContact.firstName,
                  lastName: newContact.lastName,
                  contactEmail: newContact.email || null,
                  contactPhone: newContact.phone || null,
                  birthDate: newContact.birthDate || null,
                  cId: newContact._id, // Contact ID
                  aId: newContact.address || null, // Address ID (if linked)
                });
              }
            }
          }
          return response.data.customer;
        }
      } catch (error) {
        console.error("Error adding new contact person:", error);
        throw error;
      }
    },
    // Update a contact person and change the flat store property
    async updateContact(
      customerId: string,
      contactId: string,
      updatedContactData: ContactPerson,
      customerIndex: number = -1
    ) {
      try {
        // PUT request to update the contact person
        const response = await axios.put<{ customer: CustomerRaw }>(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/customers/${customerId}/contacts/${contactId}`,
          updatedContactData
        );
        console.log(
          "Contact person successfully updated:",
          response.data,
          customerIndex
        );

        if (customerIndex !== -1) {
          const findCustomerStoreIndex = this.customers.findIndex(
            (f) => f.cId === contactId
          );
          const holdCustomerFlatList = [...this.customers]; // Create a copy of the customer list
          if (findCustomerStoreIndex > -1) {
            // Check if the address has changed
            if (
              this.customers[findCustomerStoreIndex].aId !==
              updatedContactData.address
            ) {
              // Address has changed

              // Check if there is another entry with the same aId and different cId
              const findAddressIndex = this.customers.findIndex(
                (f) =>
                  f.aId === this.customers[findCustomerStoreIndex].aId &&
                  f.cId !== this.customers[findCustomerStoreIndex].cId
              );

              if (findAddressIndex > -1) {
                // Another entry with the same address exists, so delete the old one
                holdCustomerFlatList.splice(findCustomerStoreIndex, 1);
              } else {
                // Keep the entry, but remove the contact person details
                holdCustomerFlatList[findCustomerStoreIndex].cId = null;
                holdCustomerFlatList[findCustomerStoreIndex].firstName = null;
                holdCustomerFlatList[findCustomerStoreIndex].lastName = null;
                holdCustomerFlatList[findCustomerStoreIndex].contactEmail =
                  null;
                holdCustomerFlatList[findCustomerStoreIndex].contactPhone =
                  null;
                holdCustomerFlatList[findCustomerStoreIndex].birthDate = null;
              }
            }
          }
          // Find or create a new entry for the updated contact person address
          if (updatedContactData.address) {
            // Find an entry with the same address but without a contact person
            const findNewAddressIndex = holdCustomerFlatList.findIndex(
              (f) => f.aId === updatedContactData.address && f.cId === null
            );

            if (findNewAddressIndex > -1) {
              // Update the entry with the new contact person
              holdCustomerFlatList[findNewAddressIndex].cId = contactId;
              holdCustomerFlatList[findNewAddressIndex].firstName =
                updatedContactData.firstName;
              holdCustomerFlatList[findNewAddressIndex].lastName =
                updatedContactData.lastName;
              holdCustomerFlatList[findNewAddressIndex].contactEmail =
                updatedContactData.email;
              holdCustomerFlatList[findNewAddressIndex].contactPhone =
                updatedContactData.phone;
              holdCustomerFlatList[findNewAddressIndex].birthDate =
                updatedContactData.birthDate;
            } else {
              // There is no entry with the same address, so create a new one

              const customerData = response.data.customer;
              const address = customerData.addresses.find(
                (f) => f._id === updatedContactData.address
              );
              const person = customerData.contactPersons.find(
                (f) => f._id === contactId
              );

              if (address && person) {
                holdCustomerFlatList.push({
                  id: customerData._id,
                  intNr: customerData.intNr,
                  type: customerData.type,
                  companyName: address.companyName || null,
                  country: address.country,
                  zip: address.zip,
                  city: address.city,
                  street: address.street,
                  email: address.email || null,
                  phone: address.phone || null,
                  fax: address.fax || null,
                  firstName: person.firstName,
                  lastName: person.lastName,
                  contactEmail: person.email || null,
                  contactPhone: person.phone || null,
                  birthDate: person.birthDate || null,
                  cId: person._id, // Contact ID
                  aId: address._id, // Address ID
                });
              }
            }
          } else {
            // Address has not changed, only update the contact person details in the current entry
            if (findCustomerStoreIndex > -1)
              for (let prop in updatedContactData) {
                if (prop === "id" || prop === "_id") continue;
                if (
                  (holdCustomerFlatList[findCustomerStoreIndex] as any)[
                    prop
                  ] !== undefined
                ) {
                  (holdCustomerFlatList[findCustomerStoreIndex] as any)[prop] =
                    (updatedContactData as any)[prop];
                }
              }
          }

          // Update the store with the new customer list
          this.customers = [...holdCustomerFlatList];
        }
        return response.data.customer as CustomerRaw;
      } catch (error) {
        console.error("Error updating contact person:", error);
        throw error;
      }
    },
    // Deletes a contact person and checks the flat store property if changes are needed
    async deleteContact(customerId: string, contactId: string) {
      try {
        // Send the DELETE request to the backend to remove the contact person
        await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/customers/${customerId}/contacts/${contactId}`
        );
        console.log("Contact person successfully deleted.");

        // After successful deletion from the backend, update the customer list in the store
        // Find all entries containing the deleted contact person (cId)
        const cleanedData = this.customers.filter((entry) => {
          // Check if the entry contains the deleted contact person
          if (entry.cId === contactId) {
            // If the entry has no address (aId) left, delete it
            if (!entry.aId) {
              return false; // Delete the entry if neither a contact person nor address is present
            } else {
              // If the entry has an address, only remove the contact person details
              entry.firstName = null;
              entry.lastName = null;
              entry.contactEmail = null;
              entry.contactPhone = null;
              entry.birthDate = null;
              entry.cId = null; // Also set contact person to null
              return true; // Keep the entry
            }
          }
          return true; // Keep all other entries
        });

        // Update the customer list directly with the filtered array
        this.customers = [...cleanedData];
      } catch (error) {
        console.error("Error deleting contact person:", error);
        throw error;
      }
    },
    async updateCustomer(
      customerId: string,
      type: "DEALER" | "COMPANY" | "PRIVATE"
    ) {
      // Logic to edit a customer
      try {
        // PUT request to update the contact person
        const response = await axios.put<{ customer: CustomerRaw }>(
          `${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}`,
          { type }
        );
        return response.data;
      } catch (error: any) {
        console.log("Error while updating customer: ", error);
        throw error;
      }
      const index = this.customers.findIndex((c) => c.id === customerId);
      if (index !== -1) {
        const copy = this.customers;
        copy[index].type = type;
        this.customers = [...copy];
      }
    },
    async deleteCustomer(customerId: string) {
      // Logic to delete a customer
      try {
        const response = await axios.delete(
          import.meta.env.VITE_BACKEND_URL + `/customers/${customerId}`
        );
        console.log("Customer deleted successfully:", response.data);
        this.customers = this.customers.filter(
          (customer) => customer.id !== customerId
        );
        return response.data;
      } catch (error: any) {
        console.error("Error deleting customer:", error);
        if (error.response) {
          console.error("Error details:", error.response.data);
        }
        throw error;
      }
    },
  },
});
