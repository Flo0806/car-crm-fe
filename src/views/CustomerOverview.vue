<template>
  <div class="customer-view">
    <h2>Customer Data</h2>
    <button @click="addCustomer" class="btn btn-primary">New</button>

    <!--Table which holds all the customer data as special flat array-->
    <table>
      <thead>
        <tr>
          <th @click="sortTable('intNr')">
            Customer No.
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
            Company Name
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
            First Name
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
            Last Name
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
            Zip Code
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
            City
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
              @click.stop="editCustomer(customer.id, index)"
              class="btn btn-secondary"
            >
              Edit
            </button>
            <button
              style="margin-left: 1rem"
              @click="deleteCustomer(customer.id)"
              class="btn btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Component -->
    <div class="pagination-container">
      <the-pagination
        :totalItems="100"
        :currentPage="1"
        :itemsPerPage="10"
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
    title="Customer Details"
  >
    <template #default>
      <div class="customer-card">
        <div class="customer-card-section">
          <h3>{{ selectedCustomer?.companyName || "Unknown" }}</h3>
          <hr />
          <p><b>Customer No:</b> {{ selectedCustomer?.intNr }}</p>
          <p>
            <strong>Zip & City:</strong> {{ selectedCustomer?.zip }},
            {{ selectedCustomer?.city }}
          </p>
        </div>
        <hr />
        <div class="customer-card-section">
          <p><strong>Contact Person:</strong></p>
          <p>
            {{ selectedCustomer?.firstName }} {{ selectedCustomer?.lastName }}
          </p>
          <p><strong>Email:</strong> {{ selectedCustomer?.email || "-" }}</p>
          <p><strong>Phone:</strong> {{ selectedCustomer?.phone || "-" }}</p>
        </div>
      </div>
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
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useCustomerStore } from "@/stores/customer";
import TheModal from "@/components/ui/TheModal.vue";
import CustomerEdit from "@/components/CustomerEdit.vue";
import ThePagination from "@/components/ui/ThePagination.vue";
import type { Customer } from "@/common/interfaces";

// Use store
const customerStore = useCustomerStore();
const customers = computed(() => customerStore.customers);

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
const itemsPerPage = ref(10); // Default to 10 entries per page

// Modal state and selected customer
const isModalVisible = ref(false);
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
//#endregion Modals

const addCustomer = () => {
  // Logic for adding a new customer
  console.log("Adding a new customer");
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

const deleteCustomer = (id: string) => {
  // Logic for deleting a customer
  console.log(`Deleting customer ${id}`);
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
