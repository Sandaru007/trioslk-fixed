// Mock Zoom API Service
// In a real application, this would call the actual Zoom API to create a meeting

const generateMockZoomLink = async (sessionTitle) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const meetingId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const passCode = Math.random().toString(36).slice(-6);
  
  // Format based on Zoom standard links
  const joinUrl = `https://zoom.us/j/${meetingId}?pwd=${passCode}`;

  return {
    join_url: joinUrl,
    meeting_id: meetingId,
    password: passCode
  };
};

module.exports = {
  generateMockZoomLink
};
