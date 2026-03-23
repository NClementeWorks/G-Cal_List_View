<!-- EventsListToolbar -->
<script setup>
  import DateTimeInput from './DateTimeInput.vue';

  import { useEventsListStore } from '@/stores/eventsList';
  const events_list_store = useEventsListStore ()

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

</script>

<template>
  <VRow>
    <VCol class="d-flex align-center">
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
      </div>
      <VBtn
        variant="tonal"
        :color="events_list_store.searching_events ? 'indigo' : 'grey-darken-2'"
        @click="load_events"
        :loading="events_list_store.searching_events"
        >
        Load Events
      </VBtn>

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
