import { defineStore } from 'pinia'
import { useGapiCalendarStore } from '@/stores/gapiCalendar'
import { useDateTimeStore } from '@/stores/dateTime';
import { useDate } from 'vuetify'
import { ref } from 'vue'

export const useEventsListStore = defineStore('eventsList', () => {

  const gapi_calendar = useGapiCalendarStore ()
  const date_time_store = useDateTimeStore ()
  const date_store = useDate ()

  const events_list = ref ( [] )
  const search_from_date = ref ({
    date_time: date_time_store.format_js_date_to_iso ( new Date ( new Date ().setHours ( 0, 0, 0, 0 )).toString () ),
    timezone: 'America/Chicago',
  })
  console.log('eventsList::search_from_date', search_from_date.value)
  const items_per_page = ref ( 15 )
  const searching_events = ref ( false )
  const loading_more_events = ref ( false )

  async function load_events ( params ) {
    searching_events.value = true
    const results = await gapi_calendar.get_events_list ( params )
    console.log('load_events::results', results)
    events_list.value = results.map ( ( ev, idx ) => ref ({
      ...ev,
      key: events_list.value.length + idx,
      save_status: '',
    }) )
    searching_events.value = false
  }

  async function load_more_events () {
    loading_more_events.value = true
    console.log('@load_more_events...', gapi_calendar.next_page_token)
    let params = {
      date: search_from_date.value.date_time,
      max_results: items_per_page.value,
      next_page_token: gapi_calendar.next_page_token,
    }
    console.log('@load_more_events...PARAMS', params)
    const more_events_list = await gapi_calendar.get_events_list ( params )
    console.log('more_events_list',more_events_list)
    events_list.value = events_list.value.concat ( more_events_list.map ( ( ev, idx ) => ref ({
      ...ev,
      key: events_list.value.length + idx,
      save_status: '',
    }) ) )
    loading_more_events.value = false
  }

  const last_event_added = ref ( null )
  function add_empty_event ( _base_date ) {
    console.log('@add_empty_event-----')

    const base_date = new Date ( _base_date )
    const fomatted_start_date = date_time_store.format_js_date_to_iso ( base_date )

    const end_date = date_store.addHours ( base_date, 1 )
    const fomatted_end_date = date_time_store.format_js_date_to_iso ( end_date )

    const timezon_data = date_time_store.get_timezone_data ( new Date () )

    const blank_event = ref ({
      key: events_list.value.length,
      temp_id: base_date.getTime (),
      is_new: true,
      save_status: '',

      summary: '',
      location: '',
      description: '',
      start: {
        dateTime: fomatted_start_date,
        timeZone: timezon_data.utc [ 0 ],
      },
      end: {
        dateTime: fomatted_end_date,
        timeZone: timezon_data.utc [ 0 ],
      },
    })

    last_event_added.value = blank_event

    const splice_index = events_list.value.sort ( ( ev1, ev2 ) => new Date ( ev1.value.start.dateTime ) - new Date ( ev2.value.start.dateTime ) )
      .findLastIndex ( ev => new Date ( ev.value.start.dateTime ) < new Date ( base_date.toISOString() ) )
      + 1
    console.log('splice_index',splice_index)
    if ( splice_index >= events_list.value.length ) {
      events_list.value.push ( blank_event )
    }
    else {
      console.log('splice_index DATE', events_list.value [ splice_index ].value.start.dateTime )
      events_list.value.splice ( splice_index, 0, blank_event )
    }
    console.log ( 'Event added:\n', blank_event )
  }


  async function update_event ( event_data ) {
    console.log('update_event::event_data',event_data)
    console.log('update_event::events_list.value',events_list.value)

    let updated_event_result = null
    let event_to_update = null

    // const request = {
    //   id: event_data.id,
    //   summary: event_data.summary,
    //   location: event_data.location,
    //   description: event_data.description,
    //   start: {
    //     dateTime: event_data.start,
    //     timeZone: 'America/Chicago'
    //   },
    //   end: {
    //     dateTime: event_data.end,
    //     timeZone: 'America/Chicago'
    //   },
    // }
    // console.log('@EventsList::update_event::request', request)

    if ( event_data.id ) {
      updated_event_result = await gapi_calendar.update_event ( event_data )
    }
    else {
      updated_event_result = await gapi_calendar.create_event ( event_data )
    }
    event_to_update = events_list.value.find ( ev => ev.value.key === event_data.key )

    if ( updated_event_result ) {
      update_event_fields ( event_to_update, updated_event_result )
    }
    else {
      // @TODO Display error updating/creating event
    }
  }

  function update_event_fields ( event_to_update, updated_event_result ) {
    console.log('event_to_update AS Ref',event_to_update)
    console.log('updated_event_result',updated_event_result)
    event_to_update.value.id = updated_event_result.id
    event_to_update.value.summary = updated_event_result.summary
    event_to_update.value.start.dateTime = updated_event_result.start.dateTime
    event_to_update.value.end.dateTime = updated_event_result.end.dateTime
    event_to_update.value.location = updated_event_result.location
    event_to_update.value.description = updated_event_result.description
    event_to_update.value.is_new = false
  }

  async function delete_event ( event_id ) {
    const deleted_event_result = await gapi_calendar.delete_event ( event_id )
    if ( !deleted_event_result ) {
      const index_to_delete = events_list.value.findIndex ( ev => ev.id === event_id )
      events_list.value.splice ( index_to_delete, 1 )
    }
  }

  return {
    events_list,
    search_from_date,
    items_per_page,
    searching_events,
    loading_more_events,
    load_events,
    load_more_events,
    last_event_added,
    add_empty_event,
    update_event,
    delete_event,
  }

})
