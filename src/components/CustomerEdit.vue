<template>
  <the-modal
    :isVisible="isVisible"
    @close="closeModal"
    title="Kundendaten bearbeiten"
  >
    <!--Simple loading text-->
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
                :startSelectedAddress="props.startSelectedAddress"
              />
            </div>
            <div style="margin-top: 2rem">
              <contact-list
                @contactSelected="onContactSelected"
                :contacts="customerData!.contactPersons"
                :startSelectedContact="props.startSelectedContact"
              />
            </div>
          </form>
        </div>

        <!-- Addresses view -->
        <div v-if="viewState === 'addresses' && selectedAddress">
          <h3>Adresse bearbeiten</h3>
          <form style="margin-top: 1rem">
            <div class="address-item">
              <!-- Company name -->
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

              <!-- Street -->
              <div class="form-group">
                <label for="street">Straße</label>
                <input
                  type="text"
                  v-model="selectedAddress.street"
                  id="street"
                  placeholder="Straße"
                  class="form-control"
                  :class="{ 'is-invalid': isAddressFieldInvalid('street') }"
                  required
                />
              </div>

              <!-- Zip and city -->
              <div style="display: flex">
                <div
                  class="form-group"
                  style="width: 33.33%; margin-right: 1rem"
                >
                  <label for="zip">PLZ</label>
                  <input
                    type="text"
                    v-model="selectedAddress.zip"
                    id="zip"
                    placeholder="Postleitzahl"
                    class="form-control"
                    :class="{ 'is-invalid': isAddressFieldInvalid('zip') }"
                    required
                  />
                </div>

                <div class="form-group" style="width: calc(66.66% - 1rem)">
                  <label for="city">Stadt</label>
                  <input
                    type="text"
                    v-model="selectedAddress.city"
                    id="city"
                    placeholder="Stadt"
                    class="form-control"
                    :class="{ 'is-invalid': isAddressFieldInvalid('city') }"
                    required
                  />
                </div>
              </div>

              <!-- Country -->
              <div class="form-group">
                <label for="country">Land</label>
                <input
                  type="text"
                  v-model="selectedAddress.country"
                  id="country"
                  placeholder="Land"
                  class="form-control"
                  :class="{ 'is-invalid': isAddressFieldInvalid('country') }"
                  required
                />
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  v-model="selectedAddress.email"
                  id="email"
                  placeholder="Email-Adresse"
                  class="form-control"
                  :class="{
                    'is-invalid': isAddressFieldInvalid('email', true),
                  }"
                  required
                />
              </div>

              <!-- Phone and fax -->
              <div style="display: flex">
                <div
                  class="form-group"
                  style="width: calc(50% - 0.5rem); margin-right: 1rem"
                >
                  <label for="phone">Telefon</label>
                  <input
                    type="text"
                    v-model="selectedAddress.phone"
                    id="phone"
                    placeholder="Telefonnummer"
                    class="form-control"
                  />
                </div>

                <div class="form-group" style="width: calc(50% - 0.5rem)">
                  <label for="fax">Fax</label>
                  <input
                    type="text"
                    v-model="selectedAddress.fax"
                    id="fax"
                    placeholder="Faxnummer"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
          </form>
          <!-- Delete button-->
          <button type="button" class="btn btn-error" @click="deleteAddress()">
            Löschen
          </button>
          <button
            class="btn btn-primary"
            type="button"
            style="margin-left: 1rem"
            @click="backToCustomer"
          >
            Zurück zu Kundendaten
          </button>
        </div>

        <!-- Contact person view -->
        <div v-if="viewState === 'contacts' && selectedContact">
          <h3>Kontaktpersonen bearbeiten</h3>
          <form>
            <div class="contact-item">
              <!-- Firstname -->
              <div class="form-group">
                <label for="firstName">Vorname</label>
                <input
                  type="text"
                  v-model="selectedContact!.firstName"
                  id="firstName"
                  placeholder="Vorname"
                  class="form-control"
                  :class="{ 'is-invalid': isContactFieldInvalid('firstName') }"
                  required
                />
              </div>

              <!-- Lastname -->
              <div class="form-group">
                <label for="lastName">Nachname</label>
                <input
                  type="text"
                  v-model="selectedContact!.lastName"
                  id="lastName"
                  placeholder="Nachname"
                  class="form-control"
                  :class="{ 'is-invalid': isContactFieldInvalid('lastName') }"
                  required
                />
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  v-model="selectedContact!.email"
                  id="email"
                  placeholder="Email"
                  class="form-control"
                  :class="{
                    'is-invalid': isContactFieldInvalid('email', true),
                  }"
                  required
                />
              </div>

              <!-- Phone -->
              <div class="form-group">
                <label for="phone">Telefon</label>
                <input
                  type="text"
                  v-model="selectedContact!.phone"
                  id="phone"
                  placeholder="Telefon"
                  class="form-control"
                  :class="{ 'is-invalid': isContactFieldInvalid('phone') }"
                  required
                />
              </div>

              <!-- Birthdate -->
              <div class="form-group">
                <label for="birthDate">Geburtsdatum</label>
                <input
                  type="date"
                  v-model="selectedContact!.birthDate"
                  id="birthDate"
                  class="form-control"
                />
              </div>

              <!-- Address List -->
              <div style="max-height: 250px; overflow-y: auto">
                <contact-address-list
                  :addresses="customerData!.addresses"
                  :selectedAddressId="selectedContact!.address || undefined"
                  @addressSelected="onContactAddressChanged"
                ></contact-address-list>
              </div>
            </div>
          </form>
          <!-- Delete button-->
          <button type="button" class="btn btn-error" @click="deleteContact()">
            Löschen
          </button>
          <!-- Back zu overview-->
          <button
            class="btn btn-primary"
            tyle="margin-left: 1rem;"
            @click="backToCustomer"
          >
            Zurück zu Kundendaten
          </button>
        </div>
      </div>
    </template>

    <!-- Save button for all views. Logic behind on the opened view -->
    <template #actions>
      <button @click="saveChanges" class="btn btn-primary">Speichern</button>
    </template>
  </the-modal>
  <!-- Snackbar for showing results -->
  <the-snackbar
    v-if="snackbarMessage"
    :message="snackbarMessage"
    :type="snackbarType"
    @close="snackbarMessage = ''"
  />
</template>

<script lang="ts" setup>
import { ref, toValue, watch } from "vue";
import {
  type Address,
  type ContactPerson,
  type CustomerRaw,
} from "@/common/interfaces";
import { useCustomerStore } from "@/stores/customer";
import axios from "axios";
import TheModal from "./ui/TheModal.vue";
import AddressList from "./AddressList.vue";
import ContactList from "./ContactList.vue";
import ContactAddressList from "./ContactAddressList.vue";
import TheSnackbar from "@/components/ui/TheSnackbar.vue";
import { SnackbarType } from "@/common/interfaces";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Use Store
const customerStore = useCustomerStore();

// Snackbar
const snackbarMessage = ref("");
const snackbarType = ref(SnackbarType.SUCCESS);

// Props for Modals state
const props = defineProps({
  isVisible: Boolean,
  customerId: String, // Customer id which we'll work on
  customerListIndex: Number, // Index of the overview list
  startSelectedContact: String || undefined,
  startSelectedAddress: String || undefined,
});

// Loading
const isLoading = ref(true);

const selectedAddress = ref<Address>();
const selectedContact = ref<ContactPerson | undefined>(undefined);

// Emit for closing modal
const emit = defineEmits(["close", "save"]);

// Inter data structure for the customer (not flat - raw)
const customerData = ref<CustomerRaw | null>(null); // Comes from backend

// viewState for navigation between contacts, addresses, overview
const viewState = ref("customer"); // Standard view: customer overview

// API call to get the customer data
const loadCustomerData = async () => {
  if (!props.customerId) return;

  try {
    const response = await axios.get(
      `${VITE_BACKEND_URL}/customers/${props.customerId}`
    );
    customerData.value = response.data;
    isLoading.value = false;
  } catch (error) {
    snackbarType.value = SnackbarType.ERROR;
    snackbarMessage.value = "Unbekannter Fehler beim Laden des Kunden - 500";
    console.error("Error while loading customer data", error);
    // And no, here we dont reset the loading... The user must close and reopen the dialog. No customer? No forms!
  }
};

// If customer is changed (from parent) reload data!
watch(
  () => props.customerId,
  () => {
    if (props.customerId) {
      isLoading.value = true;
      loadCustomerData();
    }
  }
);

// If we close the dialog and reopen it, we always wanna start at the first page, the customer page
watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      backToCustomer();
    }
  }
);

// Navigation helpers
const switchToAddresses = () => (viewState.value = "addresses");
const switchToContacts = () => (viewState.value = "contacts");
const backToCustomer = () => (viewState.value = "customer");

// Address selected in List -> Switch intern view
const onAddressSelected = (address: Address) => {
  selectedAddress.value = address;
  switchToAddresses();
};

// Contact selected in List -> Switch intern view
const onContactSelected = (contact: ContactPerson) => {
  selectedContact.value = contact;
  switchToContacts();
};

// Contact view -> If we change contacts address we musst set the address id to the contact
const onContactAddressChanged = (addressId: string) => {
  selectedContact.value!.address = addressId;
};

const deleteAddress = async () => {
  try {
    await customerStore.deleteAddress(
      customerData!.value!._id,
      selectedAddress!.value!._id
    );
    snackbarType.value = SnackbarType.SUCCESS;
    snackbarMessage.value = "Addresse wurde gelöscht";
    let clone = customerData.value;

    clone = {
      ...clone,
      contactPersons: clone!.contactPersons.map((data) => ({
        ...data,
        address:
          data.address === selectedAddress!.value?._id ? null : data.address,
      })),
      addresses: clone!.addresses.filter(
        (f) => f._id !== selectedAddress!.value!._id
      ),
    } as CustomerRaw;

    selectedAddress.value = undefined;
    customerData.value = clone;
    backToCustomer();
  } catch (error: any) {
    console.error(error);
    snackbarType.value = SnackbarType.ERROR;

    if (error.status) {
      switch (error.status) {
        case 404:
          snackbarMessage.value =
            "Der Kunde wurde nicht mehr in der Datenbank gefunden.";
          break;
        case 400:
          snackbarMessage.value =
            "Addresse konnte nicht gelöscht werden. Es muss mindestens eine Addresse vorhanden sein.";
          break;
        default:
          snackbarMessage.value =
            "Fehler beim löschen der Addresse. Bitte versuchen Sie es erneut.";
          break;
      }
    }
  }
};

// Delete contact button - Logic in store
const deleteContact = async () => {
  try {
    await customerStore.deleteContact(
      customerData!.value!._id,
      selectedContact!.value!._id
    );
    snackbarType.value = SnackbarType.SUCCESS;
    snackbarMessage.value = "Kontaktperson wurde gelöscht";
    let clone = customerData.value;

    clone = {
      ...clone,
      contactPersons: clone!.contactPersons.filter(
        (f) => f._id !== selectedContact!.value!._id
      ),
    } as CustomerRaw;
    selectedContact.value = undefined;
    customerData.value = clone;
    backToCustomer();
  } catch (error: any) {
    console.error(error);
    snackbarType.value = SnackbarType.ERROR;

    if (error.status) {
      switch (error.status) {
        case 404:
          snackbarMessage.value =
            "Der Kunde wurde nicht mehr in der Datenbank gefunden.";
          break;
        case 400:
          snackbarMessage.value =
            "Kontaktperson konnte nicht gelöscht werden. Es muss mindestens eine Kontaktperson vorhanden sein.";
          break;
        default:
          snackbarMessage.value =
            "Fehler beim löschen der Kontaktperson. Bitte versuchen Sie es erneut.";
          break;
      }
    }
  }
};

// Save changes for customer
const submitCustomerData = async () => {
  try {
    await customerStore.updateCustomer(
      customerData!.value!._id,
      customerData!.value!.type
    );

    snackbarType.value = SnackbarType.SUCCESS;
    snackbarMessage.value = "Kundentyp wurde aktualisiert";
    emit("close");
  } catch (error: any) {
    snackbarType.value = SnackbarType.ERROR;
    snackbarMessage.value =
      "Fehler beim aktualisieren des Kundentyps. Bitte versuchen Sie es später erneut";
  }
};

// Save the changed contact / Create new contact
const submitContactData = async () => {
  const isNew = selectedContact!.value!._id === undefined;

  try {
    isNew
      ? await customerStore.addContactToCustomer(
          customerData!.value!._id,
          selectedContact!.value!
        )
      : await customerStore.updateContact(
          customerData!.value!._id,
          selectedContact!.value!._id,
          selectedContact!.value!,
          props.customerListIndex
        );
    snackbarType.value = SnackbarType.SUCCESS;
    snackbarMessage.value = isNew
      ? "Kontaktperson wurde hinzugefügt"
      : "Kontaktperson wurde aktualisiert";
    emit("close");
  } catch (error: any) {
    console.log("ERROR", error);
    snackbarType.value = SnackbarType.ERROR;
    if (error.status) {
      switch (error.status) {
        case 400:
          snackbarMessage.value = error.response.data.errors.join("\n");
          break;
        default:
          snackbarMessage.value = !isNew
            ? "Fehler beim hinzufügen der Kontaktperson. Bitte versuchen Sie es erneut."
            : "Fehler beim aktualisieren der Kontaktperson. Bitte versuchen Sie es erneut.";
          break;
      }
    } else
      snackbarMessage.value = !isNew
        ? "Fehler beim hinzufügen der Kontaktperson. Bitte versuchen Sie es erneut."
        : "Fehler beim aktualisieren der Kontaktperson. Bitte versuchen Sie es erneut.";
  }
};

// Save the changed address / Create new address
const submitAddressData = async () => {
  const isNew = selectedAddress!.value!._id === undefined;

  try {
    isNew
      ? await customerStore.addAddressToCustomer(
          customerData!.value!._id,
          selectedAddress!.value!
        )
      : await customerStore.updateAddress(
          customerData!.value!._id,
          selectedAddress!.value!._id,
          selectedAddress!.value!,
          props.customerListIndex
        );

    snackbarType.value = SnackbarType.SUCCESS;
    snackbarMessage.value = isNew
      ? "Adresse wurde hinzugefügt."
      : "Adresse wurde aktualisiert.";
    emit("close");
  } catch (error: any) {
    snackbarType.value = SnackbarType.ERROR;
    if (error.status) {
      switch (error.status) {
        case 400:
          snackbarMessage.value = error.response.data.errors.join("\n");
          break;
        default:
          snackbarMessage.value = !isNew
            ? "Fehler beim hinzufügen der Adresse. Bitte versuchen Sie es erneut."
            : "Fehler beim aktualisieren der Adresse. Bitte versuchen Sie es erneut.";
          break;
      }
    } else
      snackbarMessage.value = !isNew
        ? "Fehler beim hinzufügen der Adresse. Bitte versuchen Sie es erneut."
        : "Fehler beim aktualisieren der Adresse. Bitte versuchen Sie es erneut.";
  }
};

// Method to save changes by click on save button.
/**
 * Yes, we can use the submit.prevent, but we have 3 forms and the easiest way is to handle it like this:
 */
const saveChanges = async () => {
  if (viewState.value === "addresses") {
    // TODO: Create enums
    await submitAddressData();
  } else if (viewState.value === "contacts") {
    await submitContactData();
  } else if (viewState.value === "customer") {
    await submitCustomerData();
  }
};

// Close modal :-)
const closeModal = () => {
  emit("close");
};

//#region Validation
// Function to check if a 'address' field is invalid
const isAddressFieldInvalid = (field: string, isEmail: boolean = false) => {
  const value =
    selectedAddress!.value![field as keyof typeof selectedAddress.value];

  // If the field is empty
  if (!value || value === "") {
    return true;
  }

  // If it's an email field, validate the format - We only check the email this time
  // TODO: Validate phone, fax, lengths in the frontend, too. This time we only validate it in the backend
  if (isEmail && !validateEmail(value as string)) {
    return true;
  }

  return false;
};

// Function to check if a 'contact' field is invalid
const isContactFieldInvalid = (field: string, isEmail: boolean = false) => {
  const value =
    selectedContact!.value![field as keyof typeof selectedContact.value];

  // If the field is empty
  if (!value) {
    return true;
  }

  // If it's an email field, validate the format
  // TODO: Validate phone, fax, lengths in the frontend, too. This time we only validate it in the backend
  if (isEmail && !validateEmail(value as string)) {
    return true;
  }

  return false;
};

// Email validation helper function
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
//#endregion
</script>

<style lang="scss" scoped>
// Only some styles for marin, padding... Other styles are in sub components
.address-item,
.contact-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
</style>
