export const formatDate = (date) => {
    const hour = new Date(date).getHours();
    const minutes = new Date(date).getMinutes();
    let period = 'AM'; // Default period is 'AM'
  
    // Adjust hour and determine the period ('AM' or 'PM')
    let adjustedHour = hour;
    if (adjustedHour >= 12) {
      period = 'PM';
      adjustedHour -= 12;
    }
    if (adjustedHour === 0) {
      adjustedHour = 12;
    }
  
    return `${adjustedHour < 10 ? '0' + adjustedHour : adjustedHour}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
  };
  