<template>
  <article class="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-blue-800">
    <div class="relative w-[768px] h-[480px] rounded-lg overflow-hidden shadow-xl bg-white bg-opacity-90">
      <!-- Overlay -->
      <div
        class="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-br from-blue-600 to-blue-400 text-white flex flex-col items-center justify-center px-8 transition-transform duration-500"
        :class="{ '-translate-x-full': signUp }"
      >
        <h2 class="text-2xl font-bold" v-if="!signUp">Welcome Back!</h2>
        <p class="mt-4 text-lg" v-if="!signUp">Create Your Account Right Here</p>
        <button
          v-if="!signUp"
          class="mt-6 px-6 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-blue-600 transition"
          @click="toggleSignUp"
        >
          Sign Up
        </button>
        <h2 class="text-2xl font-bold" v-else>Hello, Friend!</h2>
        <p class="mt-4 text-lg" v-else>Please enter your personal details</p>
        <button
          v-else
          class="mt-6 px-6 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-blue-600 transition"
          @click="toggleSignUp"
        >
          Sign Up
        </button>
      </div>

      <!-- Sign Up Form -->
      <form
        class="absolute top-0 left-0 w-1/2 h-full bg-white bg-opacity-80 p-8 flex flex-col justify-center items-center transition-opacity duration-500"
        :class="{ 'opacity-0 pointer-events-none': !signUp }"
        @submit.prevent="handleSignUp"
      >
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Create Account</h2>
        <p class="text-gray-600 mb-4">Use your email for registration</p>
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="mb-4 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="mb-4 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="mb-4 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>

      <!-- Sign In Form -->
      <form
        class="absolute top-0 left-0 w-1/2 h-full bg-white bg-opacity-80 p-8 flex flex-col justify-center items-center transition-opacity duration-500"
        :class="{ 'opacity-0 pointer-events-none': signUp }"
        @submit.prevent="handleSignIn"
      >
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Sign In</h2>
        <p class="text-gray-600 mb-4">Use your account</p>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="mb-4 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="mb-4 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  </article>
</template>

<script>
import { useAuthStore } from '@/stores/authStores';
import authService from '@/service/authservice';
import { notification } from 'ant-design-vue';

export default {
  data() {
    return {
      signUp: false,
      username: '',
      email: '',
      password: '',
    };
  },
  methods: {
    toggleSignUp() {
      this.signUp = !this.signUp;
    },
    async handleSignUp() {
      if (!this.email || !this.username || !this.password) {
        notification.error({
          message: 'Validation Error',
          description: 'Please fill in all fields.',
        });
        return;
      }

      try {
        const response = await authService.register(this.email, this.username, this.password);
        
        if (response.token) {
          const authStore = useAuthStore();
          authStore.setAuthToken(response.token);
          
          notification.success({
            message: 'Registration Successful',
            description: 'You have successfully registered. You can now sign in.',
          });

          // Set signUp to false to show the Sign In form
          this.signUp = false;
          this.username = '';
          this.email = '';
          this.password = '';  // Clear the form fields
        } else {
          notification.error({
            message: 'Registration Failed',
            description: response.message || 'An error occurred during registration.',
          });
        }
      } catch (error) {
        console.error('Registration Error:', error);
        notification.error({
          message: 'Registration Error',
          description: 'There was an error connecting to the server.',
        });
      }
    },

    async handleSignIn() {
      if (!this.email || !this.password) {
        notification.error({
          message: 'Validation Error',
          description: 'Please fill in all fields.',
        });
        return;
      }

      try {
        const response = await authService.login(this.email, this.password);

        if (response.token) {
          const authStore = useAuthStore();
          authStore.setAuthToken(response.token);
          this.$router.push('/homeview');  
        } else {
          notification.error({
            message: 'Login Failed',
            description: response.message || 'Invalid email or password.',
          });
        }
      } catch (error) {
        console.error('Login Error:', error);
        notification.error({
          message: 'Login Error',
          description: 'There was an error connecting to the server.',
        });
      }
    }
  }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
