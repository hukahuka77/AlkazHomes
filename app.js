document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth", // Monthly view
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    eventTimeFormat: { // Customize time display
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short'
    },
    eventDisplay: "block", // Show event blocks
    eventContent: function(arg) {
      // Customize event content to show only the title
      return { html: `<div>${arg.event.title}</div>` };
    },
    eventDidMount: function(info) {
      // Convert to US/Pacific timezone using Intl.DateTimeFormat
      const options = { 
        timeZone: "GMT", 
        year: "numeric", 
        month: "short", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit" 
      };
    
      const startDate = new Date(info.event.start).toLocaleString("en-US", options);
      const endDate = new Date(info.event.end).toLocaleString("en-US", options);
    
      // Tooltip for detailed information
      const tooltipContent = `
        <strong>${info.event.title}</strong><br>
        <em>${info.event.extendedProps.description || "No description available"}</em><br>
        <strong>Check-in:</strong> ${startDate}<br>
        <strong>Check-out:</strong> ${endDate}<br>
        <strong>Length of Stay:</strong> ${info.event.extendedProps.length}<span> nights<span/>
      `;
    
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.innerHTML = tooltipContent;
      document.body.appendChild(tooltip);
    
      // Position and show the tooltip on hover
      info.el.addEventListener("mouseenter", (e) => {
        tooltip.style.display = "block";
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
      });
    
      // Hide the tooltip when the mouse leaves
      info.el.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });
    }
  });

  const functionAppUrl = "https://fa-databricks-connection.azurewebsites.net/api/STRCalendarHttpTrigger?code=hWZiOmVD1ETY3kokyMj_smTQZbSjhxTKh8rW2UBB5vFMAzFuxFX6vA%3D%3D";

  fetch(functionAppUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      calendar.addEventSource(data);
    })
    .catch((error) => {
      console.error("Error fetching calendar events:", error);
    });

  calendar.render();
});

