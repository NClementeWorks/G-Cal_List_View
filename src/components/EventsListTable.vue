<!-- EventsListTable -->
<script setup>
  import EventsListRow from './EventsListRow.vue';

  import { useGapiStore } from '@/stores/gapi';
  const gapi_store = useGapiStore ()

  import { useEventsListStore } from '@/stores/eventsList';
  const events_list_store = useEventsListStore ()

  const this_year = new Date ().getFullYear ()
  const this_year_two_digit = this_year.toString ().substring(2)

  const accepted_date_time_formats = `<h4>Accepted date & time formats</h4>
    <br />
    <p>Just type in a date or time in any format and we will adjust it for you.</p>
    <p>These are some of the formats we accept:</p>
    <br />
    <h6>Dates</h6>
    <ul class="ml-8">
      <li>7-Mar-${ this_year }</li>
      <li>07 Mar ${ this_year_two_digit }</li>
      <li>Mar7,${ this_year_two_digit }</li>
      <li>Mar 7</li>
      <li>March 7 ${ this_year }</li>
      <li>Mar 7, ${ this_year }</li>
      <li>${ this_year }-03-07</li>
      <li>3-7-${ this_year_two_digit }</li>
      <li>${ this_year }/3/7</li>
      <li>03/07/${ this_year }</li>
      <li>3/7/${ this_year_two_digit }</li>
      <li>${ this_year }0307</li>
    </ul>
    <br />
    <h6>Times</h6>
    <ul class="ml-8">
      <li>9:26 PM</li>
      <li>9:26 p.m.</li>
      <li>9:26pm</li>
      <li>9pm</li>
      <li>9p</li>
      <li>21</li>
      <li>21:26</li>
    </ul>`

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
      hint: accepted_date_time_formats,
    },
    {
      title: 'End Date/Time',
      key: 'end',
      value: 'end.dateTime',
      width: '17rem',
      hint: accepted_date_time_formats,
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
          <template #headers="{ headers }">
            <th v-for="header in headers [0]" :key="header.key"
              :style="{
                width: header.width || 'unset',
                background: 'white',
              }"
              class="py-2 px-4 border-b-thin text-left"
              >
              <span class="opacity-80 font-weight-light">{{ header.title }}</span>
              <VIcon
                v-if="header.hint"
                :id="`${ header.key }_hint`"
                icon="mdi-information-variant-circle-outline"
                class="ml-1"
                color="blue-grey-lighten-4"
                ></VIcon>
                <VTooltip
                  :activator="`#${ header.key }_hint`"
                  >
                  <div
                    class="mt-4 mb-2 "
                    v-html="header.hint"
                    ></div>
                </VTooltip>
            </th>
          </template>
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
