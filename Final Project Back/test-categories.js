require('dotenv').config();

(async () => {
  const apiKey = process.env.EVENTBRITE_PRIVATE_TOKEN;

  if (!apiKey) {
    console.log('Missing EVENTBRITE_PRIVATE_TOKEN in .env');
    return;
  }

  const url = 'https://www.eventbriteapi.com/v3/events/search/?q=car%20meeting&location.address=Italy&location.within=300km&page_size=20&expand=venue,category,subcategory';
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeout);

    const json = await res.json();

    if (!res.ok) {
      console.log('Error:', json.error || json.error_description || res.status);
      return;
    }

    const events = json.events || [];
    console.log('\n=== EVENTBRITE EVENTS (ITALY / CAR MEETING) ===\n');
    console.log('Total events in page:', events.length);

    if (events.length === 0) {
      console.log('No events found.');
      return;
    }

    events.slice(0, 10).forEach((event, idx) => {
      console.log(`${idx + 1}. ${event.name?.text || 'No title'}`);
      console.log(`   city: ${event.venue?.address?.city || 'N/A'} | region: ${event.venue?.address?.region || 'N/A'}`);
      console.log(`   start: ${event.start?.local || 'N/A'}`);
      console.log(`   category: ${event.category?.name || 'N/A'} | subcategory: ${event.subcategory?.name || 'N/A'}`);
    });
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
})();
