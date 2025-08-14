<template>
  <div class="pwd-form p-3" v-if="!isShowPwdForm">
    <i
      v-if="props.isShowBackBtn"
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
            name="NewPassword"
            placeholder="NewPassword"
            autocomplete
            :feedback="false"
            toggleMask
            fluid
            v-model="initialValues.NewPassword"
          />
          <PriMessage
            v-if="$form.NewPassword?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            <ul class="my-0 px-4">
              <li
                v-for="(error, index) of $form.NewPassword.errors"
                :key="index"
              >
                {{ error.message }}
              </li>
            </ul>
          </PriMessage>
        </div>
        <div class="w-full mt-2">
          <PriPassword
            name="ConfirmPassword"
            placeholder="ConfirmPassword"
            :feedback="false"
            autocomplete
            toggleMask
            fluid
            v-model="initialValues.ConfirmPassword"
          />
          <PriMessage
            v-if="$form.ConfirmPassword?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            <ul class="my-0 px-4">
              <li
                v-for="(error, index) of $form.ConfirmPassword.errors"
                :key="index"
              >
                {{ error.message }}
              </li>
            </ul>
          </PriMessage>
        </div>
        <CustomButton
          type="submit"
          :severity="true"
          :label="'បញ្ជាក់'"
          class="w-full my-4"
          :loading="loading"
          :disabled="
            !initialValues.NewPassword ||
            $form.NewPassword?.invalid ||
            !initialValues.ConfirmPassword ||
            $form.ConfirmPassword?.invalid ||
            loading
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
import { useRouter } from "vue-router";
import ForgotPwdForm from "./ForgotPwdForm.vue";
import { Password } from "primevue";
const props = defineProps({
  isShowBackBtn: {
    type: Boolean,
    default: () => true,
  },
  additionalData: {
    type: Object,
    default: () => ({}),
  },
  isForgotPwd: {
    type: Boolean,
  },

});
defineEmits(["onBackClick"]);

const $api = inject("$api");
const route = useRouter();
const toast = useToast();
const loading = ref(false);
const isShowPwdForm = ref(false);
const additionalData = ref(props.additionalData);
console.log("additionalData in resetPwdForm", additionalData.value);
const initialValues = ref({
  NewPassword: "",
  ConfirmPassword: "",
});
const resolver = zodResolver(
  z.object({
    NewPassword: z
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
    ConfirmPassword: z
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
  if (e.valid) {
    console.log(initialValues.value);
    loading.value = true;
    setTimeout(async () => {
      try {
        toast.add({
          severity: "success",
          summary: "Form is submitted.",
          life: 3000,
        });
        const body = {
          Code: Number(additionalData.value.ShopOwnerCode),
          Email: additionalData.value.Email,
          Password: initialValues.value.NewPassword,
          OtpCode: Number(additionalData.value.OtpCode),
          ConfirmPassword: initialValues.value.ConfirmPassword,
        };
        if (props.isForgotPwd) {
          await $api.user.forgotPassword(additionalData.value.TenantId, body);
        } else {
          const bodySetPwd = {
            Password: initialValues.value.NewPassword,
            ConfirmPassword: initialValues.value.ConfirmPassword,
          }
          await $api.user.setPassword(additionalData.value.TenantId, bodySetPwd);
        }
        route.push("/home");
        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.error("Form submission error:", error);
      }
    }, 2000);
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
