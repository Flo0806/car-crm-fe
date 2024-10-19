import type { Customer } from "@/common/interfaces";
import axios from "axios";
import { defineStore } from "pinia";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [] as Array<Customer>, // Beispielstruktur
  }),
  actions: {
    async fetchCustomers() {
      try {
        const response = await axios.get<Array<Customer>>(
          `${VITE_BACKEND_URL}/customers`
        );
        this.customers = response.data;
      } catch (error) {
        console.error("Fehler beim Abrufen der Kunden:", error);
      }
    },
    // We use the customer interface - with Omit we remove only the id (comes from backend!)
    addCustomer(customer: Omit<Customer, "id">) {
      // Logik zum Hinzufügen eines neuen Kunden
      this.customers.push({ id: Date.now().toString(), ...customer }); // Beispiel für ID
    },
    editCustomer(updatedCustomer: Customer) {
      // Logik zum Bearbeiten eines Kunden
      const index = this.customers.findIndex(
        (c) => c.id === updatedCustomer.id
      );
      if (index !== -1) {
        this.customers[index] = updatedCustomer;
      }
    },
    deleteCustomer(id: string) {
      // Logik zum Löschen eines Kunden
      this.customers = this.customers.filter((customer) => customer.id !== id);
    },
  },
});
