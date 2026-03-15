"use client";

import React, { useEffect, useState, useMemo } from "react";
import Page from "@/components/common/Page";
import Row from "@/components/common/Row";
import Spinner from "@/components/common/Spinner";
import { fetchEvents } from "@/services/eventServices";
import Head from "next/head";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminEventList from "@/components/admin/AdminEventList";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import { useGHLDataStore } from "@/store/useGHLDataStore";
import { fetchCustomFields } from "@/services/fieldServices";
import { RefreshCw } from "lucide-react";

const AdminPortalPageContent = () => {
  const {
    allEvents,
    setAllEvents,
    setFields,
    searchTerm,
    currentPage,
    pageSize,
    setCurrentPage,
    setSearchTerm,
  } = useGHLDataStore();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [eventsData, fieldsData] = await Promise.all([
        fetchEvents(),
        fetchCustomFields(),
      ]);
      setAllEvents(eventsData.events);
      setFields(fieldsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load once on mount, reset search on unmount
  useEffect(() => {
    loadData();
    return () => {
      setSearchTerm("");
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    // search is preserved; page clamping handled by the effect below
  };

  // Derive filtered list — search is case-insensitive, trimmed, partial match
  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allEvents;
    return allEvents.filter((e) => e.name.toLowerCase().includes(term));
  }, [allEvents, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));

  // Clamp currentPage if filtered results now have fewer pages (search or refresh)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  return (
    <>
      <Head>
        <title>Admin Portal</title>
        <meta name="description" content="Admin portal for managing events" />
      </Head>
      <Page className={""} FULL={false}>
        <Row className="prose max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="">Admin Portal</h1>
          </div>
          <h2 className="mt-[-1.5rem]">Events list:</h2>

          <div className="flex items-center gap-3 mb-5">
            <AdminSearchInput />
            <button
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-700 px-5 py-4 text-base font-medium text-gray-800 transition-colors hover:bg-gray-100 disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`h-5 w-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <Spinner />
          ) : (
            <AdminEventList
              filteredEvents={filteredEvents}
              totalEvents={allEvents.length}
            />
          )}

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
