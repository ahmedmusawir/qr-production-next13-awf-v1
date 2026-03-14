import { GHLEvent } from "@/types/events";
import { useGHLDataStore } from "@/store/useGHLDataStore";
import EventItem from "./EventItem";

interface AdminEventListProps {
  filteredEvents: GHLEvent[];
  totalEvents: number;
}

const AdminEventList = ({ filteredEvents, totalEvents }: AdminEventListProps) => {
  const { currentPage, pageSize } = useGHLDataStore();

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // No events from backend at all
  if (totalEvents === 0) {
    return <p className="text-gray-500">No events found.</p>;
  }

  // Events exist but search returned nothing
  if (paginatedEvents.length === 0) {
    return <p className="text-gray-500">No events match your search.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
      {paginatedEvents.map((event) => (
        <EventItem key={event._id} event={event} />
      ))}
    </div>
  );
};

export default AdminEventList;
