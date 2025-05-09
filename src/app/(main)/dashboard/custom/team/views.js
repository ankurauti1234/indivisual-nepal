// Helper function to create time slots
function createTimeSlots() {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
}

const viewershipData = {
  ch1: {
    id: "ch1",
    name: "News Channel",
    viewership: createTimeSlots().map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Base viewership patterns for news channel
      let viewers = 50000; // Base viewers

      // Morning news peak (6 AM - 9 AM)
      if (timeInMinutes >= 360 && timeInMinutes < 540) {
        viewers = 250000 + Math.floor(Math.random() * 50000);
      }
      // Lunch time news (12 PM - 2 PM)
      else if (timeInMinutes >= 720 && timeInMinutes < 840) {
        viewers = 150000 + Math.floor(Math.random() * 30000);
      }
      // Evening news peak (6 PM - 10 PM)
      else if (timeInMinutes >= 1080 && timeInMinutes < 1320) {
        viewers = 300000 + Math.floor(Math.random() * 70000);
      }
      // Late night (10 PM - 12 AM)
      else if (timeInMinutes >= 1320) {
        viewers = 100000 + Math.floor(Math.random() * 20000);
      }
      // Early morning (12 AM - 6 AM)
      else if (timeInMinutes < 360) {
        viewers = 30000 + Math.floor(Math.random() * 10000);
      }

      return {
        time,
        viewers,
      };
    }),
  },

  ch2: {
    id: "ch2",
    name: "Entertainment",
    viewership: createTimeSlots().map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Base viewership patterns for entertainment channel
      let viewers = 70000; // Base viewers

      // Morning show (8 AM - 10 AM)
      if (timeInMinutes >= 480 && timeInMinutes < 600) {
        viewers = 200000 + Math.floor(Math.random() * 40000);
      }
      // Afternoon drama (12 PM - 4 PM)
      else if (timeInMinutes >= 720 && timeInMinutes < 960) {
        viewers = 180000 + Math.floor(Math.random() * 35000);
      }
      // Prime time peak (7 PM - 11 PM)
      else if (timeInMinutes >= 1140 && timeInMinutes < 1380) {
        viewers = 400000 + Math.floor(Math.random() * 100000);
      }
      // Late night (11 PM - 2 AM)
      else if (timeInMinutes >= 1380 || timeInMinutes < 120) {
        viewers = 150000 + Math.floor(Math.random() * 30000);
      }
      // Early morning (2 AM - 8 AM)
      else if (timeInMinutes < 480) {
        viewers = 40000 + Math.floor(Math.random() * 15000);
      }

      return {
        time,
        viewers,
      };
    }),
  },

  ch3: {
    id: "ch3",
    name: "Sports Channel",
    viewership: createTimeSlots().map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Base viewership patterns for sports channel
      let viewers = 60000; // Base viewers

      // Morning sports highlights (6 AM - 8 AM)
      if (timeInMinutes >= 360 && timeInMinutes < 480) {
        viewers = 150000 + Math.floor(Math.random() * 30000);
      }
      // Live soccer match (8:35 AM - 10:35 AM)
      else if (timeInMinutes >= 515 && timeInMinutes < 635) {
        viewers = 500000 + Math.floor(Math.random() * 100000);
      }
      // Live tennis match (1:05 PM - 3:05 PM)
      else if (timeInMinutes >= 785 && timeInMinutes < 905) {
        viewers = 300000 + Math.floor(Math.random() * 60000);
      }
      // Live basketball match (6:05 PM - 8:05 PM)
      else if (timeInMinutes >= 1085 && timeInMinutes < 1205) {
        viewers = 600000 + Math.floor(Math.random() * 120000);
      }
      // Late night sports (8:05 PM - 12 AM)
      else if (timeInMinutes >= 1205 && timeInMinutes < 1440) {
        viewers = 200000 + Math.floor(Math.random() * 40000);
      }
      // Early morning (12 AM - 6 AM)
      else if (timeInMinutes < 360) {
        viewers = 25000 + Math.floor(Math.random() * 10000);
      }

      return {
        time,
        viewers,
      };
    }),
  },
};

export default viewershipData;
