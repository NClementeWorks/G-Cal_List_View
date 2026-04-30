# G-Cal_List_View

Version: 0.1-beta

This web application integrates with Google Calendar to present events in a streamlined list format rather than the usual calendar view. It was specifically designed to accelerate data entry, allowing for efficient creation of multiple events with predetermined dates and times.
This concept was developed when an organization I belong to had to add 23 new distinct events to their Google Calendar just for the next month and a half, and were clearly running behind on completing the task. This is a conceptual side-project.

## How to use

### 1. Log In
- Hover over the account icon on the top right corner of the screen to open the login menu.
- Click on the **Login to Google Calendar** button.
- A popup will appear with a Google login screen. Log in with your desired Google account.
- You may encounter a message from Google saying: *"Google hasn’t verified this app."* This will continue appearing while the application is in Beta version.
- Click **Advanced**, then select **Go to nolianiclemente.com (unsafe)**.
- A new screen will display the message *"nolianiclemente.com wants access to your Google Account."*
- Scroll to the bottom of this screen and click **Continue**.
- After completing these steps, the popup will close, and the app will load your upcoming events starting from the current date.

### 2. Adding New Events
- Click the **New Event** button in the upper-right corner of the events list.
- A green-highlighted row will appear for the current date and time. Additional events can be added between any existing events using the plus buttons that appear on hover.
- The cursor will be automatically placed on the first field of the new row, where you can enter the *Event Title*.
- Use the **Tab** key to navigate between fields.
- While the event is unsaved, its row remains green until all details are sent and successfully saved in your Google Calendar.

### 3. Deleting events
- This functionality is not supported on the current version.

## Dates
This app supports multiple date formats, eliminating the need for reformatting before entry. Dates are automatically converted to a standardized format (e.g., "Month Day, Year") once you exit the field (by pressing Tab or clicking outside).

Here are some key details about acceptable date formats:
- Dates are Case-insensitive: "Mar 7," "mar 7," and "MAR 7" all work.
- Spaces and comas can be skipped as long as clarity is not affected: "Mar7" is acceptable, but "Mar7,2026" will require a comma.
- When the year is not present, the current year will be automatically assumed.
- The app supports ordinal indicators: "Mar 7th" is valid.
- Commas separating day and year are optional: "Mar 7 2026" and "Mar 7, 2026" both work.
- As of the current version of the application, if an invalid date format is entered, the system may revert to a placeholder like January 1st of the current year or assign a random date. Always verify that your entered date was processed correctly by reviewing it once you exit the field.
- 
*Special thanks to Ken Snyder for his [any-date-parser](https://www.npmjs.com/package/any-date-parser) package.* For a full list of supported formats, refer to [Exhaustive list of date formats](https://www.npmjs.com/package/any-date-parser#user-content-exhaustive-list-of-date-formats).

## Times
- This application was also built to accept a wide range of time formats, as shown below.
- 
### All Time formats accepted
| Input     | Read as |
|-----------|---------|
| 9:26 PM   | 9:26 PM |
| 9:26 pm   | 9:26 PM |
| 9:26 P.M. | 9:26 PM |
| 9:26 p.m. | 9:26 PM |
| 9:26 P. M. | 9:26 PM |
| 9:26 p. m. | 9:26 PM |
| 9:26PM    | 9:26 PM |
| 9:26pm    | 9:26 PM |
| 9PM       | 9:00 PM |
| 9pm       | 9:00 PM |
| 9P        | 9:00 PM |
| 9p        | 9:00 PM |
| 9         | 9:00 AM |
| 09        | 9:00 AM |
| 21        | 9:00 PM |
| 21:26     | 9:26 PM |



## Project Setup
### Install dependencies
```sh
npm install
```

### Compile and Hot-Reload for Development
```sh
npm run dev
```

### Compile and Minify for Production
```sh
npm run build
```
