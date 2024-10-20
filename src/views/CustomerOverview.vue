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
        <tr
          v-for="customer in customers"
          :key="customer.id"
          @click="openCustomerCard(customer)"
        >
          <td>{{ customer.intNr }}</td>
          <td>{{ customer.companyName || "-" }}</td>
          <td>{{ customer.firstName || "" }}</td>
          <td>{{ customer.lastName || "" }}</td>
          <td>{{ customer.zip || "" }}</td>
          <td>{{ customer.city || "" }}</td>
          <td>
            <button
              @click.stop="editCustomer(customer.id)"
              class="btn btn-secondary"
            >
              Bearbeiten
            </button>
            <button
              style="margin-left: 1rem"
              @click="deleteCustomer(customer.id)"
              class="btn btn-danger"
            >
              Löschen
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <the-modal
    :isVisible="isModalVisible"
    @close="closeModal"
    title="Kundendetails"
  >
    <template #default>
      <div class="customer-card">
        <div class="customer-card-section">
          <h3>{{ selectedCustomer?.companyName || "Unbekannt" }}</h3>
          <hr />
          <p><b>KdNr:</b> {{ selectedCustomer?.intNr }}</p>
          <p>
            <strong>PLZ & Ort:</strong> {{ selectedCustomer?.zip }},
            {{ selectedCustomer?.city }}
          </p>
        </div>
        <hr />
        <div class="customer-card-section">
          <p><strong>Kontaktperson:</strong></p>
          <p>
            {{ selectedCustomer?.firstName }} {{ selectedCustomer?.lastName }}
          </p>
          <p><strong>Email:</strong> {{ selectedCustomer?.email || "-" }}</p>
          <p><strong>Telefon:</strong> {{ selectedCustomer?.phone || "-" }}</p>
        </div>
      </div>
    </template>
  </the-modal>

  <customer-edit
    @close="closeCustomerEditModal"
    :customerId="customerIdToEdit!"
    :isVisible="isEditModalVisible"
  ></customer-edit>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useCustomerStore } from "@/stores/customer";
import TheModal from "@/components/ui/TheModal.vue";
import CustomerEdit from "@/components/CustomerEdit.vue";
import type { Customer } from "@/common/interfaces";

const customerStore = useCustomerStore();
const customers = ref(customerStore.customers);

// Modal state and selected customer
const isModalVisible = ref(false);
const selectedCustomer = ref<Customer | null>(null);

const isEditModalVisible = ref(false);
const customerIdToEdit = ref<string | null>(null);

// Funktion zum Abrufen der Kunden
const loadCustomers = async () => {
  await customerStore.fetchCustomers(); // Kunden aus dem Store abrufen
  customers.value = customerStore.customers; // Aktualisieren des lokalen Refs
};

// Kunden beim Mounten der Komponente abrufen
onMounted(() => {
  loadCustomers();
});

// Modals
const openCustomerCard = (customer: Customer) => {
  selectedCustomer.value = customer;
  customerIdToEdit.value = customer.id;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  selectedCustomer.value = null;
};

const closeCustomerEditModal = () => {
  isEditModalVisible.value = false;
  customerIdToEdit.value = null;
};
// Modals

const addCustomer = () => {
  // Logik zum Hinzufügen eines neuen Kunden
  console.log("Neuen Kunden hinzufügen");
};

const editCustomer = (id: string) => {
  // Logik zum Bearbeiten eines Kunden
  console.log(`Kunden ${id} bearbeiten`);
  customerIdToEdit.value = id;
  isEditModalVisible.value = true;
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

.customer-card-section {
  margin-bottom: 20px;

  h3 {
    margin-bottom: 5px;
    font-size: 1.5rem;
    color: $primary-color;
    font-weight: bold;
  }

  p {
    margin: 5px 0;
    font-size: 1rem;
    color: $text-dark;

    strong {
      color: $text-color;
    }
  }

  hr {
    border: 0;
    height: 1px;
    background-color: $border-color;
    margin: 10px 0;
  }
}
</style>
