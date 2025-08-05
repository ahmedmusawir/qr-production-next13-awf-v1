// Modified AdminPortalPageContent.tsx
"use client";
import React, { useEffect, useState } from "react";
import Page from "@/components/common/Page";
import Row from "@/components/common/Row";
import Spinner from "@/components/common/Spinner";
import { fetchEvents } from "@/services/eventServices";
import Head from "next/head";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminEventList from "@/components/admin/AdminEventList";
import { useGHLDataStore } from "@/store/useGHLDataStore";
import { fetchCustomFields } from "@/services/fieldServices";
import SyncButtonBlock from "@/components/admin/sync-button/SyncButtonBlock";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Define types for the custom fields
interface GHLCustomField {
  id: string;
  name: string;
  [key: string]: any; // For any other properties that might exist
}

interface FormattedField {
  field_id: string;
  field_name: string;
}

const AdminPortalPageContent = () => {
  const { setEvents, setFields } = useGHLDataStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  // Add a refresh counter to force re-renders
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Use a separate useEffect for fields that depends on refreshCounter
  useEffect(() => {
    const fetchFields = async () => {
      try {
        if (refreshCounter > 0) {
          setIsRefreshing(true);
        }

        // Add timestamp to URL to bypass cache
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/qrapp/fields?_t=${timestamp}`, {
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache, no-store, must-revalidate",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch custom fields");
        }

        const data = (await response.json()) as GHLCustomField[];
        console.log(
          `[React] Fetched ${data.length} fields at ${new Date().toISOString()}`
        );

        const formattedFields = data.map((field: GHLCustomField) => ({
          field_id: field.id,
          field_name: field.name,
        }));

        setFields(formattedFields);
      } catch (error) {
        console.error("Error fetching fields:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchFields();
  }, [refreshCounter, setFields]); // This will re-run whenever refreshCounter changes

  // Use a separate useEffect for events that depends on currentPage and pageSize
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        const eventsData = await fetchEvents(currentPage, pageSize);
        setEvents(eventsData.events);
        setTotalPages(eventsData.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [currentPage, pageSize, setEvents]);

  // Handle refresh button click - increment the counter to trigger a re-fetch
  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return (
    <>
      <Head>
        <title>Admin Portal</title>
        <meta name="description" content="Admin portal for managing events" />
      </Head>
      <Page className={""} FULL={false}>
        <Row className="prose max-w-3xl mx-auto">
          <section className="sync-btn-section">
            <SyncButtonBlock />
          </section>
          <div className="flex justify-between items-center">
            <h1 className="">Admin Portal</h1>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh Fields"}
            </Button>
          </div>
          <h2 className="mt-[-1.5rem]">Events list:</h2>

          {isLoading ? <Spinner /> : <AdminEventList />}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </Row>
      </Page>
    </>
  );
};

export default AdminPortalPageContent;
