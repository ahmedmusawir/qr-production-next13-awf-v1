import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGHLDataStore } from "@/store/useGHLDataStore";

interface FieldSelectorProps {
  onFieldSelect: (fieldId: string | null, fieldName: string | null) => void;
}

const FieldSelector = ({ onFieldSelect }: FieldSelectorProps) => {
  const { fields } = useGHLDataStore();

  return (
    <Select
      onValueChange={(value) => {
        if (value === "no_field") {
          onFieldSelect(null, "No Field"); // Handle "No Field" selection
        } else {
          const selectedField = fields.find(
            (field) => field.field_id === value
          );
          if (selectedField) {
            onFieldSelect(selectedField.field_id, selectedField.field_name);
          }
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Custom Field" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          <SelectItem value="no_field">No Field</SelectItem>{" "}
          {/* "No Field" option */}
          {fields.map((field) => (
            <SelectItem key={field.field_id} value={field.field_id}>
              {field.field_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FieldSelector;
