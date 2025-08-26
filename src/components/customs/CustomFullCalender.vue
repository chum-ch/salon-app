<template>
  <PriToast class="w-max" />
  <FullCalendar ref="calendarRef" :options="calendarOptions" />

  <CustomDialog
    ref="dialogEvent"
    :modalHeader="'ការកក់សេវាកម្ម'"
    :hideFooter="true"
    :secondary="true"
  >
    <template #bodyDialog>
      <div class="">
        <Form
          v-slot="$form"
          :initialValues="initialValues"
          :resolver="resolver"
          class="flex flex-wrap w-full"
          @submit="submitEvent"
        >
          <div class="w-full my-2">
            <CustomDropdown
              :options="serviceOptions"
              :placeholder="'ជ្រើសរើសសេវាកម្ម'"
              :label="'ឈ្មោះសេវាកម្ម'"
              class="col-12 p-0"
              v-model="serviceSelection"
              @update:modelValue="getSelectOptionChange"
            />
            <PriMessage
              v-if="$form.ServiceName?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.ServiceName.error.message }}
            </PriMessage>
          </div>
          <div class="w-full my-2">
            <span>ពេលចាប់ផ្ដើម</span>
            <PriDatePicker
              id="datepicker-12h"
              name="StartDateTime"
              placeholder="ពេលចាប់ផ្ដើមធ្វើសេវាកម្ម"
              v-model="initialValues.StartDateTime"
              showTime
              hourFormat="12"
              fluid
              showIcon
              iconDisplay="input"
              dateFormat="yy-mm-dd"
              breakpoint="769px"
              :stepMinute="5"
              @value-change="handleDateChange"
            />
          </div>
          <div class="w-full my-2">
            <span>ពេលបញ្ចប់</span>
            <PriDatePicker
              placeholder="ពេលបញ្ចប់ធ្វើសេវាកម្ម"
              id="datepicker-12h"
              name="EndDateTime"
              v-model="initialValues.EndDateTime"
              showTime
              hourFormat="12"
              fluid
              showIcon
              iconDisplay="input"
              dateFormat="yy-mm-dd"
              breakpoint="769px"
              disabled
            />
          </div>
          <CustomButton
            type="submit"
            :severity="true"
            :label="'កក់សេវាកម្មឥឡូវ'"
            class="w-full my-4"
            :loading="loading"
            :disabled="
              !initialValues.StartDateTime ||
              !initialValues.EndDateTime ||
              $form.EndDateTime?.invalid ||
              $form.StartDateTime?.invalid ||
              !serviceSelection.Value ||
              loading
            "
          />
        </Form>
      </div>
    </template>
  </CustomDialog>
  <div
    v-if="isSelecting"
    class="real-time-popup"
    :style="{ top: popupTop + 'px', left: popupLeft + 'px' }"
  >
    <div class="popup-content text-xs">
      {{ selectionRange }}
    </div>
  </div>
  <CustomDialog
    ref="dialogDetailsEvent"
    :modalHeader="'ព័ត៌មានលំអិតអំពីការកក់សេវាកម្ម'"
    :hideFooter="true"
    :secondary="true"
  >
    <template #bodyDialog>
      <div class="details-event">
        <ul class="">
          <li class="">
            <div class="flex justify-between">
              <p class="w-7rem">ឈ្មោះសេវាកម្ម: </p>
              <p>{{ clickedEventDetails.title }}</p>
            </div>
          </li>

          <li class="">
            <div class="flex justify-between">
              <p class="w-7rem">ឈ្មោះភ្ញៀវ: </p>
              <p>{{ clickedEventDetails.GuestName }}</p>
            </div>
          </li>
          <li class="">
            <div class="flex justify-between">
              <p class="w-7rem">លេខទូរស័ព្ទ: </p>
              <a :href="`tel:${clickedEventDetails.PhoneNumber}`"> 
                <!-- <i class="pi pi-phone"></i> -->
              {{ clickedEventDetails.PhoneNumber }}</a>
            </div>
          </li>
          <li class="">
            <div class="flex justify-between">
              <p class="w-7rem">ពេលចាប់ផ្ដើម: </p>
              <p>{{ $helperFun.convertISODateToLocalTime(clickedEventDetails.start) }}</p>
            </div>
          </li>
          <li class="">
            <div class="flex justify-between">
              <p class="w-7rem">ពេលបញ្ចប់: </p>
              <p>{{ $helperFun.convertISODateToLocalTime(clickedEventDetails.end) }}</p>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useToast } from "primevue/usetoast";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { Form } from "@primevue/forms";
const toast = useToast();
const calendarRef = ref(null);
const isSelecting = ref(false);
const selectionStart = ref(null);
const dialogEvent = ref();
const dialogDetailsEvent = ref();
const loading = ref(false);
const $api = inject("$api");
const $constanceVariable = inject("$constanceVariable");
const $helperFun = inject("$helperFun");
// New reactive variables for the pop-up's position and content
const popupTop = ref(0);
const popupLeft = ref(0);
const selectionRange = ref("");
const objModel = {
  Service: {},
  StartDateTime: "",
  EndDateTime: "",
};
const initialValues = ref({ ...objModel });
const endDate = ref();
const clickedEventDetails = ref({
  ServiceName: "",
  GuestName: "",
  PhoneNumber: "",
  start: "",
  end: "",
});

// Load data from sessionStorage
const userInfo = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.UserInfo
);
let allServiceItems = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.AllServicesItems
);
if (allServiceItems) {
  allServiceItems = allServiceItems.map((item) => ({
    Value: item.Name,
    ID: item.EntityItemId,
    Duration: item.Duration,
  }));
}
const serviceOptions = ref(allServiceItems);
let itemService = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.ServiceItmeInfo
);
if (itemService) {
  itemService = allServiceItems.find(
    (item) => item.ID === itemService.EntityItemId
  );
}
const serviceSelection = ref(itemService);
const resolver = zodResolver(
  z.object({
    StartDateTime: z.preprocess((val) => {
      if (val === "" || val === null) {
        return null;
      }

      return new Date(val);
    }, z.union([z.date(), z.null().refine((val) => val !== null, { message: "Date is required." })])),
    EndDateTime: z.preprocess((val) => {
      if (val === "" || val === null) {
        return null;
      }

      return new Date(val);
    }, z.union([z.date(), z.null().refine((val) => val !== null, { message: "Date is required." })])),
  })
);

// Define the breakpoint for 'mobile' (e.g., 768 pixels)
// 1. Define the initial view based on the current window width
let initialViewSetting;
if (window.innerWidth < 768) {
  // Mobile view: 2-day time grid
  initialViewSetting = "timeGridTwoDay";
} else if (window.innerWidth < 992) {
  initialViewSetting = "timeGridFourDay";
} else {
  // Desktop/Tablet view: Full week time grid
  initialViewSetting = "timeGridWeek";
}

// Function to handle the click
const handleEventClick = (clickInfo) => {
  // 1. Extract necessary event data
  const event = clickInfo.event;

  // Store event data, including extended props, in a reactive variable
  clickedEventDetails.value = {
    title: event.title,
    start: event.startStr,
    end: event.endStr,
    ...event.extendedProps, // Include GuestName, PhoneNumber, etc.
  };

  // 2. Open the dialog
  dialogDetailsEvent.value.openDialog();
};
const calendarOptions = ref({
  plugins: [
    dayGridPlugin,
    interactionPlugin,
    listPlugin,
    timeGridPlugin,
    multiMonthPlugin,
  ],
  // Fuction
  dateClick: (info) => {
    openDialogEVent(info.dateStr);
  },

  selectOverlap: function (event) {
    return event.display === "background";
  },
  select: (info) => {
    openDialogEVent(info.startStr, info.endStr);
  },
  // editable: true,
  // dragScroll: true,
  // Time
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Set default the timezone to Cambodia 'Asia/Phnom_Penh'
  slotMinTime: "06:00:00",
  slotMaxTime: "24:00:00",
  // View
  initialView: initialViewSetting,
  // Other
  selectable: true,
  selectMirror: true,
  expandRows: true,
  height: 650,
  handleWindowResize: true,
  // navLinks: false, // can click day/week names to navigate views
  weekNumbers: true,
  // hiddenDays: [0, 3, 4, 5, 6, 7], // Exclude Sunday (0) and Saturday (6)
  // selectable: true,
  nowIndicator: true,
  dayMaxEvents: true, // allow "more" link when too many events
  allDaySlot: false, // Disable the all-day slot

  // Events
  // Get calendar event form parent
  eventClick: handleEventClick,
  eventDidMount: function (info) {
    const guestName = info.event.extendedProps.GuestName || "";
    const ph = info.event.extendedProps.PhoneNumber || "";
    const title = info.event.title || "";

    if (info.el.querySelector(".fc-event-title")) {
      info.el.querySelector(".fc-event-title").innerHTML = `
        <div class="event-title text-center font-bold">${title}</div>
        <div class="grid-container">
          <div class="grid-item">${ph}</div>
          <div class="grid-item">${guestName}</div>
        </div>
        `;
    }
  },
  events: [
    {
      title: "",
      start: "",
      end: "",
      extendedProps: {
        // className: '',
        GuestName: "",
        PhoneNumber: "",
      },
      //   backgroundColor: "green",
    },
  ],

  // Toolbar
  titleFormat: { year: "numeric", month: "short", day: "numeric" },
  headerToolbar: {
    // left: "today,timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear,listMonth",
    start: "prev,next today",
    end: "",
    center: "title",
  },
  views: {
    timeGridWeek: { buttonText: "week" },
    multiMonthYear: { buttonText: "Year" },
    dayGridMonth: { buttonText: "Month" },
    //   dayGridWeek: { buttonText: "Week" },
    //   listMonth: { buttonText: "Event" },
    timeGridTwoDay: {
      type: "timeGrid", // Base the view on the timeGrid (day/week columns with a vertical time axis)
      duration: { days: 2 }, // Specify the duration to be 2 days
      buttonText: "2 Day", // Optional: Text for a button if you add it to the headerToolbar
    },
    timeGridFourDay: {
      type: "timeGrid", // Base the view on the timeGrid (day/week columns with a vertical time axis)
      duration: { days: 4 }, // Specify the duration to be 2 days
      buttonText: "4 Day", // Optional: Text for a button if you add it to the headerToolbar
    },
  },
});

// Event handlers
const getDateTimeFromMousePosition = (e) => {
  const calendarApi = calendarRef.value.getApi();
  const calendarEl = calendarApi.el;
  const timeGrid = calendarEl.querySelector(".fc-timegrid-body");
  if (!timeGrid) return null;

  const timeGridCol = document
    .elementFromPoint(e.clientX, e.clientY)
    ?.closest(".fc-timegrid-col");
  if (!timeGridCol) return null;

  // 1. Get the date of the current column
  const dateStr = timeGridCol.getAttribute("data-date");
  const hoverDate = new Date(dateStr);

  // 2. Get the vertical position of the mouse relative to the column's top
  const colRect = timeGridCol.getBoundingClientRect();
  const mouseYRelativeToCol = e.clientY - colRect.top;

  // 3. Get the total height of the time slots in the column
  const timeGridSlotsHeight = timeGrid.offsetHeight;

  // 4. Calculate the total minutes in the visible time range
  const minTime = new Date("2025-01-01T06:00:00");
  const maxTime = new Date("2025-01-01T24:00:00");
  const totalVisibleMinutes =
    (maxTime.getTime() - minTime.getTime()) / (1000 * 60);

  // 5. Calculate the minutes offset from the start of the visible time
  const minutesOffset =
    (mouseYRelativeToCol / timeGridSlotsHeight) * totalVisibleMinutes;

  // 6. Add the minutes offset to the column's start time (06:00:00)
  hoverDate.setHours(6, 0, 0, 0);
  hoverDate.setMinutes(hoverDate.getMinutes() + minutesOffset);

  // Optional: Snap to the nearest 30-minute interval
  const snappedMinutes = Math.round(hoverDate.getMinutes() / 30) * 30;
  hoverDate.setMinutes(snappedMinutes, 0, 0);

  return hoverDate;
};

// Start of the selection
const handleMouseDown = (e) => {
  const dayCell = e.target.closest(".fc-daygrid-day, .fc-timegrid-slot");

  if (dayCell) {
    isSelecting.value = true;
    selectionStart.value = getDateTimeFromMousePosition(e);
    if (selectionStart.value) {
      // dayCell.classList.add("selection-start");
    }
  }
};

// Real-time tracking during selection
const handleMouseMove = (e) => {
  if (!isSelecting.value || !selectionStart.value) return;

  const currentHoverDate = getDateTimeFromMousePosition(e);

  if (currentHoverDate) {
    // Update the reactive pop-up content
    selectionRange.value = `${selectionStart.value.toLocaleTimeString()} - ${currentHoverDate.toLocaleTimeString()}`;

    // Update the pop-up's position
    popupTop.value = e.clientY + 50;
    popupLeft.value = e.clientX;
  }
};

// Combined function to end the selection
const endSelection = () => {
  if (isSelecting.value) {
    isSelecting.value = false;
  }
};

const openDialogEVent = (startDateTime, endDateTime = null) => {
  initialValues.value.StartDateTime = new Date(startDateTime);
  endDate.value = endDateTime || startDateTime;
  handleEndDateTime(endDateTime || startDateTime);
  dialogEvent.value.openDialog();
};
const handleEndDateTime = (endDateTime) => {
  const endDate = new Date(endDateTime);
  const addMinutes = serviceSelection.value.Duration ?? 0;
  endDate.setMinutes(endDate.getMinutes() + addMinutes);
  initialValues.value.EndDateTime = endDate;
};
const handleDateChange = (startDateTimeChange) => {
  handleEndDateTime(startDateTimeChange);
};
const closeDialogEvent = () => {
  initialValues.value = objModel;
  serviceSelection.value = itemService;
  dialogEvent.value.closeDialog();
};

const getSelectOptionChange = () => {
  handleEndDateTime(endDate.value);
};

const loadBookingsFromSessionStorage = async () => {
  const bookings = $helperFun.getSessionItem(
    $constanceVariable.SessionStorageKey.AllBookingsItems
  );
  if (bookings) {
    calendarOptions.value.events = bookings;
  }
};
const listBookings = async () => {
  try {
    if (userInfo) {
      const bookings = await $api.salon.listBookings(
        userInfo.TenantId,
        userInfo.EntityItemId
      );
      if (bookings.data) {
        const events = bookings.data.map((item) => ({
          title: item.Service.Name,
          start: item.StartDateTime,
          end: item.EndDateTime,
          extendedProps: {
            GuestName: item.User.FullName,
            PhoneNumber: item.User.Phone,
          },
          backgroundColor: item.Service.BackgroundColor,
        }));
  
        $helperFun.setSessionItem(
          $constanceVariable.SessionStorageKey.AllBookingsItems,
          events
        );
        loadBookingsFromSessionStorage();
      }
    }
  } catch (error) {
    console.error("List bookings error:", error);
  }
};

const submitEvent = (e) => {
  if (e.valid) {
    loading.value = true;
    setTimeout(async () => {
      try {
        toast.add({
          severity: "success",
          summary: "Form is submitted.",
          life: 3000,
        });

        initialValues.value.Service = {
          Name: serviceSelection.value.Value,
          Id: serviceSelection.value.ID,
        };
        const body = {
          ...initialValues.value,
          EndDateTime: $helperFun.getLocalISOStr(
            initialValues.value.EndDateTime,
            $constanceVariable.ReturnDateType.ISO_STR
          ),
          StartDateTime: $helperFun.getLocalISOStr(
            initialValues.value.StartDateTime,
            $constanceVariable.ReturnDateType.ISO_STR
          ),
        };
        if (userInfo) {
          await $api.salon.createBooking(
            userInfo.TenantId,
            userInfo.EntityItemId,
            body
          );
        }
        loading.value = false;
        await listBookings();
        closeDialogEvent();
      } catch (error) {
        loading.value = false;
        console.error("Form create event error:", error);
      }
    }, 2000);
  }
};

onMounted(async () => {
  await listBookings();
  const calendarEl = calendarRef.value.$el;
  calendarEl.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", endSelection);
  document.addEventListener("mouseleave", endSelection);
});
</script>

<style>
.real-time-popup {
  position: fixed;
  z-index: 1000;
  background: #ffffff5b;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  pointer-events: none; /* Prevents the pop-up from blocking mouse events on the calendar */
  transform: translate(-50%, -100%); /* Centers the pop-up on the cursor */
}

/* You can add custom styles to override FullCalendar defaults */
.fc-toolbar-title {
  /* font-size: 1.5rem; */
  font-weight: bold;
}

.fc-event-title-container {
  /* padding: 5px; */
  box-sizing: border-box;
  /* font-size: 12px; */
}
.grid-container {
  /* display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;  */
  /* display: flex;
  flex: wrap;
  justify-content: space-between; */
}
/* .grid-container .grid-item {
} */

.fc .fc-col-header-cell-cushion,
.fc-timegrid-axis-cushion,
.fc-daygrid-day-number {
  text-decoration: none;
  color: gray;
}
th {
  background: var(--vt-c-indigo);
}
.fc-event-time {
  display: none;
}
@media (max-width: 768px) {
  /* Tablet */
  .fc .fc-toolbar-title {
    font-size: 15px;
  }
  .fc-col-header-cell-cushion,
  .fc-timegrid-axis-cushion {
    font-size: 13px;
  }
}
@media (max-width: 500px) {
  tr a {
    font-size: 12px;
  }
  .fc-event-title-container {
    font-size: 11px;
  }
}
</style>
