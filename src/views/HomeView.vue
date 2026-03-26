<script setup>
  import EventsListToolbar from '@/components/EventsListToolbar.vue'
  import EventsListTable from '@/components/EventsListTable.vue'

  import { toRefs, watch } from 'vue'

  import { useEventsListStore } from '@/stores/eventsList'
  const events_list_store = useEventsListStore ()

  import { useGapiStore } from '@/stores/gapi'
  const gapiStore = useGapiStore ()
  const {
    gapi_ready,
  } = toRefs ( gapiStore )

  watch ( gapi_ready, async new_value => {
    console.log('gapi_ready::new_value', new_value)
    events_list_store.load_events_for_today ()
  })

</script>

<template>
    <VMain>
      <VContainer style="min-width: 95%;">
        <VRow>
          <VCol>
            <VCard>

              <EventsListToolbar></EventsListToolbar>
              <EventsListTable></EventsListTable>

            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
</template>
