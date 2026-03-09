<!-- EventsListToolbar -->
<script setup>
  import DateTimeInput from './DateTimeInput.vue';
  // import { ref } from 'vue';

  import { useEventsListStore } from '@/stores/eventsList';
// import StateBtn from './StateBtn.vue';
// import { ref } from 'vue';
  const events_list_store = useEventsListStore ()

  // import { useDate } from 'vuetify'
  // const date_store = useDate()

  function add_event_for_today () {
    const new_date = new Date ()
    new_date.setMinutes ( 0 )
    new_date.setSeconds ( 0 )
    new_date.setMilliseconds ( 0 )
    events_list_store.add_empty_event ( new Date ( new_date ) )
  }

  function load_events () {
    console.log('Load Events-->',{
      date: events_list_store.search_from_date.date_time,
      max_results: events_list_store.items_per_page
    })
    events_list_store.load_events ({
      date: events_list_store.search_from_date.date_time,
      max_results: events_list_store.items_per_page
    })
  }

  // const btn = ref('')
</script>

<template>
  <VRow>
    <VCol class="d-flex align-center">
      <!-- <VLabel>From date:<VTextField>2026 / 02 / 20</VTextField></VLabel> -->
      <div class="w-50">
        <DateTimeInput
          variant="outlined"
          density="compact"
          hide-details
          single-line
          hide_time
          hide_weekday
          v-model="events_list_store.search_from_date"
          @keypress.enter="load_events"
          />
          <!-- :show_today -->
          <!-- @mouseenter="date_hover = true"
          @mouseleave="date_hover = false" -->
      </div>
      <VBtn
        variant="tonal"
        :color="events_list_store.searching_events ? 'indigo' : 'grey-darken-2'"
        @click="load_events"
        :loading="events_list_store.searching_events"
        >
        Load Events
      </VBtn>

    <!-- <StateBtn
      v-model="btn"
      icon="mdi-upload"
      variant="tonal"
      color="primary"
      ></StateBtn> -->


    </VCol>
    <VCol class="d-flex justify-end">
      <VBtn
        @click="add_event_for_today"
        color="indigo"
        prepend-icon="mdi-plus"
        >
        New Event
      </VBtn>
    </VCol>
  </VRow>
</template>
