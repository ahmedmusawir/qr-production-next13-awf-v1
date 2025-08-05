"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useGHLDataStore } from "@/store/useGHLDataStore";

interface GHLCustomField {
  id: string;
  name: string;
  [key: string]: any;
}

interface FormattedField {
  field_id: string;
  field_name: string;
}

const DirectFieldFetcher: React.FC = () => {
  const { setFields } = useGHLDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFieldsDirectly = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First get the token from our API
      const tokenRes = await fetch("/api/qrapp/ghl-token", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        cache: "no-store",
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to get GHL token");
      }

      const tokenData = await tokenRes.json();

      // Now make a direct request to GHL API
      const timestamp = Date.now();
      const ghlRes = await fetch(
        `https://services.leadconnectorhq.com/locations/${tokenData.locationId}/customFields?_nocache=${timestamp}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
            Version: "2021-07-28",
            Accept: "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        }
      );

      if (!ghlRes.ok) {
        throw new Error(`GHL API error: ${ghlRes.statusText}`);
      }

      const ghlData = await ghlRes.json();
      console.log("Raw GHL data:", ghlData);

      if (!ghlData.customFields || !Array.isArray(ghlData.customFields)) {
        throw new Error("Invalid response format from GHL API");
      }

      const formattedFields: FormattedField[] = ghlData.customFields.map(
        (field: GHLCustomField) => ({
          field_id: field.id,
          field_name: field.name,
        })
      );

      console.log(`Fetched ${formattedFields.length} fields directly from GHL`);
      console.log("Fields:", formattedFields);

      setFields(formattedFields);
    } catch (err: any) {
      console.error("Error fetching fields directly:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={fetchFieldsDirectly}
        disabled={isLoading}
        variant="destructive"
        size="sm"
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Fetching..." : "Force Fetch from GHL"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DirectFieldFetcher;
