document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
  
    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth", // Monthly view
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      events: async function (fetchInfo, successCallback, failureCallback) {
        try {
          // Replace with your Azure Function URL
          const functionAppUrl = "https://fa-databricks-connection.azurewebsites.net/api/STRCalendarHttpTrigger?code=hWZiOmVD1ETY3kokyMj_smTQZbSjhxTKh8rW2UBB5vFMAzFuxFX6vA%3D%3D";
          
          // Fetch events data
          const response = await fetch(functionAppUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const events = await response.json();
          
          // Pass events to FullCalendar
          successCallback(events);
        } catch (error) {
          console.error("Error fetching calendar events:", error);
          failureCallback(error);
        }
      }
    });
  
    calendar.render();
  });