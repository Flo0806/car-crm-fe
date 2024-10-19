2
<template>
  <div class="customer-view">
    <h2>Kundendaten</h2>
    <button @click="addCustomer" class="btn btn-primary">Neu</button>

    <table>
      <thead>
        <tr>
          <th>KdNr.</th>
          <th>Firmenname</th>
          <th>Vorname</th>
          <th>Nachname</th>
          <th>PLZ</th>
          <th>Ort</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td>{{ customer.intNr }}</td>
          <td>{{ customer.companyName || "-" }}</td>
          <td>{{ customer.firstName || "" }}</td>
          <td>{{ customer.lastName || "" }}</td>
          <td>{{ customer.zip || "" }}</td>
          <td>{{ customer.city || "" }}</td>
          <td>
            <button
              @click="editCustomer(customer.id)"
              class="btn btn-secondary"
            >
              Bearbeiten
            </button>
            <button @click="deleteCustomer(customer.id)" class="btn btn-danger">
              Löschen
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useCustomerStore } from "@/stores/customer";

const customerStore = useCustomerStore();
const customers = ref(customerStore.customers);

// Funktion zum Abrufen der Kunden
const loadCustomers = async () => {
  await customerStore.fetchCustomers(); // Kunden aus dem Store abrufen
  customers.value = customerStore.customers; // Aktualisieren des lokalen Refs
};

// Kunden beim Mounten der Komponente abrufen
onMounted(() => {
  loadCustomers();
});

const addCustomer = () => {
  // Logik zum Hinzufügen eines neuen Kunden
  console.log("Neuen Kunden hinzufügen");
};

const editCustomer = (id: string) => {
  // Logik zum Bearbeiten eines Kunden
  console.log(`Kunden ${id} bearbeiten`);
};

const deleteCustomer = (id: string) => {
  // Logik zum Löschen eines Kunden
  console.log(`Kunden ${id} löschen`);
};
</script>

<style lang="scss">
.customer-view {
  h2 {
    color: $primary-color; // Verwende die in deiner variables.scss definierte Farbe
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      border: 1px solid $border-color;
      padding: 8px;
      text-align: left;
    }
    td {
      color: $text-color;
    }

    th {
      background-color: $background-dark; // Hintergrundfarbe für Header
    }

    tbody tr:hover {
      background-color: $hover-background-color; // Definiere deine Hover-Hintergrundfarbe
      cursor: pointer; // Zeigt einen Zeiger-Cursor beim Hover
    }

    td:last-child {
      white-space: nowrap; // Verhindert, dass die Buttons umgebrochen werden
      width: 1%; // Nimmt nur so viel Platz wie nötig
    }
  }
}
</style>
