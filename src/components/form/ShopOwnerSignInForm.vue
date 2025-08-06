<template>
  <div class="shop-owner-form w-full">
    <PriToast class="w-max" />
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      class="flex flex-wrap w-full"
      @submit="onFormSubmit"
    >
      <div class="w-full shop-owner-input">
        <div class="w-full my-2">
          <PriInputNumber
            name="ShopOwnerCode"
            type="text"
            :useGrouping="false"
            :min="0"
            placeholder="លេខកូដហាង"
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
            name="ShopOwnerEmail"
            type="text"
            placeholder="អ៊ីមែល"
            fluid
            v-model="initialValues.ShopOwnerEmail"
          />
          <PriMessage
            v-if="$form.ShopOwnerEmail?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.ShopOwnerEmail.error.message }}
          </PriMessage>
        </div>
        <small
          >តើអ្នកធ្លាប់មានបានបង្កើតហាងពីមុនអត់?
          <router-link to="/signup">បង្កើតថ្មី</router-link></small
        >
      </div>

      <CustomButton
        type="submit"
        :severity="true"
        :label="'ចូលប្រើប្រាស់'"
        class="w-full my-4"
        :loading="loading"
        :disabled="
          !initialValues.ShopOwnerEmail ||
          !initialValues.ShopOwnerCode ||
          $form.ShopOwnerEmail?.invalid ||
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
  ShopOwnerEmail: "",
  ShopOwnerCode: "",
});

const resolver = zodResolver(
  z.object({
    ShopOwnerEmail: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid email address." })
      .trim(),
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

const onFormSubmit = (e) => {
  if (e.valid) {
    console.log("ad", initialValues.value);
  }

  loading.value = true;
  setTimeout(() => {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
    loading.value = false;
  }, 2000);
};
</script>
<style scoped></style>
