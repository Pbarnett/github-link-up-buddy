
import AutoBookingSection from './AutoBookingSection';

// Booking method form data interface
interface BookingMethodFormData {
  auto_book_enabled?: boolean;
  [key: string]: unknown;
}

interface BookingMethodSectionProps {
  control: Control<any>;
}

const BookingMethodSection = ({ control }: BookingMethodSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          How You'd Like to Book
        </h2>
        <AutoBookingSection control={control} />
      </div>
    </div>
  );
};

export default BookingMethodSection;
