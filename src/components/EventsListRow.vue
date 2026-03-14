<!-- EventsListRow -->
<script setup>

  import DateTimeInput from './DateTimeInput.vue';
  import StateBtn from './StateBtn.vue';
  import Status from '@/constants/status'
  // import date_parser from 'any-date-parser'
  import colors from 'vuetify/util/colors'
  import { computed, reactive, ref, watch } from 'vue';

  import { useDate } from 'vuetify'
  const date = useDate()

  // import { useDateTimeStore } from '@/stores/dateTime';
  // const date_time = useDateTimeStore ()

  import { useEventsListStore } from '@/stores/eventsList';
  const events_list_store = useEventsListStore ()

  const {
    calendar_event
  } = defineProps ({
    calendar_event: {
      type: Object,
      required: true,
    }
  })

  // console.log('calendar_event',calendar_event)
  const event_data = reactive ({
    is_new: calendar_event.value.is_new,
    key: calendar_event.value.key,
    id: calendar_event.value.id,
    summary: calendar_event.value.summary,
    start: {
      date_time: calendar_event.value.start.dateTime,
      timezone: calendar_event.value.start.timeZone,
    },
    end: {
      date_time: calendar_event.value.end.dateTime,
      timezone: calendar_event.value.end.timeZone,
    },
    location: calendar_event.value.location,
    description: calendar_event.value.description,
    save_status: calendar_event.value.save_status,
  })
  // console.log('event_data',event_data)

  const data_modified = computed ( () => {
    return event_data.summary !== calendar_event.value.summary
      || event_data.start.date_time !== calendar_event.value.start.dateTime
      || event_data.end.date_time !== calendar_event.value.end.dateTime
      || event_data.location !== calendar_event.value.location
      || event_data.description !== calendar_event.value.description
  })

  watch ( data_modified, value => {
    if ( value )
      event_data.save_status = Status.NONE
  })

  const event_data_updated = ref ( 0 )
  watch ( calendar_event.value, ( new_value ) => {
    event_data.is_new = false
    // event_data.key = new_value.key
    event_data.id = new_value.id
    // event_data.summary = new_value.summary
    // event_data.start.date_time = new_value.start.dateTime
    // event_data.end.date_time = new_value.end.dateTime
    // event_data.location = new_value.location
    // event_data.description = new_value.description
    // event_data_updated.value++
  })

  // watch ( () => event_data.start.date_time, ( new_date, old_date ) => {

      // console.log('WATCH::start::new_date',new_date)
      // console.log('WATCH::start::date_store.locale',date.locale)
      // console.log('WATCH::start::event_data.start',event_data.start)
      // console.log('WATCH::start::new Date',new Date (event_data.start.date_time))
      // const gmt = Intl.DateTimeFormat ( "en-US", {
      //     timeZone: event_data.start.timezone,
      //     timeZoneName: "longOffset",
      // } ).format ( new Date ( new_date ) )
      // .match ( /GMT(?<gmt>[+|-][\d:]+)/ ).groups.gmt
      // console.log('WATCH::start::gmt',gmt)

  //   if ( new Date ( event_data.end.date_time ) - new Date ( new_date ) <= 0 ) {
  //     console.log('WATCH::start::OLD-event_data.end.date_time', event_data.end.date_time)
  //     //
  //     // shift end date in the same ammount as the start date
  //     const diff = date.getDiff ( new Date ( new_date ), new Date ( old_date ) , 'minutes' )
  //     const new_end_date_parsed = date_parser.attempt ( date.format ( date.addMinutes ( event_data.end.date_time, diff ), 'fullDateTime24h' ) )

  //     console.log('WATCH::start::new_end_date_parsed', new_end_date_parsed, new Date(new_end_date_parsed) )
  //     const new_end_date = `${ new_end_date_parsed.year }-`
  //       + `${ date_time.to_two_digits ( new_end_date_parsed.month ) }-`
  //       + `${ date_time.to_two_digits ( new_end_date_parsed.day ) }T`
  //       + `${ date_time.to_two_digits ( new_end_date_parsed.hour ) }:`
  //       + `${ date_time.to_two_digits ( new_end_date_parsed.minute ) }:`
  //       // + `00${ new_timezone.gmt }`
  //       + `00`//${ date_time.extract_iso_timezone ( event_data.end.date_time ) }`
  //     const s_gmt = date_time.get_timezone_data ( new_date ).gmt//, event_data.end.timezone )
  //     const e_gmt = date_time.get_timezone_data ( event_data.end.date_time ).gmt//, event_data.end.timezone )
  //     const gmt = date_time.get_timezone_data ( new_end_date ).gmt//, event_data.end.timezone )
  //     console.log('WATCH::start::gmt', gmt, s_gmt, e_gmt)
  //     event_data.end.date_time = `${ new_end_date }${ gmt }`
  //     console.log('WATCH::start::event_data.end.date_time', event_data.end.date_time)
  //   }
  // })

  // watch ( () => event_data.end.date_time, ( new_date, old_date ) => {
  //   if ( new Date ( new_date ) - new Date ( event_data.start.date_time ) <= 0 ) {
  //     console.log('@WATCH::event_data.end.date_time', new_date, old_date)
  //   }
  // })

  //
  // Events
  //
  // const emits = defineEmits ([
  //   'update',
  //   'delete'
  // ])

  //
  // First element focus on newly added rows
  const summary_el = ref ( null )
  if ( event_data.is_new )
    watch ( summary_el, new_value => {
      if ( events_list_store.last_event_added?.value?.key === event_data.key )
        new_value.focus ()
    })

  //
  // VALIDATIONS
  //
  import { required, helpers } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'

  const is_date_before = compare => value => {
    const dates_compare = date.isBefore ( new Date ( value ), new Date ( compare ))
    const is_same_day = date.isSameDay ( new Date ( value ), new Date ( compare ))
    // const dates_compare = new Date ( value ) - new Date ( compare )
    // console.log('is_date_before::dates_compare',dates_compare,is_same_day, '\n',new Date ( compare ), new Date ( value ))
    return dates_compare || is_same_day//< date_time.one_day_diff
  }
  const is_time_before = compare => value => {
    const dates_compare = date.isBefore ( new Date ( value ), new Date ( compare ))
    // const dates_compare = date.isWithinRange ( new Date ( value ), new Date ( compare ))
    // const dates_compare = date. ( new Date ( value ), new Date ( compare ))
    // const dates_compare = new  Date ( value ) - new Date ( compare )
    return dates_compare //< 0 || dates_compare >= date_time.one_day_diff
  }

  const is_date_after = compare => value => {
    const dates_compare = date.isAfter ( new Date ( value ), new Date ( compare ))
    const is_same_day = date.isSameDay ( new Date ( value ), new Date ( compare ))
    // const dates_compare = new Date ( value ) - new Date ( compare )
    // console.log('is_date_after::dates_compare',dates_compare > date_time.one_day_diff, '\n',new Date ( compare ), new Date ( value ))
    return dates_compare || is_same_day
  }
  const is_time_after = compare => value => {
    const dates_compare = date.isAfter ( new Date ( value ), new Date ( compare ))
    // const dates_compare = new Date ( value ) - new Date ( compare )
    return dates_compare // > 0 || dates_compare <= date_time.one_day_diff
  }

  const validation_rules = {
    // summary: { required: helpers.withMessage ( 'Add a Title to your event', required ) },
    start: {
      date_time: {
        required,
        after_end_date: helpers.withMessage (
          'Start Date after or same as End Date',
          value => is_date_before ( event_data.end.date_time ) ( value )
        ),
        after_end_time: helpers.withMessage (
          'Start Time after or same as End Time',
          value => is_time_before ( event_data.end.date_time ) ( value )
        ),
      }
    },
    end: {
      date_time: {
        required,
        before_start_date: helpers.withMessage (
          'End Date before or same as Start Date',
          value => is_date_after ( event_data.start.date_time ) ( value )
        ),
        before_start_time: helpers.withMessage (
          'End Time before or same as Start Time',
          value => is_time_after ( event_data.start.date_time ) ( value )
        ),
      },
    },
  }

  const vuelidate = useVuelidate ( validation_rules, event_data )
  const upload_btn_visible = computed ( () => {
    console.log ( 'upload_btn_visible::save_status', event_data.save_status)
     return event_data.is_new
     || data_modified.value
     || ( !data_modified.value && event_data.save_status !== Status.NONE )
  })

  async function submit_event () {
    console.log('submit_event::event_data', event_data)
    vuelidate.value.$validate ()
    if ( !vuelidate.value.$error ) {
      event_data.save_status = Status.PROGRESS
      try {
        await events_list_store.update_event ( event_data )
        event_data.save_status = Status.SUCCESS
        setTimeout ( async () => {
          event_data.save_status = Status.NONE
        }, 2000)
      }
      catch ( err ) {
        event_data.save_status = Status.ERROR
        console.error ( err )
      }
    }
    else
      alert('Please, fix errors on event information')
  }


  const row_in_focus = ref ( false )
  const row_hovered = ref ( false )
</script>

<template>
  <tr
    :key="event_data_updated"
    :style="{
      background:
        event_data.is_new
        ? row_in_focus
          ? colors.green.lighten4
          : colors.green.lighten5
        : row_in_focus
        ? colors.indigo.lighten5
        : row_hovered
        ? colors.grey.lighten5
        : null
    }"
    @focusin="row_in_focus = true"
    @focusout="row_in_focus = false"
    @mouseenter="row_hovered = true"
    @mouseleave="row_hovered = false"
    >
    <td>
      <!-- :variant="vuelidate.summary.$error ? 'outlined' : 'plain'" -->
      <VTextField
        ref="summary_el"
        variant="plain"
        density="compact"
        hide-details
        single-line
        :placeholder="!event_data.summary || event_data.summary.trim ().length < 0 ? '(No title)' : ''"
        v-model="event_data.summary"
        >
        <!-- @blur="vuelidate.summary.$touch" -->
        <!-- :error-messages="vuelidate.summary.$errors?.map(e => e.$message)" -->
        <!-- <VTooltip
          v-if="vuelidate.summary.$error"
          activator="parent"
          location="top"
          :text="vuelidate.summary.$errors?.map(e => e.$message)"
          >
        </VTooltip> -->
      </VTextField>
    </td>
    <td>
      <DateTimeInput
        density="compact"
        hide-details
        single-line
        :errors="vuelidate.start.$errors"
        v-model="event_data.start"
        @blur_date="vuelidate.start.$touch"
        @blur_time="vuelidate.start.$touch"
        />
    </td>
    <td>
      <DateTimeInput
        density="compact"
        hide-details
        single-line
        :errors="vuelidate.end.$errors"
        v-model="event_data.end"
        @blur_date="vuelidate.end.$touch"
        @blur_time="vuelidate.end.$touch"
        />
      </td>
    <td>
      <VTextField
        variant="plain"
        density="compact"
        hide-details
        single-line
        :placeholder="!event_data.location || event_data.location.trim ().length < 0 ? '(No location)' : ''"
        v-model="event_data.location"
        >
      </VTextField>
    </td>
    <td>
      <VTextarea
        variant="plain"
        density="compact"
        hide-details
        single-line
        max-height="1"
        hide-spin-buttons
        :placeholder="!event_data.description || event_data.description.trim ().length < 0 ? '(No description)' : ''"
        v-model="event_data.description"
        >
      </VTextarea>
    </td>
    <td class="position-relative">
      <Transition name="fade_out">
        <div v-if="upload_btn_visible">
          <VTooltip
            location="top"
            :text="vuelidate.$invalid ? 'Please, fix errors' : `${ event_data.is_new ? 'Create' : 'Update' } in Google Calendar`"
            >
            <template v-slot:activator="{ props }">
              <StateBtn
                v-model="event_data.save_status"
                v-bind="props"
                icon="mdi-upload"
                :variant="event_data.is_new ? 'tonal' : 'plain'"
                :color="vuelidate.$invalid ? 'red-darken-4' : ( event_data.is_new ? 'green-darken-2' : null )"
                @click="submit_event"
              ></StateBtn>
                <!-- :loading="events_list_store.uploading_event" -->
            </template>
          </VTooltip>
        </div>
      </Transition>
      <div
        v-if="row_hovered && !event_data.is_new && !data_modified"
        >
        <!-- class="position-absolute d-flex flex-column justify-space-between"
        style="height: 180%; top:-1.4rem; z-index: 999;" -->
        <VTooltip
          location="top"
          text="Add new event before"
          >
          <template v-slot:activator="{ props }">
            <VBtn
              v-bind="props"
              class="position-absolute"
              style="top: -1.3rem"
              icon="mdi-plus"
              variant="tonal"
              color="indigo"
              size="small"
              @click="events_list_store.add_empty_event ( date.addHours ( event_data.start.date_time, -1 ) )"
              >
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip
          location="top"
          text="Add new event after"
          >
          <template v-slot:activator="{ props }">
            <VBtn
              v-bind="props"
              class="position-absolute"
              style="bottom: -1.3rem; z-index: 9;"
              icon="mdi-plus"
              variant="tonal"
              color="indigo"
              size="small"
              @click="events_list_store.add_empty_event ( event_data.end.date_time )"
              >
            </VBtn>
          </template>
        </VTooltip>
      </div>
    </td>
    <!-- <td><button @click="$emit ( 'delete', event_data.id )">{{ event_data.is_new ? 'Cancel' : 'Delete' }}</button></td> -->
  </tr>
</template>

