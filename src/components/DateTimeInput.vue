<!-- DateTimeInput -->
<script setup>
  import { computed, watch } from 'vue';

  import { useDate } from 'vuetify'
  const date_store = useDate()

  import { useDateTimeStore } from '@/stores/dateTime';
  const date_time_store = useDateTimeStore ()

  const date_model = defineModel ()

  const {
    errors,
    hide_time,
    hide_weekday,
    show_today,
  } = defineProps ({
    errors: Array,
    hide_time: Boolean,
    hide_weekday: Boolean,
    show_today: {
      type: Boolean,
      default: false,
    }
  })

  let updated_date = date_model.value.date_time
  function commit_date () {
    date_model.value.date_time = updated_date
  }

  watch ( () => date_model.value.date_time, new_value => {
    updated_date = new_value
  })

  function blur_date () {
    emit('blur_date')
    commit_date ()
  }

  function blur_time () {
    emit('blur_time')
    commit_date ()
  }

  const date = computed ({
    get () {
      return date_store.format ( date_model.value.date_time, 'fullDate' )
    },
    set ( new_value ) {
      const new_date = date_time_store.format_date_to_iso ( new_value )
      const full_date = date_time_store.concat_iso_datetime (
        new_date,
        date_time_store.extract_iso_time ( date_model.value.date_time ),
        date_model.value.timezone
      )
      updated_date = full_date
    },
  })

  const time = computed ({
    get () {
      return date_store.format ( date_model.value.date_time, 'fullTime12h' )
    },
    set ( new_value ) {
      const new_time = date_time_store.format_time_to_iso ( new_value )
      const full_date = date_time_store.concat_iso_datetime (
        date_time_store.extract_iso_date ( date_model.value.date_time ),
        new_time,
        date_model.value.timezone
      )
      updated_date = full_date
    },
  })

  const emit = defineEmits ([
    'blur_date',
    'blur_time',
  ])

  const date_errors = computed ( () => errors?.filter ( err => err.$validator.match ( '_date' ) ))
  const time_errors = computed ( () => errors?.filter ( err => err.$validator.match ( '_time' ) ))

</script>

<template>
  <div
    class="position-relative"
    :class="{ date_time_wrapper: !hide_weekday }"
    >
    <template v-if="!hide_weekday">
      <label
        class="position-relative"
        :class="{ date_time_weekday_label: !hide_weekday }"
        >
        {{ date_store.format ( date_model.date_time, 'weekday' ) }}
      </label>
    </template>
    <!-- <pre>{{ errors }}</pre> -->

    <div class="d-flex align-center">
      <VTextField
        v-model="date"
        class="mr-4"
        :variant="$attrs.variant || ( date_errors?.length ? 'outlined' : 'plain' )"
        :density="$attrs.density"
        :hide-details="$attrs ['hide-details']"
        single-line
        :error-messages="date_errors?.map ( e => e.$message )?.join ( ' | ')"
        @blur="blur_date"
        >
        <VTooltip
          v-if="date_errors?.length"
          activator="parent"
          location="top"
          :text="date_errors?.map ( e => e.$message )?.join ( ' | ')"
          >
        </VTooltip>
        <template #append-inner>
          <VBtn
            v-if="show_today"
            variant="text"
            size="small"
            >
            Today
          </VBtn>
        </template>
      </VTextField>
      <VTextField
        v-if="!hide_time"
        v-model="time"
        :variant="$attrs.variant || ( time_errors?.length ? 'outlined' : 'plain' )"
        :density="$attrs.density"
        :hide-details="$attrs ['hide-details']"
        single-line
        :error-messages="time_errors?.map ( e => e.$message )?.join ( ' | ')"
        @blur="blur_time"
        >
        <VTooltip
          v-if="time_errors?.length"
          activator="parent"
          location="top"
          :text="time_errors?.map ( e => e.$message )?.join ( ' | ')"
          >
        </VTooltip>
      </VTextField>

      <!-- <label class="date_time_timezone_abbr">{{ timezone_data.abbr }}</label> -->
    </div>
  </div>
</template>
