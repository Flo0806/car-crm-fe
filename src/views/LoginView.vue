<template>
  <div class="login-container">
    <h1>Autohaus Maier</h1>
    <form @submit.prevent="handleLogin">
      <input
        type="email"
        placeholder="E-Mail"
        v-model="email"
        class="input"
        :class="{ 'input-error': emailError === 'invalid' }"
        @blur="validateFields('email')"
        @keydown="validateFields('email')"
      />
      <input
        type="password"
        placeholder="Passwort"
        v-model="password"
        class="input"
        :class="{ 'input-error': passwordError === 'invalid' }"
        @blur="validateFields('password')"
        @keydown="validateFields('password')"
      />
      <button type="submit" class="btn btn-primary" :disabled="!formValid">
        <div class="btn-content"><i class="pi pi-sign-in"></i>Login</div>
      </button>
    </form>
  </div>

  <the-snackbar
    v-if="snackbarMessage"
    :message="snackbarMessage"
    :type="snackbarType"
    @close="snackbarMessage = ''"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { SnackbarType } from "@/common/interfaces";
import TheSnackbar from "@/components/ui/TheSnackbar.vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// Use env
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Inputs
const email = ref("");
const password = ref("");

// Snackbar
const snackbarMessage = ref("");
const snackbarType = ref(SnackbarType.SUCCESS);

//#region Validation
const emailError = ref("pending");
const passwordError = ref("pending");
const formValid = ref(false);

const validateFields = (field: string) => {
  switch (field) {
    case "email":
      emailError.value = !email.value.includes("@") ? "invalid" : "valid"; // Basic email validation
      break;
    case "password":
      passwordError.value = password.value.length < 6 ? "invalid" : "valid"; // Password must be at least 6 characters
      break;
  }

  if (emailError.value === "valid" && passwordError.value === "valid")
    formValid.value = true;
  else {
    formValid.value = false;
  }
};
//#endregion

const handleLogin = async () => {
  // Handle login logic here
  console.log(
    "Logging in with:",
    email.value,
    password.value,
    VITE_BACKEND_URL
  );

  try {
    const response = await axios.post(`${VITE_BACKEND_URL}/auth/login`, {
      email: email.value,
      password: password.value,
    });
    console.log("FERTIG MIT REQUEST", response.data);

    authStore.setTokens(response.data.accessToken, response.data.refreshToken); // Save tokens in store
    authStore.login(response.data.email);
    // WARN: !!! Better use `httponly` cookie coming from backend for a production system !!!
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    // Redirect to home
    router.push("/");
  } catch (error: any) {
    if (error.status) {
      switch (error.status) {
        case 404:
          snackbarMessage.value = "Username oder Passwort sind falsch";
          snackbarType.value = SnackbarType.INFO;
          break;
        case 400:
          snackbarMessage.value = "Bitte alle Felder ausfüllen";
          snackbarType.value = SnackbarType.ERROR;
          break;
        case 500:
          snackbarMessage.value =
            "Unbekannter Fehler, bitte versuchen Sie es erneut";
          snackbarType.value = SnackbarType.ERROR;
          break;
      }
    }
    console.log(error.status);
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px; /* Full viewport height */
  width: 350px;
  padding: 0px 2rem;
  border-radius: $border-radius;
  background-color: white; /* Background color for the page */

  h1 {
    color: $primary-color;
    margin-bottom: 2rem;
  }

  @media (min-width: 768px) {
    width: 450px;
  }
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Space between inputs and button */
  width: 100%;

  .input-error {
    border: 2px solid red; /* Red border for validation errors */
  }

  .error {
    color: red; /* Error message styling */
  }
}
</style>
