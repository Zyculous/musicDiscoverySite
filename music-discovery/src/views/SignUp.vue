<template>
  <div class="auth-container">
    <button class="topButton" @click="toggleForm">{{ isSignUp ? 'Switch to Login' : 'Switch to Sign Up' }}</button>
    <div v-if="isSignUp">
      <h2>Sign Up</h2>
      <form @submit.prevent="handleSignUp">
        <div class="input-group">
          <label>Username: </label>
          <input type="text" v-model="signUpData.username" required />
        </div>
        <div class="input-group">
          <label>Email: </label>
          <input @input="validateEmail" type="email" v-model="signUpData.email" required />
          <span v-if="emailError" class="error">{{ emailError }}</span>
        </div>
        <div class="input-group">
          <label>Password: </label>
          <input @input="validatePassword" type="password" v-model="signUpData.password" required />
          <span v-if="passwordError" class="error">{{ passwordError }}</span>
        </div>
        <div class="input-group">
          <label>Repeat Password: </label>
          <input @input="validateRepeatPassword" type="password" v-model="signUpData.repeatPassword" required />
          <span v-if="repeatPasswordError" class="error">{{ repeatPasswordError }}</span>
        </div>
          <button type="submit">Sign Up</button>
      </form>
    </div>
    <div v-else>
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>Email: </label>
          <input @input="validateLoginEmail" type="email" v-model="loginData.email" required />
          <span v-if="loginEmailError" class="error">{{ loginEmailError }}</span>
        </div>
        <div class="input-group">
          <label>Password: </label>
          <input type="password" v-model="loginData.password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSignUp: true,
      signUpData: {
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
      },
      loginData: {
        email: '',
        password: ''
      },
      emailError: '',
      passwordError: '',
      repeatPasswordError: '',
      loginEmailError: ''
    };
  },
  methods: {
    validateEmail() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.emailError = emailPattern.test(this.signUpData.email) ? '' : 'Invalid email format';
      },
    validatePassword() {
      this.passwordError = this.signUpData.password.length >= 8 ? '' : 'Password must be at least 8 characters long';
    },
    validateRepeatPassword() {
      this.repeatPasswordError = this.signUpData.password === this.signUpData.repeatPassword ? '' : 'Passwords do not match';
    },
    validateLoginEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.loginEmailError = emailPattern.test(this.loginData.email) ? '' : 'Invalid email format';
    },
    toggleForm() {
      this.isSignUp = !this.isSignUp;
    },
    async handleSignUp() {
      this.validateEmail();
      this.validatePassword();
      this.validateRepeatPassword();
      if (this.emailError || this.passwordError || this.repeatPasswordError) {
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/signup',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.signUpData)
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Sign Up Successful:', data);
        } else {
          console.error('Sign Up Failed:', data);
        }
      }
      catch (error) {
        console.error('Sign Up Failed:', error);
      }
      // Handle sign up logic here
      console.log('Sign Up Data:', this.signUpData);
    },
    async handleLogin() {
      // Handle login logic here
      this.validateLoginEmail();
      if (this.loginEmailError) {
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/login',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.loginData)
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Login Successful:', data);
          localStorage.setItem('token', data.token);
          this.$router.push('/discover');
        } else {
          console.error('Login Failed:', data);
        }
      }
      catch (error) {
        console.error('Login Failed:', error);
      }
      console.log('Login Data:', this.loginData);
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  text-align: center;
  height: 70%;
}
.error {
    color: red;
    font-size: 0.875rem;
  }
  .input-group {
    margin-bottom: 1rem;
    text-align: left;
  }

  .input-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #d27961;
  }

  .input-group input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 10px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
button {
  margin-bottom: 20px;
  background-color: #188940; /* Spotify Green */
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.topButton {
  margin-bottom: 20px;
  background-color: #188940; /* Spotify Green */
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

button:hover {
  background-color: var(--color-border-hover);
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background-color:  #121212;
  color: white;
}
</style>
