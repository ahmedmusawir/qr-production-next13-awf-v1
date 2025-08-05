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
import {
  fetchCustomFields,
  fetchCustomFieldsDirect,
} from "@/services/fieldServices";
import SyncButtonBlock from "@/components/admin/sync-button/SyncButtonBlock";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react"; // You'll need to install lucide-react if not already

const AdminPortalPageContent = () => {
  const { setEvents, setFields } = useGHLDataStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // Load events function
  const loadEvents = async () => {
    try {
      const eventsData = await fetchEvents(currentPage, pageSize);
      setEvents(eventsData.events);
      setTotalPages(eventsData.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  // Load fields function - using direct fetch to bypass Next.js caching
  const loadFields = async () => {
    try {
      setIsRefreshing(true);
      // Try the direct fetch first, fall back to the API route if it fails
      try {
        const fieldsData = await fetchCustomFieldsDirect();
        setFields(fieldsData);
      } catch (directError) {
        console.warn(
          "Direct fetch failed, falling back to API route:",
          directError
        );
        const fieldsData = await fetchCustomFields();
        setFields(fieldsData);
      }
    } catch (error) {
      console.error("Failed to fetch fields:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      await loadEvents();
      await loadFields();
      setIsLoading(false);
    };

    initialLoad();
  }, [currentPage, pageSize]);

  // Handle refresh button click
  const handleRefresh = async () => {
    await loadFields();
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
