import { defineStore } from 'pinia'
import { useDate } from 'vuetify'
import date_parser from 'any-date-parser'
import timezones from '@/assets/json/timezones'

export const useDateTimeStore = defineStore('dateTime', () => {

  const date_store = useDate()

  function extract_iso_date ( iso_date ) { return iso_date.split ( 'T' ) [ 0 ] }
  function extract_iso_time ( iso_date ) { return iso_date.split ( 'T' ) [ 1 ]?.split ( /\+|\-/ ) [ 0 ] }
  function extract_iso_timezone ( iso_date ) {
    return iso_date?.match( /(?<timezone>\+|\-\d{2}:\d{2})$/ )?.groups?.timezone
  }

  function concat_iso_datetime ( date, time, utc_timezone ) {
    console.log('concat_iso_datetime::utc_timezone',utc_timezone)
    const date_time = `${ date }T${ time }`
    console.log('concat_iso_datetime::date_time',date_time)
    const gmt = get_timezone_data ( date_time ).gmt//, utc_timezone )
    console.log('concat_iso_datetime::gmt',gmt)
    return `${ date_time }${ gmt }`
  }

  function format_js_date_to_iso ( date ) {
    const timezone = get_timezone_data ( date ).gmt
    const formatted_base_date = date_store.format ( date, 'fullDateTime12h' )
    const iso_date = format_date_to_iso ( formatted_base_date )
    const iso_time = format_time_to_iso ( formatted_base_date )
    const full_date = concat_iso_datetime ( iso_date, iso_time, timezone )
    return full_date
  }

  function format_date_to_iso ( date ) {
    const parsed_date = date_parser.attempt( date )
    // handle errors when no year, month or day
    const new_date = new Date (
      parsed_date.year || 2026,
      ( parsed_date.month - 1 ) || 0,
      parsed_date.day || 1
    )
    // const full_date = `${ new_date }T${ extract_iso_time ( time ) }`
    return extract_iso_date ( new_date.toISOString () )
  }

  function format_time_to_iso ( time ) {
    const parsed_time = time.match ( /(?<hour>\d{1,2})(:(?<minute>\d{2}))?( ?(?<am_pm>AM|PM|A|P))?$/i ).groups
    const adjusted_hour = parsed_time.hour == 12
      ? parsed_time.am_pm?.match ( /pm?/i )
        ? 12
        : 0
      : parsed_time.am_pm?.match ( /pm?/i )
        ? ( parseInt ( parsed_time.hour ) + 12 ) % 24
        : parseInt ( parsed_time.hour )
    const formatted_hour = adjusted_hour < 10 ? `0${ adjusted_hour }` : adjusted_hour
    const new_time = `${ formatted_hour }:${ parsed_time.minute || '00' }:00`//${ timezone }`
    return new_time
  }

  function get_iso_date_gmt ( iso_date, utc_timezone ) {
    return Intl.DateTimeFormat ( "en-US", {
          timeZone: utc_timezone,
          timeZoneName: "longOffset",
      } ).format ( new Date ( iso_date ) )
      .match ( /GMT(?<gmt>[+|-][\d:]+)/ ).groups.gmt
  }

  function get_timezone_data ( date ) {
    const gmt = new Date ( date ).toString ().match ( /(?<gmt>(?<=GMT)[-|+]\d+)/i ).groups.gmt
    const timezone_name = new Date ( date ).toString ().match ( /(?<timezone>(?<=\()[\w ]+(?=\)))/i ).groups.timezone
    console.log('timezone_name',timezone_name)
    const timezone_data = timezones.find ( t => t.value == timezone_name )
    // console.log('timezone_data',timezone_data)
    return {
      ...timezone_data,
      gmt: `${ gmt.slice ( 0, 3 ) }:${ gmt.slice ( 3 ) }`,
      // name: timezone_name,
    }
  }

  function to_two_digits ( date_time_number ) {
    return date_time_number < 10 ? `0${ date_time_number }` : date_time_number
  }

  // const today = new Date()
  // const tomorrow = date_store.addHours ( today, 24 )
  // const one_day_diff = today - tomorrow

  return {
    extract_iso_date,
    extract_iso_time,
    extract_iso_timezone,
    concat_iso_datetime,
    format_js_date_to_iso,
    format_date_to_iso,
    format_time_to_iso,
    get_iso_date_gmt,
    get_timezone_data,
    to_two_digits,
    // today,
    // tomorrow,
    // one_day_diff,
  }
})
