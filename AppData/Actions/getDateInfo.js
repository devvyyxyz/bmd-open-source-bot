module.exports = {
    data: {
      name: "Get Date Info",
    },
    category: "Dates",
    UI: [
      {
        element: "typedDropdown",
        name: "Source",
        storeAs: "date",
        choices: {
          local: { name: "Current Time" },
          timestamp: { name: "Timestamp", field: true },
        }
      },
      "-",
      {
        element: "dropdown",
        name: "Get",
        storeAs: "get",
        choices: [
          {
            name: "ISO"
          },
          {
            name: "Normalized Date"
          },
          {
            name: "Timestamp"
          },
          {
            name: "Miliseconds" 
          },
          {
            name: "Seconds"
          },
          {
            name: "Minutes"
          },
          {
            name: "Hours"
          },
          {
            name: "Day"
          },
          {
            name: "Day of Week"
          },
          {
            name: "Month"
          },
          {
            name: "Month of Year"
          },
          {
            name: "Year"
          }
        ]
      },
      "-",
      {
        element: "store",
        storeAs: "store"
      }
    ],
    
    subtitle: (data, constants) => {return `Get: ${data.get} - Store As: ${constants.variable(data.store)}`},
    compatibility: ["Any"],
  
    async run(values, message, client, bridge) {
      let result;

      let date = new Date();
      if (values.date.type == 'timestamp') {
        date.setTime(bridge.transf(values.date.value))
      }
      
      switch (values.get) {
        case 'ISO':
          result = date.toISOString()
          break
        case 'Timestamp':
          result = date.getTime()
          break
        case 'Miliseconds':
          result = date.getMilliseconds()
          break
        case 'Seconds':
          result = date.getSeconds()
          break
        case 'Minutes':
          result = date.getMinutes();
          break
        case 'Hours':
          result = date.getHours();
          break
        case 'Day':
          result = date.getDate();
          break
        case 'Day':
          result = date.getDay();
          break
        case 'Day of Week':
          let days = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
          }
          result = days[date.getDay()]
          break
        case 'Month':
          result = Number(date.getMonth()) + 1;
          break
        case 'Month of Year':
          let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
          result = months[date.getMonth()]
          break
        case 'Year':
          result = date.getFullYear()
          break
        case 'Normalized Date':
          result = Math.trunc((date.getTime() / 1000))
          break;
      };

      bridge.store(values.store, result)
    },
  };
  