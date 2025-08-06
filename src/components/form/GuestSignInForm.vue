<template>
  <div class="w-full guest-form">
    <PriToast class="w-max" />
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
            name="GuestName"
            type="text"
            placeholder="ឈ្មោះរបស់អ្នក"
            fluid
            v-model="initialValues.GuestName"
          />
          <PriMessage
            v-if="$form.GuestName?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.GuestName.error.message }}
          </PriMessage>
        </div>
        <div class="w-full my-2">
          <PriInputText
            name="GuestPhoneNumber"
            type="text"
            placeholder="លេខទូរស័ព្ទ"
            fluid
            v-model="initialValues.GuestPhoneNumber"
          />
          <PriMessage
            v-if="$form.GuestPhoneNumber?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.GuestPhoneNumber.error.message }}
          </PriMessage>
        </div>
      </div>

      <CustomButton
        type="submit"
        :severity="true"
        :label="'ចូលប្រើប្រាស់'"
        class="w-full my-4"
        :loading="loading"
        :disabled="
          !initialValues.GuestName ||
          !initialValues.ShopOwnerCode ||
          !initialValues.GuestPhoneNumber ||
          $form.GuestName?.invalid ||
          $form.GuestPhoneNumber?.invalid ||
          $form.ShopOwnerCode?.invalid ||
          loading
        "
      />
    </Form>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
const $api = inject("$api");
const refToChildCustomDialog = ref();

const selectedCategory = ref("Guest");
const categories = ref([
  { name: "Guest", key: "G", kh: "ភ្ញៀវ" },
  { name: "ShopOwner", key: "S", kh: "ម្ចាស់ហាង" },
]);

const createStudentInfo = async () => {
  try {
    // refToChildCustomDialog.value.openDialog();
    let classes = await $api.user.listUsers();
    console.log(classes);
  } catch (error) {
    console.log(error);
  }
};
const closeDialogStudentForm = () => {
  refToChildCustomDialog.value.closeDialog();
};

const toast = useToast();
const loading = ref(false);
const initialValues = ref({
  GuestName: "",
  GuestPhoneNumber: "",
  ShopOwnerCode: "",
});

const resolver = zodResolver(
  z.object({
    GuestName: z.string().trim().min(1, { message: "Name number is requird." }),
    GuestPhoneNumber: z
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

const onFormSubmit = async (e) => {
  try {
    if (e.valid) {
      loading.value = true;
      const body = {
        CodeShop: Number(initialValues.value.ShopOwnerCode),
        FullName: initialValues.value.GuestName,
        Phone: initialValues.value.GuestPhoneNumber,
        UserType: "GUEST",
      };
      console.log(body);
      // let guestLogin = await $api.user.guestLogin(body);
      // console.log(guestLogin.data);
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
</script>
<style scoped></style>
