<template>
  <div class="customer-view">
    <h2>Kundenübersicht</h2>
    <button @click="addCustomer" class="btn btn-primary">
      <div class="btn-content icon"><i class="pi pi-plus"></i>Neuer Kunde</div>
    </button>

    <!--Table which holds all the customer data as special flat array-->
    <table>
      <thead>
        <tr>
          <th @click="sortTable('intNr')">
            KdNr.
            <i
              v-if="sortBy === 'intNr'"
              :class="
                sortDirection === 'asc'
                  ? 'pi pi-sort-amount-up-alt'
                  : 'pi pi-sort-amount-down'
              "
            >
            </i>
          </th>
          <th @click="sortTable('companyName')">
            Firmenname
            <i
              v-if="sortBy === 'companyName'"
              :class="
                sortDirection === 'asc'
                  ? 'pi pi-sort-amount-up-alt'
                  : 'pi pi-sort-amount-down'
              "
            >
            </i>
          </th>
          <th @click="sortTable('firstName')">
            Vorname
            <i
              v-if="sortBy === 'firstName'"
              :class="
                sortDirection === 'asc'
                  ? 'pi pi-sort-amount-up-alt'
                  : 'pi pi-sort-amount-down'
              "
            >
            </i>
          </th>
          <th @click="sortTable('lastName')">
            Nachname
            <i
              v-if="sortBy === 'lastName'"
              :class="
                sortDirection === 'asc'
                  ? 'pi pi-sort-amount-up-alt'
                  : 'pi pi-sort-amount-down'
              "
            >
            </i>
          </th>
          <th @click="sortTable('zip')">
            PLZ
            <i
              v-if="sortBy === 'zip'"
              :class="
                sortDirection === 'asc'
                  ? 'pi pi-sort-amount-up-alt'
                  : 'pi pi-sort-amount-down'
              "
            >
            </i>
          </th>
          <th @click="sortTable('city')">
            Ort
            <i
              v-if="sortBy === 'city'"
              :class="
                sortDirection === 'asc'
                  ? 'pi pi-sort-amount-up-alt'
                  : 'pi pi-sort-amount-down'
              "
            >
            </i>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(customer, index) in paginatedCustomers"
          :key="customer.id + index.toString()"
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
              @click.stop="editCustomer(customer.id, index)"
              class="btn btn-secondary"
            >
              Bearbeiten
            </button>
            <button
              @click.stop="openDeleteModal(customer)"
              class="btn btn-secondary"
              style="margin-left: 1rem"
            >
              Löschen
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Component -->
    <div class="pagination-container">
      <the-pagination
        :totalItems="sortedCustomers.length || 0"
        :currentPage="currentPage"
        :itemsPerPage="5"
        :perPageOptions="[5, 10, 20]"
        @pageChanged="changePage"
        @perPageChanged="changeItemsPerPage"
      />
    </div>
  </div>

  <!-- Simple modal to show a visit card of the customer -->
  <the-modal
    :isVisible="isModalVisible"
    @close="closeModal"
    title="Kundendetails"
  >
    <template #default>
      <div class="customer-card">
        <!-- Kundeninformationen -->
        <div class="customer-card-header">
          <h3>{{ selectedCustomer?.companyName || "Unknown" }}</h3>
          <span class="customer-type">
            {{
              selectedCustomer?.type === "COMPANY"
                ? "Firma"
                : selectedCustomer?.type === "PRIVATE"
                ? "Privatkunde"
                : "Händler"
            }}
          </span>
        </div>
        <hr />

        <!-- Adressinformationen -->
        <div class="customer-card-section">
          <p>
            <strong>Kundennummer:</strong> {{ selectedCustomer?.intNr || "-" }}
          </p>
          <p><strong>Straße:</strong> {{ selectedCustomer?.street || "-" }}</p>
          <p>
            <strong>Postleitzahl & Stadt:</strong>
            {{ selectedCustomer?.zip || "-" }},
            {{ selectedCustomer?.city || "-" }}
          </p>
          <p><strong>Land:</strong> {{ selectedCustomer?.country || "-" }}</p>
        </div>

        <hr />

        <!-- Kontaktinformationen -->
        <div class="customer-card-section">
          <p><strong>Ansprechpartner:</strong></p>
          <p>
            <strong>Name:</strong> {{ selectedCustomer?.firstName }}
            {{ selectedCustomer?.lastName }}
          </p>
          <p><strong>E-Mail:</strong> {{ selectedCustomer?.email || "-" }}</p>
          <p><strong>Telefon:</strong> {{ selectedCustomer?.phone || "-" }}</p>
          <p><strong>Fax:</strong> {{ selectedCustomer?.fax || "-" }}</p>
          <p>
            <strong>Geburtsdatum:</strong>
            {{ selectedCustomer?.birthDate || "-" }}
          </p>
        </div>
      </div>
    </template>
  </the-modal>

  <!-- Delete Customer modal-->
  <the-modal
    :isVisible="isDeleteModalVisible"
    @close="closeDeleteModal"
    title="Kunde löschen"
  >
    <template #default>
      Soll der Kunde <strong>'{{ selectedCustomer!.intNr }}'</strong> wirklich
      gelöscht werden?
    </template>
    <template #actions>
      <button @click="deleteCustomer" class="btn btn-primary">
        Bestätigen
      </button>
    </template>
  </the-modal>
  <!-- The edit component -->
  <customer-edit
    @close="closeCustomerEditModal"
    :customerId="customerIdToEdit!"
    :customerListIndex="customerIndexToEdit"
    :isVisible="isEditModalVisible"
    :startSelectedContact="startSelectedContact"
    :startSelectedAddress="startSelectedAddress"
  ></customer-edit>

  <the-snackbar
    v-if="snackbarMessage"
    :message="snackbarMessage"
    :type="snackbarType"
    @close="snackbarMessage = ''"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useCustomerStore } from "@/stores/customer";
import TheModal from "@/components/ui/TheModal.vue";
import CustomerEdit from "@/components/CustomerEdit.vue";
import ThePagination from "@/components/ui/ThePagination.vue";
import { SnackbarType, type Customer } from "@/common/interfaces";
import TheSnackbar from "@/components/ui/TheSnackbar.vue";

// Use store
const customerStore = useCustomerStore();
const customers = computed(() => customerStore.customers);

// Snackbar
const snackbarMessage = ref("");
const snackbarType = ref(SnackbarType.SUCCESS);

// Sort customers based on selected column and direction
const sortedCustomers = computed(() => {
  return [...customers.value].sort((a, b) => {
    let compareA = (a as any)[sortBy.value] || "";
    let compareB = (b as any)[sortBy.value] || "";

    if (typeof compareA === "string" && typeof compareB === "string") {
      compareA = compareA.toLowerCase();
      compareB = compareB.toLowerCase();
    }

    if (compareA < compareB) return sortDirection.value === "asc" ? -1 : 1;
    if (compareA > compareB) return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });
});

// Table sorting
const sortBy = ref<string>("intNr"); // Default sort column
const sortDirection = ref<string>("asc"); // Sort direction (asc or desc)

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(5); // Default to 10 entries per page

// Modal state and selected customer
const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const selectedCustomer = ref<Customer | null>(null);

const isEditModalVisible = ref(false);
const customerIdToEdit = ref<string | null>(null);
const customerIndexToEdit = ref<number>(-1);

const startSelectedContact = ref<string | undefined>(undefined);
const startSelectedAddress = ref<string | undefined>(undefined);

// Function to load customer data
const loadCustomers = async () => {
  await customerStore.fetchCustomers(); // Fetch customers from the store
};

// Fetch customers when the component is mounted
onMounted(() => {
  loadCustomers();
});

//#region Modals
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
  customerIndexToEdit.value = -1;
};

const openDeleteModal = (customer: Customer) => {
  selectedCustomer.value = customer;
  isDeleteModalVisible.value = true;
};

const closeDeleteModal = (customer: Customer) => {
  selectedCustomer.value = null;
  isDeleteModalVisible.value = false;
};

const deleteCustomer = async () => {
  try {
    await customerStore.deleteCustomer(selectedCustomer!.value!.id);
    snackbarMessage.value = "Der Kunde wurde gelöscht";
    snackbarType.value = SnackbarType.SUCCESS;
    isDeleteModalVisible.value = false;
    loadCustomers();
  } catch (error: any) {
    snackbarMessage.value =
      "Der Kunde konnte nicht gelöscht werden. Versuchen Sie es später erneut.";
    snackbarType.value = SnackbarType.ERROR;
  }
};
//#endregion Modals

const addCustomer = async () => {
  // Logic for adding a new customer
  try {
    await customerStore.addCustomer();

    snackbarMessage.value = "Der Kunde wurde angelegt -> Neue Firma";
    snackbarType.value = SnackbarType.SUCCESS;
  } catch (error: any) {
    snackbarMessage.value =
      "Fehler beim erstellen eines neuen Kunden. Versuchen Sie es später erneut.";
    snackbarType.value = SnackbarType.ERROR;
  }
};

const editCustomer = (id: string, customerIndex: number) => {
  startSelectedAddress.value =
    sortedCustomers.value[customerIndex].aId || undefined;
  startSelectedContact.value =
    sortedCustomers.value[customerIndex].cId || undefined;
  // Logic for editing a customer
  customerIdToEdit.value = id;
  customerIndexToEdit.value = customerIndex;
  isEditModalVisible.value = true;
};

// Sorting logic
const sortTable = (column: string) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc"; // Toggle sort direction
  } else {
    sortBy.value = column;
    sortDirection.value = "asc"; // Default to ascending
  }
};

// Pagination logic
// Calculate the currently visible customers based on the current page and items per page
const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedCustomers.value.slice(start, end);
});

// Function to change pages
const changePage = (page: number) => {
  currentPage.value = page;
};

// Change the number of items per page
const changeItemsPerPage = (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage;
  currentPage.value = 1; // Reset to the first page
};
</script>

<style lang="scss">
.customer-view {
  h2 {
    color: $primary-color; // Use the color defined in variables.scss
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
      cursor: pointer; // Because sorting
      color: $inverse-font-color; // White text color
      background-color: $background-dark; // Background color for the header

      // The sorting icon
      i {
        margin-left: 0.5rem;
        font-size: 0.9rem;
      }
    }

    tbody tr:hover {
      background-color: $hover-background-color;
      cursor: pointer; // Shows pointer cursor on hover
    }

    td:last-child {
      white-space: nowrap; // Prevent buttons from wrapping
      width: 1%; // Only take as much space as needed
    }
  }

  // Center pagination with a little margin on top
  .pagination-container {
    width: 100%;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }
}

.customer-card {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;

  .customer-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .customer-type {
      padding: 0.25rem 0.5rem;
      background-color: #007bff;
      color: #fff;
      font-size: 0.875rem;
      border-radius: 5px;
    }
  }

  hr {
    border: none;
    height: 1px;
    background-color: #ccc;
    margin: 1rem 0;
  }

  .customer-card-section {
    p {
      margin: 0.5rem 0;
      font-size: 1rem;
      color: #555;

      strong {
        color: #333;
      }
    }

    /* Kontaktinformationen spezifisch */
    &:last-child {
      background-color: #eef2f7;
      padding: 0.75rem;
      border-radius: 5px;
    }
  }
}
</style>
