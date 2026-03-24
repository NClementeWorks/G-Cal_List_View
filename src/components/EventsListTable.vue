<!-- EventsListTable -->
<script setup>
  import EventsListRow from './EventsListRow.vue';

  import { useGapiStore } from '@/stores/gapi';
  const gapi_store = useGapiStore ()

  import { useEventsListStore } from '@/stores/eventsList';
  const events_list_store = useEventsListStore ()

  const headers = [
    {
      title: 'Title',
      key: 'summary',
      value: 'summary',
      width: '25%',
    },
    {
      title: 'Start Date/Time',
      key: 'start',
      value: 'start.dateTime',
      width: '17rem',
    },
    {
      title: 'End Date/Time',
      key: 'end',
      value: 'end.dateTime',
      width: '17rem',
    },
    {
      title: 'Location',
      key: 'location',
      value: 'location',
    },
    {
      title: 'Description',
      key: 'description',
      value: 'description',
    },
    {
      title: '',
      key: 'update',
      value: 'update',
    },
  ]
</script>

<template>
  <template v-if="gapi_store.gapi_ready">

    <VRow>
      <VCol>
        <VDataTableVirtual
          :items="events_list_store.events_list"
          :headers
          fixed-header
          height="calc( 80vh - 4rem)"
          :loading="events_list_store.searching_events || events_list_store.loading_more_events"
          >
          <template v-slot:item="{ item, itemRef }">
            <EventsListRow
              :key="item.value.key"
              :ref="itemRef"
              :calendar_event="item"
              ></EventsListRow>
          </template>
          <template #no-data>
            <h4>No Events Found</h4>
          </template>
          <template #bottom>
            <VBtn
              style="height: 4rem"
              variant="tonal"
              :color="events_list_store.loading_more_events ? 'indigo' : 'grey-darken-2'"
              :loading="events_list_store.loading_more_events"
              @click="events_list_store.load_more_events">
              Load More Events
            </VBtn>
          </template>
        </VDataTableVirtual>
      </VCol>
    </VRow>

  </template>
  <template v-else>
    <VSkeletonLoader type="table"></VSkeletonLoader>
  </template>
</template>
