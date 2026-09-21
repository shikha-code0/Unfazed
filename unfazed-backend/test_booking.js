const assert = require('assert');

async function testBookingFlow() {
  const API_URL = 'http://localhost:5000/api';
  console.log('Testing booking flow against', API_URL);

  try {
    // 1. Get public slots for today + 1 day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format as YYYY-MM-DD in local time
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    console.log(`\nFetching slots for ${dateStr}...`);
    const slotsRes = await fetch(`${API_URL}/scheduling/public/dr-ananya-sharma/slots?date=${dateStr}`);
    const slotsData = await slotsRes.json();
    
    assert(slotsData.success, 'Failed to fetch public slots');
    console.log(`Found ${slotsData.slots.length} available slots.`);
    
    if (slotsData.slots.length === 0) {
      console.log('No slots available for tomorrow. Cannot test booking.');
      return;
    }

    const targetSlot = slotsData.slots[0];
    console.log(`Targeting slot: ${targetSlot.startTime} to ${targetSlot.endTime}`);

    // 2. Book a session
    console.log('\nBooking a session...');
    const bookingPayload = {
      therapistSlug: 'dr-ananya-sharma',
      clientName: 'Test Automation User',
      clientEmail: 'test.automation@example.com',
      clientPhone: '+919999999999',
      serviceType: 'Individual Therapy',
      sessionMode: 'Online',
      startTime: targetSlot.startTime,
      endTime: targetSlot.endTime,
      timezone: 'Asia/Kolkata',
      presentingConcern: 'Automated test booking',
      consentGiven: true
    };

    const bookRes = await fetch(`${API_URL}/scheduling/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });
    const bookData = await bookRes.json();
    
    assert(bookData.success, 'Failed to book session');
    console.log('Booking successful:', bookData.message);

    // 3. Verify the slot is no longer available
    console.log('\nRe-fetching slots to verify availability was reduced...');
    const reSlotsRes = await fetch(`${API_URL}/scheduling/public/dr-ananya-sharma/slots?date=${dateStr}`);
    const reSlotsData = await reSlotsRes.json();
    
    const reSlots = reSlotsData.slots;
    const stillExists = reSlots.some(s => s.startTime === targetSlot.startTime);
    assert(!stillExists, 'Slot is still available after booking!');
    console.log('Verified: Slot is no longer available.');

    console.log('\nAll booking API tests passed! ✅');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBookingFlow();
