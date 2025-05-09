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
  "NTV TV": {
    id: "NTV TV",
    name: "NTV TV",
    viewership: createTimeSlots().map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Base viewership patterns for NTV TV (News focused)
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

  "Kantipur TV": {
    id: "Kantipur TV",
    name: "Kantipur TV",
    viewership: createTimeSlots().map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Base viewership patterns for Kantipur TV (Entertainment focused)
      let viewers = 70000; // Higher base viewers

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

  "Avenues TV": {
    id: "Avenues TV",
    name: "Avenues TV",
    viewership: createTimeSlots().map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Base viewership patterns for Avenues TV (Sports focused)
      let viewers = 45000; // Base viewers

      // Morning fitness shows (5 AM - 7 AM)
      if (timeInMinutes >= 300 && timeInMinutes < 420) {
        viewers = 180000 + Math.floor(Math.random() * 40000);
      }
      // Morning sports news (7 AM - 9 AM)
      else if (timeInMinutes >= 420 && timeInMinutes < 540) {
        viewers = 250000 + Math.floor(Math.random() * 50000);
      }
      // Afternoon sports (2 PM - 5 PM)
      else if (timeInMinutes >= 840 && timeInMinutes < 1020) {
        viewers = 350000 + Math.floor(Math.random() * 80000);
      }
      // Evening prime sports (7 PM - 10 PM)
      else if (timeInMinutes >= 1140 && timeInMinutes < 1320) {
        viewers = 450000 + Math.floor(Math.random() * 100000);
      }
      // Late night sports recap (10 PM - 12 AM)
      else if (timeInMinutes >= 1320) {
        viewers = 150000 + Math.floor(Math.random() * 30000);
      }

      return {
        time,
        viewers,
      };
    }),
  },

  "Image Channel TV": {
    id: "Image Channel TV",
    name: "Image Channel TV",
    viewership: createTimeSlots().map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Base viewership patterns for Image Channel (Youth & Music focused)
      let viewers = 40000; // Base viewers

      // Morning music shows (8 AM - 11 AM)
      if (timeInMinutes >= 480 && timeInMinutes < 660) {
        viewers = 200000 + Math.floor(Math.random() * 45000);
      }
      // Afternoon youth programs (2 PM - 5 PM)
      else if (timeInMinutes >= 840 && timeInMinutes < 1020) {
        viewers = 280000 + Math.floor(Math.random() * 55000);
      }
      // Evening entertainment (6 PM - 9 PM)
      else if (timeInMinutes >= 1080 && timeInMinutes < 1260) {
        viewers = 350000 + Math.floor(Math.random() * 75000);
      }
      // Night music & entertainment (9 PM - 1 AM)
      else if (timeInMinutes >= 1260 || timeInMinutes < 60) {
        viewers = 220000 + Math.floor(Math.random() * 40000);
      }
      // Late night/early morning (1 AM - 8 AM)
      else if (timeInMinutes < 480) {
        viewers = 35000 + Math.floor(Math.random() * 12000);
      }

      return {
        time,
        viewers,
      };
    }),
  },

  "Himalayan TV": {
    id: "Himalayan TV",
    name: "Himalayan TV",
    viewership: createTimeSlots().map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Base viewership patterns for Himalayan TV (Documentary & Cultural focused)
      let viewers = 35000; // Base viewers

      // Morning cultural shows (6 AM - 9 AM)
      if (timeInMinutes >= 360 && timeInMinutes < 540) {
        viewers = 160000 + Math.floor(Math.random() * 35000);
      }
      // Documentary slot (10 AM - 1 PM)
      else if (timeInMinutes >= 600 && timeInMinutes < 780) {
        viewers = 220000 + Math.floor(Math.random() * 45000);
      }
      // Afternoon cultural programs (2 PM - 5 PM)
      else if (timeInMinutes >= 840 && timeInMinutes < 1020) {
        viewers = 180000 + Math.floor(Math.random() * 40000);
      }
      // Prime time documentaries (7 PM - 10 PM)
      else if (timeInMinutes >= 1140 && timeInMinutes < 1320) {
        viewers = 280000 + Math.floor(Math.random() * 60000);
      }
      // Late night cultural shows (10 PM - 12 AM)
      else if (timeInMinutes >= 1320) {
        viewers = 120000 + Math.floor(Math.random() * 25000);
      }

      return {
        time,
        viewers,
      };
    }),
  },

  "Sagarmatha TV": {
    id: "Sagarmatha TV",
    name: "Sagarmatha TV",
    viewership: createTimeSlots().map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Base viewership patterns for Sagarmatha TV (Business & News focused)
      let viewers = 55000; // Base viewers

      // Morning business news (7 AM - 10 AM)
      if (timeInMinutes >= 420 && timeInMinutes < 600) {
        viewers = 270000 + Math.floor(Math.random() * 55000);
      }
      // Market hours coverage (10 AM - 4 PM)
      else if (timeInMinutes >= 600 && timeInMinutes < 960) {
        viewers = 320000 + Math.floor(Math.random() * 65000);
      }
      // Evening business wrap (4 PM - 6 PM)
      else if (timeInMinutes >= 960 && timeInMinutes < 1080) {
        viewers = 290000 + Math.floor(Math.random() * 50000);
      }
      // Prime time business analysis (7 PM - 10 PM)
      else if (timeInMinutes >= 1140 && timeInMinutes < 1320) {
        viewers = 380000 + Math.floor(Math.random() * 80000);
      }
      // International market coverage (10 PM - 12 AM)
      else if (timeInMinutes >= 1320) {
        viewers = 180000 + Math.floor(Math.random() * 35000);
      }

      return {
        time,
        viewers,
      };
    }),
  },
};

export default viewershipData;
