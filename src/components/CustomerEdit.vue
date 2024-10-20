<template>
  <the-modal
    :isVisible="isVisible"
    @close="closeModal"
    title="Kundendaten bearbeiten"
  >
    <template #default>
      <div v-if="isLoading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Daten werden geladen...</p>
      </div>
      <div v-else>
        <div v-if="viewState === 'customer'">
          <h3>Kundendaten</h3>
          <form style="margin-top: 1rem" @submit.prevent="submitCustomerData">
            <div>
              <label for="type">Kundentyp: </label>
              <select id="type" v-model="customerData!.type">
                <option value="DEALER">Händler</option>
                <option value="COMPANY">Firma</option>
                <option value="PRIVATE">Privat</option>
              </select>
            </div>
            <div style="margin-top: 2rem">
              <address-list
                @addressSelected="onAddressSelected"
                :addresses="customerData!.addresses"
              />
            </div>
            <div style="margin-top: 2rem">
              <contact-list
                @contactSelected="onContactSelected"
                :contacts="customerData!.contactPersons"
              />
            </div>
          </form>
        </div>

        <!-- Adressen Ansicht -->
        <div v-if="viewState === 'addresses' && selectedAddress">
          <h3>Adresse bearbeiten</h3>
          <form style="margin-top: 1rem" @submit.prevent="submitAddressData">
            <!-- Loop über die Adressen mit Feldern in form-group-Struktur -->
            <div class="address-item">
              <div class="form-group">
                <label for="companyName">Firmenname</label>
                <input
                  type="text"
                  v-model="selectedAddress.companyName"
                  id="companyName"
                  placeholder="Firmenname"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="country">Land</label>
                <input
                  type="text"
                  v-model="selectedAddress.country"
                  id="country"
                  placeholder="Land"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="zip">PLZ</label>
                <input
                  type="text"
                  v-model="selectedAddress.zip"
                  id="zip"
                  placeholder="Postleitzahl"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="city">Stadt</label>
                <input
                  type="text"
                  v-model="selectedAddress.city"
                  id="city"
                  placeholder="Stadt"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="street">Straße</label>
                <input
                  type="text"
                  v-model="selectedAddress.street"
                  id="street"
                  placeholder="Straße"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  v-model="selectedAddress.email"
                  id="email"
                  placeholder="Email-Adresse"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="phone">Telefon</label>
                <input
                  type="text"
                  v-model="selectedAddress.phone"
                  id="phone"
                  placeholder="Telefonnummer"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="fax">Fax</label>
                <input
                  type="text"
                  v-model="selectedAddress.fax"
                  id="fax"
                  placeholder="Faxnummer"
                  class="form-control"
                />
              </div>

              <!-- Löschen-Button bleibt unverändert -->
              <button class="btn btn-error" @click="deleteAddress(index)">
                Löschen
              </button>
            </div>
          </form>
          <button class="btn btn-primary" type="button" @click="backToCustomer">
            Zurück zu Kundendaten
          </button>
        </div>

        <!-- Kontaktpersonen Ansicht -->
        <div v-if="viewState === 'contacts'">
          <h3>Kontaktpersonen bearbeiten</h3>
          <div class="contact-item">
            <div class="form-group">
              <label for="firstName">Vorname</label>
              <input
                type="text"
                v-model="selectedContact!.firstName"
                id="firstName"
                placeholder="Vorname"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="lastName">Nachname</label>
              <input
                type="text"
                v-model="selectedContact!.lastName"
                id="lastName"
                placeholder="Nachname"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                v-model="selectedContact!.email"
                id="email"
                placeholder="Email"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="phone">Telefon</label>
              <input
                type="text"
                v-model="selectedContact!.phone"
                id="phone"
                placeholder="Telefon"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="birthDate">Geburtsdatum</label>
              <input
                type="date"
                v-model="selectedContact!.birthDate"
                id="birthDate"
                class="form-control"
              />
            </div>

            <div style="max-height: 250px; overflow-y: auto">
              <contact-address-list
                :addresses="customerData!.addresses"
                :selectedAddressId="selectedContact!.address"
                @addressSelected="onContactAddressChanged"
              ></contact-address-list>
            </div>

            <!-- Speichern- und Löschen-Buttons -->
            <!-- <button @click="deleteContact" class="button-error">Löschen</button> -->
          </div>
          <!-- <button @click="addContact">Neue Kontaktperson hinzufügen</button> -->
          <button class="btn btn-primary" @click="backToCustomer">
            Zurück zu Kundendaten
          </button>
        </div>
      </div>
    </template>

    <template #actions>
      <button @click="saveChanges" class="btn btn-primary">Speichern</button>
    </template>
  </the-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import {
  type Address,
  type ContactPerson,
  type CustomerRaw,
} from "@/common/interfaces";
import TheModal from "./ui/TheModal.vue";
import AddressList from "./AddressList.vue";
import ContactList from "./ContactList.vue";
import ContactAddressList from "./ContactAddressList.vue";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Props für den Modal-Status
const props = defineProps({
  isVisible: Boolean,
  customerId: String, // Die ID des Kunden, der bearbeitet wird
});

// Loading
const isLoading = ref(true);

const selectedAddress = ref<Address>();
const selectedContact = ref<ContactPerson>();

// Emit für das Schließen des Modals
const emit = defineEmits(["close", "save"]);

// Interne Datenstruktur für den Kunden
const customerData = ref<CustomerRaw | null>(null); // Wir werden die Daten aus dem Backend laden

// viewState zur Navigation zwischen Kundendaten, Adressen und Kontaktpersonen
const viewState = ref("customer"); // Standardansicht: Kundendaten

// API-Aufruf, um die Kundendaten zu laden
const loadCustomerData = async () => {
  console.log("CUSTOMER ID", props.customerId);
  if (!props.customerId) return;

  try {
    console.log("START");
    const response = await axios.get(
      `${VITE_BACKEND_URL}/customers/${props.customerId}`
    );
    customerData.value = response.data;
    isLoading.value = false;
    console.log("FERTIG");
  } catch (error) {
    console.log("FEHLER");
    console.error("Fehler beim Laden der Kundendaten:", error);
  } finally {
    console.log("DONE");
    isLoading.value = false;
  }
};

// Kunden laden, wenn das Modal geöffnet wird
onMounted(() => {
  loadCustomerData();
});

watch(
  () => props.customerId,
  () => {
    if (props.customerId) {
      loadCustomerData();
    }
  }
);

// Methoden für die Navigation
const switchToAddresses = () => (viewState.value = "addresses");
const switchToContacts = () => (viewState.value = "contacts");
const backToCustomer = () => (viewState.value = "customer");

// Bearbeitungslogik für Adressen
//   const addAddress = () => {
//     if (customerData.value) {
//       customerData.value.addresses.push({ street: "", city: "" });
//     }
//   };
const editAddress = (index: number) => {
  // Bearbeitung logik für Adressen
};
const deleteAddress = (index: number) => {
  if (customerData.value) {
    customerData.value.addresses.splice(index, 1);
  }
};

const onAddressSelected = (address: Address) => {
  selectedAddress.value = address;
  viewState.value = "addresses";
};

const onContactSelected = (contact: ContactPerson) => {
  selectedContact.value = contact;
  viewState.value = "contacts";
};

const onContactAddressChanged = (addressId: string) => {
  console.log(selectedContact.value?.address, addressId);
  selectedContact.value!.address = addressId;
};

const editContact = (index: number) => {
  // Bearbeitung logik für Kontaktpersonen
};

const deleteContact = (index: number) => {
  if (customerData.value) {
    customerData.value.contactPersons.splice(index, 1);
  }
};

const submitCustomerData = () => {
  console.log("HIER");
};

const submitAddressData = async () => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/customers/${
        customerData!.value?._id
      }/addresses/${selectedAddress!.value?._id}`,
      selectedAddress!.value
    );
    console.log("Adresse erfolgreich aktualisiert:", response.data);
    emit("close");
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Adresse:", error);
    throw error;
  }
};

// Methode, um die Adresse für eine Kontaktperson zu finden
const getAddressForContact = (addressId: string) => {
  if (!customerData.value) return "Keine Adresse zugewiesen";

  const address = customerData.value.addresses.find(
    (addr) => addr._id === addressId
  );
  return address
    ? `${address.street}, ${address.city}`
    : "Keine Adresse zugewiesen";
};

// Methode zum Speichern und Schließen des Modals
const saveChanges = async () => {
  if (viewState.value === "addresses") {
    console.log(selectedAddress.value);
    await submitAddressData();
  }
  //   emit("save", customerData.value); // Daten an das Eltern-Element senden
  //   closeModal();
};

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
.address-item,
.contact-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
</style>
