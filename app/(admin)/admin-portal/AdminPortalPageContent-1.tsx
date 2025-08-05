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

const AdminPortalPageContent = () => {
  const { setEvents, setFields } = useGHLDataStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadEventsAndFields = async () => {
    try {
      setIsLoading(true);
      const eventsData = await fetchEvents(currentPage, pageSize);
      setEvents(eventsData.events);
      setTotalPages(eventsData.pagination.totalPages);

      const fieldsData = await fetchCustomFields();
      setFields(fieldsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadEventsAndFields();
  }, [currentPage, pageSize]);

  // Function to handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEventsAndFields();
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
          </div>
          <h2 className="mt-[-1.5rem]">Events list:</h2>
          <Button
            onClick={handleRefresh}
            disabled={refreshing || isLoading}
            variant="outline"
            size="sm"
            className="mb-5"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Fields
          </Button>

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
