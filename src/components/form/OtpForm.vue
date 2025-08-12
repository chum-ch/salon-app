<script setup>
import { ref, inject } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { boolean, z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
const $api = inject("$api");

defineProps({
  isShowBackBtn: {
    type: Boolean,
    default: () => true,
  },
  email: {
    type: String
  },
});

const refToChildCustomDialog = ref();
const toast = useToast();
const loading = ref(false);
const initialValues = ref({
  Passcode: "",
});
const isShowSpinner = ref(false);
const isSuccess = ref(false);
const isError = ref(false);

// const createStudentInfo = async () => {
//   try {
//     // refToChildCustomDialog.value.openDialog();
//     let classes = await $api.user.listUsers();
//     console.log(classes);
//   } catch (error) {
//     console.log(error);
//   }
// };
// const closeDialogStudentForm = () => {
//   refToChildCustomDialog.value.closeDialog();
// };
const resendOTP = async (email) => {
  try {
    isShowSpinner.value = true;
    // await $api.user.resendOTP("Tenant:c02fac22e33441dea44ac78851e96a45", {
    //   Email: email,
    // });
    console.log('Rsend to', email);
    
    setTimeout(() => {
      toast.add({
        severity: "success",
        summary: "Form is submitted.",
        life: 3000,
      });
      isShowSpinner.value = false;
      isSuccess.value = true;
    }, 2000);
  } catch (error) {
    console.error(error);
    isShowSpinner.value = false;
    isError.value = true;
  }
};

const resolver = zodResolver(
  z.object({
    Passcode: z.string().min(1, { message: "OTP is required." }),
  })
);

const onFormSubmit = async (e) => {
  try {
    if (e.valid) {
      loading.value = true;
      const body = { OTP: Number(initialValues.value.Passcode) };
      console.log(body);

      // let otp = await $api.user.sendOTP(
      //   "Tenant:c02fac22e33441dea44ac78851e96a45",
      //   body
      // );
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
    loading.value = false;
    console.log(error);
  }
};
defineEmits(["onBackClick"]);
</script>

<template>
  <div class="otp-form p-3">
    <i v-if="isShowBackBtn" @click="($event) => $emit('onBackClick', $event)"
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
      >
        <div class="w-full">
          <PriInputOtp
            name="Passcode"
            mask
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
