import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGapiStore } from './gapi'

export const useGapiCalendarStore = defineStore('gapiCalendar', () => {

  const gapi = useGapiStore ()

  const next_page_token = ref ( null )
  /**
   * Get the next 10 events starting now
   */
  async function get_events_list ( params ) {
    console.log('@gapiCalendar::get_events_list')
    // console.log('token',gapi.client.getToken())

    const maxResults = params.max_results
    const timeMin = params.date

    let response
    try {
      // Documentation: https://developers.google.com/workspace/calendar/api/v3/reference/events/list
      const request = {
        calendarId: 'primary',
        timeMin, //: timeMin.toISOString (),
        showDeleted: false,
        singleEvents: true, // Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.
        maxResults,
        orderBy: 'startTime', // The order of the events returned in the result. Optional. Options: startTime, updated

        // eventTypes: // Event types to return. Optional. This parameter can be repeated multiple times to return events of different types. If unset, returns all event types.
            // options: default, birthday, focusTime, fromGmail, outOfOffice, workingLocation
        // timeMax: // Upper bound (exclusive) for an event's start time to filter by. Optional.
        // timeMin: // Lower bound (exclusive) for an event's end time to filter by. Optional.
        // timeZone: // Time zone used in the response. Optional. The default is the time zone of the calendar.
        // maxAttendees: // The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
        pageToken: params.next_page_token // load next page (no going back)
        // q: // Free text search terms to find events that match these terms in the following fields: summary, description, location, attendee's name | email, organizer's name | email
      }
      response = await gapi.call_gapi (
        window.gapi.client.calendar.events.list,
        request
      )
      console.log('resp:', response)
      console.log('last date:', response?.result?.items [ response?.result?.items?.length - 1 ].start?.dateTime)

      //
      // set token to load next page
      next_page_token.value = response?.result?.nextPageToken
      console.log('has nextPageToken:', !!next_page_token.value, next_page_token.value )
    } catch (err) {
      return err.message
    }

    const events = response.result.items
    if ( !events || events.length == 0 ) {
      return 'No events found.'
    }

    return events
    // Flatten to string to display
    // output.value = events.reduce(
    //     (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
    //     'Events:\n')
    // document.getElementById('content').innerText = output
  }

  async function create_event ( event_data ) {
    try {
      const request = {
        calendarId: 'primary',
        resource: {
          summary: event_data.summary,
          location: event_data.location,
          description: event_data.description,
          start: {
            dateTime: event_data.start.date_time,
            timeZone: event_data.start.timezone,
          },
          end: {
            dateTime: event_data.end.date_time,
            timeZone: event_data.end.timezone,
          },
        }
      }
      const response = await gapi.call_gapi (
        window.gapi.client.calendar.events.insert,
        request
      )
      console.log('resp:', response)
      return response.result
      /**
       * {
    "result": {
        "kind": "calendar#event",
        "etag": "\"3542569234423710\"",
        "id": "fgbip21cus3n2r4duh9kqbqq2k",
        "status": "confirmed",
        "htmlLink": "https://www.google.com/calendar/event?eid=ZmdiaXAyMWN1czNuMnI0ZHVoOWtxYnFxMmtfMjAyNjAyMThUMTYwMDAwWiBub2xpYW5pLmNsZW1lbnRlQG0",
        "created": "2026-02-16T23:30:17.000Z",
        "updated": "2026-02-16T23:30:17.211Z",
        "summary": "Testing Summary",
        "description": "A chance to hear more about NCH's developer products.",
        "location": "800 Howard St., San Francisco, CA 94103",
        "creator": {
            "email": "noliani.clemente@gmail.com",
            "self": true
        },
        "organizer": {
            "email": "noliani.clemente@gmail.com",
            "self": true
        },
        "start": {
            "dateTime": "2026-02-18T11:00:00-05:00",
            "timeZone": "America/Chicago"
        },
        "end": {
            "dateTime": "2026-02-18T19:00:00-05:00",
            "timeZone": "America/Chicago"
        },
        "recurrence": [
            "RRULE:FREQ=DAILY;COUNT=2"
        ],
        "iCalUID": "fgbip21cus3n2r4duh9kqbqq2k@google.com",
        "sequence": 0,
        "attendees": [
            {
                "email": "sbrin@example.com",
                "responseStatus": "needsAction"
            },
            {
                "email": "lpage@example.com",
                "responseStatus": "needsAction"
            }
        ],
        "reminders": {
            "useDefault": false,
            "overrides": [
                {
                    "method": "email",
                    "minutes": 1440
                },
                {
                    "method": "popup",
                    "minutes": 10
                }
            ]
        },
        "eventType": "default"
    },
    "body": "{\n \"kind\": \"calendar#event\",\n \"etag\": \"\\\"3542569234423710\\\"\",\n \"id\": \"fgbip21cus3n2r4duh9kqbqq2k\",\n \"status\": \"confirmed\",\n \"htmlLink\": \"https://www.google.com/calendar/event?eid=ZmdiaXAyMWN1czNuMnI0ZHVoOWtxYnFxMmtfMjAyNjAyMThUMTYwMDAwWiBub2xpYW5pLmNsZW1lbnRlQG0\",\n \"created\": \"2026-02-16T23:30:17.000Z\",\n \"updated\": \"2026-02-16T23:30:17.211Z\",\n \"summary\": \"Testing Summary\",\n \"description\": \"A chance to hear more about NCH's developer products.\",\n \"location\": \"800 Howard St., San Francisco, CA 94103\",\n \"creator\": {\n  \"email\": \"noliani.clemente@gmail.com\",\n  \"self\": true\n },\n \"organizer\": {\n  \"email\": \"noliani.clemente@gmail.com\",\n  \"self\": true\n },\n \"start\": {\n  \"dateTime\": \"2026-02-18T11:00:00-05:00\",\n  \"timeZone\": \"America/Chicago\"\n },\n \"end\": {\n  \"dateTime\": \"2026-02-18T19:00:00-05:00\",\n  \"timeZone\": \"America/Chicago\"\n },\n \"recurrence\": [\n  \"RRULE:FREQ=DAILY;COUNT=2\"\n ],\n \"iCalUID\": \"fgbip21cus3n2r4duh9kqbqq2k@google.com\",\n \"sequence\": 0,\n \"attendees\": [\n  {\n   \"email\": \"sbrin@example.com\",\n   \"responseStatus\": \"needsAction\"\n  },\n  {\n   \"email\": \"lpage@example.com\",\n   \"responseStatus\": \"needsAction\"\n  }\n ],\n \"reminders\": {\n  \"useDefault\": false,\n  \"overrides\": [\n   {\n    \"method\": \"email\",\n    \"minutes\": 1440\n   },\n   {\n    \"method\": \"popup\",\n    \"minutes\": 10\n   }\n  ]\n },\n \"eventType\": \"default\"\n}\n",
    "headers": {
        "cache-control": "no-cache, no-store, max-age=0, must-revalidate",
        "content-encoding": "gzip",
        "content-length": "687",
        "content-type": "application/json; charset=UTF-8",
        "date": "Mon, 16 Feb 2026 23:30:17 GMT",
        "etag": "\"3542569234423710\"",
        "expires": "Mon, 01 Jan 1990 00:00:00 GMT",
        "pragma": "no-cache",
        "server": "ESF",
        "vary": "Origin, X-Origin, Referer"
    },
    "status": 200,7
    "statusText": null
  }
       */
    } catch (err) {
      return err.message
    }
  }

  async function update_event ( event_data ) {
    console.log("update_evetn::event_data", event_data)
    try {
      const request = {
        calendarId: "primary",
        eventId: event_data.id,
        resource: {
          summary: event_data.summary,
          location: event_data.location,
          description: event_data.description,
          start: {
            dateTime: event_data.start.date_time,
            timeZone: event_data.start.timezone,
          },
          end: {
            dateTime: event_data.end.date_time,
            timeZone: event_data.end.timezone,
          },
          // recurrence: [
          //   'RRULE:FREQ=DAILY;COUNT=2'
          // ],
          // attendees: [
          //   { email: 'lpage@example.com' },
          //   { email: 'sbrin@example.com' }
          // ],
          // reminders: {
          //   useDefault: false,
          //   overrides: [
          //     { method: 'email', 'minutes': 24 * 60 },
          //     { method: 'popup', 'minutes': 10 }
          //   ]
          // }
        },
        sendUpdates: "all",
      }
      // if ( event_data.id ) {
        console.log('@GAPICalendar::update_event::request', request)
        const response = await gapi.call_gapi (
          window.gapi.client.calendar.events.patch,
          request
        )
        console.log('resp:', response)
        return response.result
      // }
      // else {
      //   const response = await window.gapi.client.calendar.events.insert(request)
      //   console.log('resp:', response)
      //   return response.result
      // }
    } catch (err) {
      return err.message
    }
  }

  async function delete_event ( event_id ) {
    try {
      const request = {
        calendarId: "primary",
        eventId: event_id,
      }
      const response = await gapi.call_gapi (
        window.gapi.client.calendar.events.delete,
        request
      )
      console.log('resp:', response)
      return response.result
      /**
       * result: false
       * status: 204
       */
    } catch (err) {
      return err.message
    }
  }

  return {
    get_events_list,
    create_event,
    update_event,
    delete_event,
    next_page_token,
  }
})
