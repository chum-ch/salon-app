<template>
  <PriToast class="w-max" />
  <div class="login-form p-3" v-if="!isShowPwdForm">
    <div class="logo text-center">
      <img src="/imgs/salon.png" alt="logo" />
    </div>
    <div class="w-full mb-2 mt-4 flex">
      <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        class="flex flex-wrap w-full"
        @submit="onFormSubmit"
      >
        <div class="w-full guest-input">
          <div class="w-full my-2">
            <PriInputNumber
              name="ShopOwnerCode"
              type="text"
              placeholder="លេខកូដហាង"
              :useGrouping="false"
              @input="resetCode"
              :min="0"
              fluid
              v-model="initialValues.ShopOwnerCode"
            />
            <PriMessage
              v-if="$form.ShopOwnerCode?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.ShopOwnerCode.error.message }}
            </PriMessage>
          </div>

          <div class="w-full my-2">
            <PriInputText
              name="FullName"
              type="text"
              placeholder="ឈ្មោះរបស់អ្នក"
              fluid
              v-model="initialValues.FullName"
            />
            <PriMessage
              v-if="$form.FullName?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.FullName.error.message }}
            </PriMessage>
          </div>
          <div class="w-full my-2">
            <PriInputText
              name="PhoneNumber"
              type="text"
              placeholder="លេខទូរស័ព្ទ"
              fluid
              v-model="initialValues.PhoneNumber"
            />
            <PriMessage
              v-if="$form.PhoneNumber?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.PhoneNumber.error.message }}
            </PriMessage>
          </div>
        </div>
        <!-- <small v-if="initialValues.IsSalonOwner"
          >តើអ្នកធ្លាប់មានបានបង្កើតហាងពីមុនអត់?
          <router-link to="/signup" class="text-bold"
            >បង្កើតថ្មី</router-link
          ></small 
        > -->
        <CustomButton
          type="submit"
          :severity="true"
          :label="'ចូលប្រើប្រាស់'"
          class="w-full my-4"
          :loading="loading"
          :disabled="
            !initialValues.FullName ||
            !initialValues.ShopOwnerCode ||
            !initialValues.PhoneNumber ||
            $form.FullName?.invalid ||
            $form.PhoneNumber?.invalid ||
            $form.ShopOwnerCode?.invalid ||
            loading
          "
        />
      </Form>
    </div>
  </div>
  <PasswordForm
    v-else-if="isShowPwdForm"
    @onBackClick="isShowPwdForm = false"
  />
</template>

<script setup>
import { ref, inject } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import PasswordForm from "./PasswordForm.vue";
import constanceVariable from "@/helper/constanceVariable";
import { useRouter } from "vue-router";
const $api = inject("$api");
const route = useRouter();
const resetCode = (event) => {
  initialValues.value.ShopOwnerCode = event.value;
};
const toast = useToast();
const loading = ref(false);
const isShowPwdForm = ref(false);
const initialValues = ref({
  ShopOwnerCode: "",
  FullName: "",
  PhoneNumber: ""
});

const resolver = zodResolver(
  z.object({
    FullName: z.string().trim().min(1, { message: "Name number is requird." }),
    PhoneNumber: z
      .string()
      .trim()
      .min(1, { message: "Phone number is requird." })
      .refine((value) => /^\d+$/.test(value), {
        message: "No space and acept only numbers.",
      }),

    ShopOwnerCode: z
      .union([
        z.string(),
        z
          .number()
          .int({ message: "Code must be an integer." })
          .min(1000, { message: "Code must be a 4-digit number." })
          .max(9999, { message: "Code must be a 4-digit number." }),
      ])
      .nullable()
      .refine((val) => val !== null, {
        message: "Code is required.",
      }),
  })
);

const checkOwnerLogin = (event) => {
  console.log(event);
  
}
const onFormSubmit = async (e) => {
  try {
    if (e.valid) {
      loading.value = true;
      const body = {
        CodeShop: Number(initialValues.value.ShopOwnerCode),
        FullName: initialValues.value.FullName,
        Phone: initialValues.value.PhoneNumber
      };
      console.log(body);
      
      setTimeout( async() => {
        toast.add({
          severity: "success",
          summary: "Form is submitted.",
          life: 3000,
        });
        loading.value = false;

        let login = await $api.user.userLogin(body);
        console.log(login.data);
        
        const { UserType } = login.data;
        switch (UserType) {
          case constanceVariable.UserType.Guest:
            route.push('/home')
            break;
          case constanceVariable.UserType.Owner:
            isShowPwdForm.value = true;
            break;
        
          default:
            break;
        }
      }, 2000);
    }
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
};
</script>
<style scoped>
.login-form {
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
  width: 70%;
  border-radius: 50%;
}
/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */
@media (min-width: 360px) and (max-width: 768px) {
  .login-form {
    width: 90%;
  }
}
</style>
