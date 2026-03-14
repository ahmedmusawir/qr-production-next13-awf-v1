export const fetchEvents = async () => {
  try {
    const response = await fetch("/api/qrapp/events", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return await response.json(); // { events: GHLEvent[], total: number }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const fetchEventOrders = async (
  eventId: string,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    // Construct the query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    // Construct the endpoint URL with the event ID
    const url = `/api/qrapp/events/${eventId}?${queryParams.toString()}`;

    // Make the GET request to the event orders endpoint with no cache
    const response = await fetch(url, { cache: "no-store" });

    // Handle the response
    if (!response.ok) {
      throw new Error("Failed to fetch event orders");
    }

    // Parse the response data
    const data = await response.json();
    return data; // Return the data for further use
  } catch (error) {
    console.error("Error fetching event orders:", error);
    throw error;
  }
};
