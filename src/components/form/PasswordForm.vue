<template>
    <div class="pwd-form p-3" v-if="!isShowPwdForm">
      <i
        v-if="isShowBackBtn"
        @click="($event) => $emit('onBackClick', $event)"
        class="pi pi-chevron-left text-blue-500 bg-blue-50 p-2 border-circle hover:bg-gray-200 cursor-pointer"
      ></i>
      <div class="logo text-center">
        <img src="/imgs/salon.png" alt="logo" />
      </div>
      <div class="form mt-4">
        <PriToast class="w-max" />
        <Form
          v-slot="$form"
          :initialValues="initialValues"
          :resolver="resolver"
          class="flex flex-wrap w-full"
          @submit="onFormSubmit"
        >
          <div class="w-full mt-2">
            <PriPassword
              name="Password"
              placeholder="Password"
              :feedback="false"
              toggleMask
              fluid
              v-model="initialValues.Password"
            />
            <PriMessage
              v-if="$form.Password?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              <ul class="my-0 px-4">
                <li
                  v-for="(error, index) of $form.Password.errors"
                  :key="index"
                >
                  {{ error.message }}
                </li>
              </ul>
            </PriMessage>
            <div class="forgot-pwd text-right mt-1">
              <span
                class="text-blue-500 underline cursor-pointer"
                @click="isShowPwdForm = true"
                >Forgot password</span
              >
            </div>
          </div>
          <CustomButton
            type="submit"
            :severity="true"
            :label="'បញ្ជាក់'"
            class="w-full my-4"
            :loading="loading"
            :disabled="
              !initialValues.Password || $form.Password?.invalid || loading
            "
          />
        </Form>
      </div>
    </div>
    <ForgotPwdForm v-else @onBackClick="isShowPwdForm = false" />
</template>

<script setup>
import { ref, inject } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import ForgotPwdForm from "./ForgotPwdForm.vue";
defineProps({
  isShowBackBtn: {
    type: Boolean,
    default: () => true,
  },
  additionalData : {
    type: Object,
    default: () => ({}),
  },
});
defineEmits(["onBackClick"]);

const $api = inject("$api");
const toast = useToast();
const loading = ref(false);
const isShowPwdForm = ref(false);
const additionalData = defineProps
const initialValues = ref({
  Password: "",
});
const resolver = zodResolver(
  z.object({
    Password: z
      .string()
      .min(3, { message: "Minimum 3 characters." })
      .max(8, { message: "Maximum 8 characters." })
      .refine((value) => /[a-z]/.test(value) && /[A-Z]/.test(value), {
        message: "At least one lower and uppercase letter.",
      })
      .refine(
        (value) =>
          /\d/.test(value) &&
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~]/.test(value),
        {
          message: "At least one number and special character.",
        }
      ),
  })
);

const onFormSubmit = (e) => {
  try {
    if (e.valid) {
      console.log(initialValues.value);
      console.log();
      loading.value = true;
      setTimeout(() => {
        toast.add({
          severity: "success",
          summary: "Form is submitted.",
          life: 3000,
        });
        loading.value = false;
      }, 2000);
    }
  } catch (error) {
    console.error("Form submission error:", error);
  }
};
</script>
<style scoped>
.pwd-form {
  margin: auto;
  width: 25%;
  box-shadow: #63636333 0px 2px 8px 0px;
  border-radius: 0.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
img {
  width: 60%;
  border-radius: 50%;
}
/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */
@media (min-width: 360px) and (max-width: 768px) {
  .pwd-form {
    width: 90%;
  }
}
</style>
