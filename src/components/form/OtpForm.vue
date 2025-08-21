<script setup>
import { ref, inject } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import { useRouter } from "vue-router";
import ResetPwdForm from "./ResetPwdForm.vue";

const $api = inject("$api");

const props = defineProps({
  isShowBackBtn: {
    type: Boolean,
    default: () => true,
  },
  email: {
    type: String,
  },
  additionalData: {
    type: Object,
    default: () => ({}),
  },
});
const route = useRouter();
const toast = useToast();
const loading = ref(false);
const isShowResetPwdForm = ref(false);
const initialValues = ref({
  Passcode: "",
});
const additionalData = ref(props.additionalData);
// console.log("additionalData in otpForm", additionalData.value);
const isShowSpinner = ref(false);
const isSuccess = ref(false);
const isError = ref(false);

const resendOTP = (email) => {
  isShowSpinner.value = true;
  setTimeout(async () => {
    try {
      toast.add({
        severity: "success",
        summary: "Form is submitted.",
        life: 3000,
      });

      await $api.user.resendOTP(additionalData.value.TenantId, {
        Email: email,
      });

      isShowSpinner.value = false;
      isSuccess.value = true;
    } catch (error) {
      console.error("Resend OTP error:", error);
      isShowSpinner.value = false;
      isError.value = true;
    }
  }, 2000);
};

const resolver = zodResolver(
  z.object({
    Passcode: z.string().min(1, { message: "OTP is required." }),
  })
);

const onFormSubmit = (e) => {
  if (e.valid) {
    loading.value = true;
    setTimeout(async () => {
      try {
        toast.add({
          severity: "success",
          summary: "Form is submitted.",
          life: 3000,
        });
        const body = { OTP: Number(initialValues.value.Passcode) };
        await $api.user.sendOTP(additionalData.value.TenantId, body);
        loading.value = false;
        isShowResetPwdForm.value = true;
        additionalData.value.Email = props.email;
        additionalData.value.OtpCode = initialValues.value.Passcode;
      } catch (error) {
        loading.value = false;
        console.error("Form otp error:", error);
      }
    }, 2000);
  }
};
defineEmits(["onBackClick"]);
</script>

<template>
  <div class="otp-form p-3"
    v-if="!isShowResetPwdForm"
  >
    <i
      v-if="props.isShowBackBtn"
      @click="($event) => $emit('onBackClick', $event)"
      class="pi pi-chevron-left text-blue-500 bg-blue-50 p-2 border-circle hover:bg-gray-200 cursor-pointer"
    ></i>
    <div class="logo text-center">
      <img src="/imgs/otp.png" alt="logo" />
    </div>
    <div class="verification-otp text-center mb-4">
      <h3 class="">ការផ្ទៀងផ្ទាត់សម្គាល់លេខកូដ OTP</h3>
      <h4 class="my-2">
        OTP បានផ្ញើទៅកាន់
        <span class="text-blue-500">{{ email }}</span>
      </h4>
    </div>
    <div class="form">
      <PriToast class="w-max" />
      <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        class="flex flex-wrap w-full"
        @submit="onFormSubmit"
        autocomplete="off"
      >
        <div class="w-full">
            <!-- mask -->
          <PriInputOtp
            name="Passcode"
            integerOnly
            v-model="initialValues.Passcode"
            :length="6"
            class="my-2"
          />
          <PriMessage
            v-if="$form.Passcode?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Passcode.error?.message }}
          </PriMessage>
          <div class="resend">
            <p>
              មិនទាន់ទទួលបានកូដ OTP?
              <span
                class="text-blue-500 underline cursor-pointer"
                @click="resendOTP(email)"
                >ផ្ញើម្ដងទៀត
              </span>
              <i
                class="pi pi-spin pi-spinner text-blue-500"
                v-if="isShowSpinner"
              ></i>
              <i
                class="pi pi-check-circle text-green-500"
                v-else-if="isSuccess"
              ></i>
              <i
                class="pi pi-times-circle text-red-500"
                v-else-if="isError"
              ></i>
            </p>
          </div>
        </div>

        <CustomButton
          type="submit"
          :severity="true"
          :label="'Verify'"
          class="w-full my-4"
          :loading="loading"
          :disabled="initialValues.Passcode.length !== 6 || loading"
        />
      </Form>
    </div>
  </div>
  <ResetPwdForm v-else @onBackClick="isShowResetPwdForm = false"
    :additionalData="additionalData"
  />
</template>

<style scoped>
.otp-form {
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
.p-inputotp {
  justify-content: space-between;
}
@media (min-width: 360px) and (max-width: 768px) {
  .login-form {
    width: 90%;
  }
}
</style>
