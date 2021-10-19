<script>
import Layout from "../../layouts/auth";
import { authenticationMethod } from "@/state/helpers";

import { required, email } from "vuelidate/lib/validators";

export default {
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
      },
    ],
  },
  components: {
    Layout,
  },
  data() {
    return {
      email: "admin@gmail.com",
      password: "123456",
      formsubmit:false
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  computed: {
    isLogIn() {
      return this.$store.state.authentication.isLogIn;
    }
  },
  methods: {
    async submitForm() {
      this.formsubmit = true;
      
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.login({email:this.email,password:this.password});
        this.$router.push('/');
      }
    },
    
     ...authenticationMethod
  },
};
</script>

<template>
  <Layout>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="card overflow-hidden">
          <div class="bg-soft bg-primary">
            <div class="row">
              <div class="col-7">
                <div class="text-primary p-4">
                  <h5 class="text-primary">Welcome Back !</h5>
                  <p>Sign in to continue to Skote.</p>
                </div>
              </div>
              <div class="col-5 align-self-end">
                <img
                  src="@/assets/images/profile-img.png"
                  alt
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
          <div class="card-body pt-0">
            <div>
              <router-link tag="a" to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src="@/assets/images/logo.svg" alt height="34" />
                  </span>
                </div>
              </router-link>
            </div>

            <form action="#" @submit.prevent="submitForm">
              <div class="mt-3 form-group">
                <label for="useremail">Email</label>
                <input
                  type="email"
                  v-model="email"
                  class="form-control"
                  id="useremail"
                  placeholder="Enter email"
                  :class="{ 'is-invalid': formsubmit && $v.email.$error }"
                />
                <div
                  v-if="formsubmit && !$v.email.required"
                  class="invalid-feedback"
                >
                  Password is required.
                </div>
              </div>
              <div class="mt-3 form-group">
                <label for="pwd">Password</label>
                <input
                  type="password"
                  v-model="password"
                  class="form-control"
                  id="pwd"
                  placeholder="Enter password"
                  :class="{
                    'is-invalid': formsubmit && $v.password.$error,
                  }"
                />
                <div
                  v-if="formsubmit && !$v.password.required"
                  class="invalid-feedback"
                >
                  Password is required.
                </div>
              </div>
              <div class="mt-3 form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="remember-check"
                />
                <label class="form-check-label" for="remember-check">
                  Remember me
                </label>
              </div>
              <div class="mt-3 d-grid">
                <button type="submit" class="btn btn-primary btn-block">
                  <i v-if="this.$store.state.authentication.loginButonLoader" class="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                  Log In
                </button>
              </div>
              <div class="mt-4 text-center">
                <h5 class="font-size-14 mb-3">Sign in with</h5>

                <ul class="list-inline">
                  <li class="list-inline-item">
                    <a
                      href="javascript: void(0);"
                      class="
                        social-list-item
                        bg-primary
                        text-white
                        border-primary
                      "
                    >
                      <i class="mdi mdi-facebook"></i>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a
                      href="javascript: void(0);"
                      class="social-list-item bg-info text-white border-info"
                    >
                      <i class="mdi mdi-twitter"></i>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a
                      href="javascript: void(0);"
                      class="
                        social-list-item
                        bg-danger
                        text-white
                        border-danger
                      "
                    >
                      <i class="mdi mdi-google"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="mt-4 text-center">
                <router-link tag="a" to="/forgot-password" class="text-muted">
                  <i class="mdi mdi-lock me-1"></i> Forgot your password?
                </router-link>
              </div>
            </form>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->

        <div class="mt-5 text-center">
          <p>
            Don't have an account ?
            <router-link tag="a" to="/register" class="fw-medium text-primary"
              >Signup now</router-link
            >
          </p>
          <p>
            © {{ new Date().getFullYear() }} Skote. Crafted with
            <i class="mdi mdi-heart text-danger"></i> by Themesbrand
          </p>
        </div>
        <!-- end row -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>
