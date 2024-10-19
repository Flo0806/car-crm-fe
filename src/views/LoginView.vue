<template>
  <div class="login-container">
    <h1>Autohaus Maier</h1>
    <form @submit.prevent="handleLogin">
      <input
        type="email"
        placeholder="E-Mail"
        v-model="email"
        class="input"
        required
      />
      <input
        type="password"
        placeholder="Passwort"
        v-model="password"
        class="input"
        required
      />
      <button type="submit" class="button button--primary">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      // Handle login logic here
      console.log("Logging in with:", this.email, this.password);
    },
  },
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
}
</style>
