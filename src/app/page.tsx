"use client";

import { Button } from "@/components/button";
import { InfoBox } from "@/components/info-box";
import { Logo } from "@/components/logo";
import { Map } from "@/components/map";
import { reportSchema } from "@/schema/report";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

export default function MapPage() {
  const router = useRouter();
  const [loadingCoordinates, setLoadingCoordinates] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [reports, setReports] = useState<z.infer<typeof reportSchema>[]>([]);
  const [viewingReport, setViewingReport] = useState(false);
  const [viewingReportIdx, setViewingReportIdx] = useState<number>(0);
  const viewingReportData = reports.length ? reports[viewingReportIdx] : null;

  const locationInterval = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    // setInterval(() => {
    //   navigator.geolocation.getCurrentPosition((r) => {
    //     setCoordinates([r.coords.latitude, r.coords.longitude]);
    //   });
    // }, 500);

    fetch(
      `${
        process.env.NEXT_PUBLIC_BLOB_ENDPOINT
      }/report.json?random=${Math.random()}`,
      {
        cache: "no-cache",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
      });

    return () => {
      locationInterval.current && clearInterval(locationInterval.current);
    };
  }, []);

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((r) => {
      setCoordinates([r.coords.latitude, r.coords.longitude]);
    });

    setInterval(() => {
      navigator.geolocation.getCurrentPosition((r) => {
        setCoordinates([r.coords.latitude, r.coords.longitude]);
      });
    }, 2000);
  };

  return (
    <main className="absolute w-screen h-screen overflow-hidden md:relative md:w-full">
      {coordinates ? (
        <div className="absolute inset-0 p-4 pb-20 flex flex-col ">
          {viewingReportData && (
            <div
              className={`absolute bottom-0 left-0 right-0 backdrop-blur-lg bg-gradient-to-t from-darkBlue via-darkBlue to-secondary/50 gradient rounded-t-xl duration-300 pt-4 px-8 ${
                viewingReport ? "translate-y-0" : "translate-y-[110%]"
              }`}
            >
              <h2 className="font-jaro text-darkBlue text-2xl text-center mb-8 bg-primary px-4 py-2 -mt-8 rounded-md border-2 border-black">
                Report {viewingReportIdx + 1}
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 mb-8">
                <InfoBox
                  title="Category"
                  value={viewingReportData.objectCategory}
                />
                <InfoBox title="Object" value={viewingReportData.object} />
                {(viewingReportData.manufacturer ||
                  viewingReportData.manufacturerIsIrrelevant !== true) && (
                  <InfoBox
                    title="Manufacturer"
                    value={viewingReportData.manufacturer}
                  />
                )}
                {(viewingReportData.model ||
                  viewingReportData.modelIsIrrelevant !== true) && (
                  <InfoBox title="Model" value={viewingReportData.model} />
                )}
                <InfoBox
                  title="Condition"
                  value={viewingReportData.conditionOrDamage}
                />

                {(viewingReportData.serialNumberOrIdentifier ||
                  viewingReportData.serialNumberOrIdentifierIsIrrelevant !==
                    true) && (
                  <InfoBox
                    title="Identifier"
                    value={viewingReportData.serialNumberOrIdentifier}
                  />
                )}
              </div>
              <img
                src={`${process.env.NEXT_PUBLIC_BLOB_ENDPOINT}/report-${viewingReportIdx}.jpeg`}
                className="max-h-72 object-cover w-full border border-dashed rounded-md border-primary mb-4"
              />
            </div>
          )}
          {viewingReport && (
            <div
              className="absolute inset-0"
              onClick={() => setViewingReport(false)}
            />
          )}
          <h1 className=" font-jaro text-3xl text-center mb-4">
            Reported damages
          </h1>
          <p className="text-white text-center">
            Here's a map of all the reported damages of equipment in
            Kaapelitehdas. <strong>Tap on the reports to view them!</strong>
          </p>
          <Map
            reports={reports.map((report) => [
              report.latitude,
              report.longitude,
            ])}
            currentCoords={coordinates}
            onClickReport={(idx) => {
              setViewingReportIdx(idx);
              setViewingReport(true);
            }}
          />
          <Button
            className="duration-300 hover:scale-110"
            onClick={() =>
              router.push(
                `/dance?latitude=${coordinates?.[0]}&longitude=${coordinates?.[1]}`
              )
            }
          >
            Make a report
          </Button>
        </div>
      ) : loadingCoordinates ? (
        "Loading coordinates..."
      ) : (
        <div className="absolute inset-0 h-full flex flex-col items-center justify-center gap-8 p-10 text-center">
          <Logo />
          <div className="hidden flex-col items-center gap-2 md:flex">
            <p>
              <strong>Trying on your laptop?</strong> Scan the code and use your
              phone, so you can scan something around you!
            </p>
            <img src="/qr.png" width={200} height={200} />
          </div>
          Please enable location services, so we can get the report placed on
          the right spot in the Cable Factory.
          <Button onClick={getCurrentPosition}>GO TO MAP</Button>
        </div>
      )}
    </main>
  );
}
