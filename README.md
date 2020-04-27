## Javascript Tasks

# Weather App #

* Visit [here](https://nil1729.github.io/Javascript/Weather-App) to see how it works.

### About Weather App ###

* This weather app will show the weather information that it will get from the API like this, an Icon that shows the weather status, the temperature value (18°C) in Celsius unit, the weather description (clear sky), and then the user's city and country (Delhi, IN). When the user clicks on the temperature value, that will convert it from Celsius to Fahrenheit.

* The icons I used for this web application are created by the Graphic Designer [Ashley Jager](https://github.com/manifestinteractive/weather-underground-icons).

* The API provider is [Open Weather Map](http://www.OpenWeatherMap.org).

# Github Profile Fetcher #

* Visit [here](https://nil1729.github.io/Javascript/Github-Profile-Fetcher/) to see how it works.

### About Github Profile Fetcher ###

*  When you type the **username** of an user on search Box and click on Search button this App will show you name, avatar, number of Github Repositories, number of followers of that user. Here we use the Github [api](https://api.github.com/users) key for fetching data of the users.


# To Do List App #

Visit [here](https://nil1729.github.io/Javascript/To-Do-List/) to see how it Works.

### About To Do List ###

* In this App, I use vanilla Javascript to create a beautiful and functional **To Do List**

* This To Do List has a beautiful UI, the user can add a To-Do by filling the input and hit ENTER or PLUS after that he can rather check the To-Do when it's done, or remove it using the delete button.

* The user's to-do list is stored in the local storage, so when he refreshes the page, he can always find the list there.

* There is the possibility for the user, to clear the list, by clicking the button clear, at the top right corner of our app.

* The to do list app, shows the today's date to the user, for that I used a method called **toLocaleDateString**

# Music Maker #

* Visit [here](https://nil1729.github.io/Javascript/Music-Maker/) to see how it Works.

# Clock #

* This is a simple Clock built using vanilla Javascript

* Visit [here](https://nil1729.github.io/Javascript/Clock/) to see how it Works.


# Animate On Scroll using CSS Grid #

* This webpage is built using simple Vanilla Javascript and CSS Grid. For this I use two Javascript DOM Property called [getBoundingClientRect()](https://www.w3schools.com/jsref/met_element_getboundingclientrect.asp) and [clientHeight](https://www.w3schools.com/jsref/prop_element_clientheight.asp).

* Visit [here](https://nil1729.github.io/Javascript/Animation-On-Scroll-Vanilla-JavaScript/) to see how it Works.

# Chrome-Extension (Basic) #

* This is a basic Chrome Extension named **Budget Manager** Which show your expenditures or Budget. You can also set the Limit of the Budget and Reset the Total by Going to **Options** Page. For add this in Chrome you first download the Chrome-Extension Folder or Create files like as in that Folder. Then go to `chrome://extensions/` and on **Developer Mode**, then click **load unpacked** and add your folder. This Extension also use the Chrome Storage to store your previous Expenditures and also give you notification when your Expenditure greater than your alloted Total Limit. :memo:

# SMS Sending App #

### About SMS Sending App ###
* This App is built using node.js and [`twilio api`](https://www.twilio.com/). This App firstly ask you to `enter` your `Phone Number`. Phone Number Must be with country code (eg: +91 for INDIA). Then It will send you random SMS which have random quote which is fetched from [`kanye.rest`](https://kanye.rest/) api. This app sending you sms after every 5 minutes when you run the code for 30 minutes duration.

### How do I get set up? ###

#### Configuration needed for run this Code (Environment): 

* For Sending SMS through `twilio api`, you must have a `twilio api` key. First of all Sign Up on [`twilio`](https://www.twilio.com/) and take your api key. 
* Open Your `Command Prompt` and run this code `node --version` , this will give out like `v12.16.1` . If you get error then you have to install `nodejs`.
* Save the file or open an editor, copy and paste the code and save as `send_sms.js`.
* In the code, on these lines `const accountSid = 'your_account_sid'`, `const authToken = 'your_auth_token'` put your own `ACCOUNT SID` and `AUTH TOKEN` respective, Which you get with your `twilio api` key.   
* In same directory where you save your `send_sms.js` file, run this code `npm install twilio` on `Command Prompt`
* Then run `npm install --save node-fetch`
* run `npm install prompt`
* All are setup now run `node send_sms.js` ans see Output. :email:

# Color-Game #

* This is a simple Color-Game built using vanilla Javascript

* Visit [here](https://nil1729.github.io/Javascript/Color-Game/) to see how it Works.
