<template>
  <div class="p-2">
    <CustomDialog
      ref="dialogEvent"
      :modalHeader="'ការកក់សេវាកម្ម'"
      :hideFooter="true"
      @onClickCloseDialog="closeDialogEvent"
      @update:visible="closeDialogEvent"
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
              <span>ឈ្មោះសេវាកម្ម</span>
              <PriInputText
                name="ServiceName"
                type="text"
                placeholder="សេវាកម្ម"
                fluid
                v-model="initialValues.ServiceName"
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
              <span>លេខទូរស័ព្ទ</span>
              <PriInputText
                name="PhoneNumber"
                type="text"
                placeholder="លេខទូរស័ព្ទរបស់អ្នក"
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
                !initialValues.ServiceName ||
                !initialValues.StartDateTime ||
                !initialValues.EndDateTime ||
                !initialValues.PhoneNumber ||
                $form.ServiceName?.invalid ||
                $form.PhoneNumber?.invalid ||
                $form.EndDateTime?.invalid ||
                $form.StartDateTime?.invalid ||
                loading
              "
            />
          </Form>
        </div>
      </template>
    </CustomDialog>

    <FullCalendar ref="calendarRef" :options="calendarOptions" />
    <div
      v-if="isSelecting"
      class="real-time-popup"
      :style="{ top: popupTop + 'px', left: popupLeft + 'px' }"
    >
      <div class="popup-content">
        {{ selectionRange }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { Form } from "@primevue/forms";
const calendarRef = ref(null);
const isSelecting = ref(false);
const selectionStart = ref(null);
const dialogEvent = ref();
const loading = ref(false);
// New reactive variables for the pop-up's position and content
const popupTop = ref(0);
const popupLeft = ref(0);
const selectionRange = ref("");
const objModel = {
  ServiceName: "",
  PhoneNumber: "",
  StartDateTime: "",
  EndDateTime: "",
};
const initialValues = ref({ ...objModel });

const resolver = zodResolver(
  z.object({
    ServiceName: z
      .string()
      .trim()
      .min(1, { message: "Name number is requird." }),
    PhoneNumber: z
      .string()
      .trim()
      .min(1, { message: "Phone number is requird." })
      .refine((value) => /^\d+$/.test(value), {
        message: "No space and acept only numbers.",
      }),
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

const calendarOptions = reactive({
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
  timeZone: "Asia/Phnom_Penh", // Set the timezone to Cambodia
  slotMinTime: "06:00:00",
  slotMaxTime: "24:00:00",
  // View
  initialView: "timeGridWeek",
  // Other
  selectable: true,
  selectMirror: true,
  expandRows: true,
  height: 650,
  handleWindowResize: true,
  // navLinks: false, // can click day/week names to navigate views
  weekNumbers: true,
  hiddenDays: [0, 7], // Exclude Sunday (0) and Saturday (6)
  // selectable: true,
  nowIndicator: true,
  dayMaxEvents: true, // allow "more" link when too many events
  allDaySlot: false, // Disable the all-day slot

  // Events
  // Get calendar event form parent
  // eventClick: this.editEventCalendar,
  // eventDidMount: function (info) {
  //   const teacher = info.event.extendedProps.teacherName
  //   const roomName = info.event.extendedProps.roomName
  //   const courseName = info.event.extendedProps.courseName
  //   info.el.querySelector('.fc-event-title').innerHTML +=
  //     `
  //     <div class="grid-container">
  //       <div class="grid-item">${courseName}</div>
  //       <div class="grid-item">${teacher}</div>
  //       <div class="grid-item">${roomName}</div>
  //     </div>
  //     `
  // },
  events: [
    {
      title: "",
      start: "",
      end: "",
      extendedProps: {
        // className: '',
        teacherName: "",
        roomName: "",
      },
    },
    {
      title: "John - Haircut",
      start: "2025-08-23T07:30:00",
    },
    { title: "Jane - Manicure", end: "2025-08-23T09:00:00" },
    // {
    //   title: "Vue js",
    //   start: "2023-06-09T07:30:00",
    //   end: "2023-06-09T09:00:00",
    // },
    // {
    //   title: "event 1",
    //   date: "2023-06-10",
    // },
    // { title: "event 2", start: "2023-06-14T07:30:00" },
    // {
    //   title: "Birthday Party",
    //   start: "2023-06-11T00:00:00",
    //   end: "2023-06-11T24:00:00",
    //   backgroundColor: "green",
    // },
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
      dayCell.classList.add("selection-start");
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
  handleEndDateTime(endDateTime || startDateTime);
  dialogEvent.value.openDialog();
};
const handleEndDateTime = (endDateTime) => {
  const addMinutes = 30;
  const endDate = new Date(endDateTime);
  endDate.setMinutes(endDate.getMinutes() + addMinutes);
  initialValues.value.EndDateTime = endDate;
};
const handleDateChange = (startDateTimeChange) => {
  handleEndDateTime(startDateTimeChange);
};
const closeDialogEvent = () => {
  initialValues.value = objModel;
  dialogEvent.value.closeDialog();
};

const submitEvent = async (e) => {
  console.log("EVENT", initialValues.value);
};
onMounted(() => {
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
  padding: 5px;
  box-sizing: border-box;
  /* font-size: 12px; */
}
.grid-container {
  /* display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;  */
  display: flex;
  flex: wrap;
  justify-content: space-between;
}

.grid-item {
  /* text-align: center;
  display: flex;
  width: 100%; */
}
.fc .fc-col-header-cell-cushion,
.fc-timegrid-axis-cushion,
.fc-daygrid-day-number {
  text-decoration: none;
  color: gray;
}
.fc-event-time {
  display: none;
}
@media (max-width: 885px) {
  /* Tablet */
  .fc .fc-toolbar-title {
    /* font-size: 15px; */
  }
}
@media (max-width: 500px) {
  .fc .fc-dayGridMonth-button,
  .fc .fc-multiMonthYear-button,
  .fc .fc-timeGridWeek-button {
    display: none;
  }
  tr a {
    font-size: 12px;
  }
  .fc-event-title-container {
    font-size: 11px;
  }
}
</style>
