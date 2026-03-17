import { defineStore } from 'pinia'
import { computed, ref } from 'vue';

export const useLoginStore = defineStore ( 'login', () => {

  const refresh_token = ref ( localStorage.getItem ( 'gclv_rtk' ) )
  console.log('login::refresh_token',refresh_token.value)

  const is_logged = computed ( () => {
    console.log('is_logged::refresh_token', refresh_token.value)
    return refresh_token.value?.length > 0 })

  async function handle_authentication () {
    console.log('get_auth_url')

    if ( refresh_token.value?.length ) {
      // log out
      // localStorage.removeItem ( 'gclv_rtk' )
      open_browser_popup ( `https://127.0.0.1/edsa-NC/gclv_login?logout`, () => {
        refresh_token.value = localStorage.getItem ( 'gclv_rtk' )
      } )
    }
    else {
      // log in
      open_browser_popup ( `https://127.0.0.1/edsa-NC/gclv_login?login`, () => {
        refresh_token.value = localStorage.getItem ( 'gclv_rtk' )
      } )
    }
  }

  function open_browser_popup ( url, on_close_fn ) {
    const popup = window.open ( url, 'Google Authentication','height=600,width=400')
    console.log('login::popup', popup)
    var popup_watcher = setInterval ( function () {
      // console.log('...popup active')
      if ( popup.closed ) {
        console.log('popup closed...')
        clearInterval ( popup_watcher )
        on_close_fn ()
      }
    }, 1000 )
  }

  return {
    refresh_token,
    is_logged,
    handle_authentication,
  }
})
