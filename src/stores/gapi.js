import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useDate } from 'vuetify'

export const useGapiStore = defineStore('gapi', () => {

  const date_store = useDate ()

  const gapi_ready = ref ( false )

  const CLIENT_ID = '441737119463-7b5dg9f26dt469bdfa7geju9u201lfsc.apps.googleusercontent.com'
  const API_KEY = 'AIzaSyBDHScfddAwNAk9hdKbG-sqXO8NVvDC984'

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'

  let gapiInited = false
  let gisInited = false

  /**
   * Callback after api.js is loaded.
   */
  function gapiLoaded () {
    window.gapi.load ('client', initializeGapiClient )
  }

  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */
  async function initializeGapiClient () {
    await window.gapi.client.init ({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    })
    gapiInited = true
    set_token()
  }

  /**
   * Callback after Google Identity Services are loaded.
   */
  function gisLoaded () {
    window.google.accounts.oauth2.initTokenClient ({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
      access_type: "offline",
      approval_prompt: "force",
    })
    gisInited = true
    set_token ()
  }

  /**
   * Enables user interaction after all libraries are loaded.
   */
  async function set_token () {
    if ( gapiInited && gisInited ) {
      console.log('gapi::set_token')
      const nonce = document.getElementById ( '_wpnonce' ).value
      console.log('set_token::nonce', nonce)
      const _test_env = new URL ( window.location.href ).searchParams.get ( "test" )

      const result = await fetch ( `${ window.location.origin }${ _test_env || '' }/wp-json/gclv/v1/auth_token?_wpnonce=${ nonce }`, {
        headers: {
          'X-WP-Nonce': nonce,
        }
      } )
      console.log('gapi::set_token::result', result)

      const json_result = await result.json ()
      console.log('gapi::set_token::json_result', json_result)
      if ( json_result.status !== 200 || json_result.token?.trim ().length <= 0 )
        alert ('Error getting google authentication token. If the problem persists, please contact your web master.')
      else {
        window.localStorage.setItem ( 'gclv_token_time', new Date ().getTime () )
        window.gapi.client.setToken ({
          "access_token": json_result.token,
          // "token_type": "Bearer",
          // "expires_in": 3599,
          // "scope": "https://www.googleapis.com/auth/calendar.readonly"
        })
        gapi_ready.value = true
      }
    }
  }

  async function call_gapi ( gapi_function, request ) {
    const last_token_time = new Date ( parseInt ( window.localStorage.getItem ( 'gclv_token_time' ) ) )
    const token_time_diff = date_store.getDiff ( new Date (), last_token_time, 'minutes' )
    console.log ( 'call_gapi::token_time_diff', token_time_diff, token_time_diff >= 55)
    if ( token_time_diff >= 55 ) {
      console.log ( 'call_gapi::token expired --> refreshing token...' )
      await set_token () // refresh auth token
    }
    const response = await gapi_function ( request )
    console.log ( 'call_gapi::response', response)
    return response
  }

  function load_js_script ( src, on_load ) {
    let fileref = document.createElement("script")
    fileref.setAttribute("type", "text/javascript")
    fileref.setAttribute("src", src)
    fileref.async = true

    if ( on_load )
      fileref.onload = on_load

    document.head.appendChild(fileref)
  }

  function load_gapi () {
    load_js_script ( 'https://apis.google.com/js/api.js', gapiLoaded )
    load_js_script ( 'https://accounts.google.com/gsi/client', gisLoaded )
  }

  return {
    load_gapi,
    gapi_ready,
    call_gapi,
   }
})
