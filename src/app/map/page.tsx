"use client";

import { Button } from "@/components/button";
import { InfoBox } from "@/components/info-box";
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
  const viewingReportData = reports[viewingReportIdx];

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
    <main className="">
      {coordinates ? (
        <div className="absolute inset-0 p-4 flex flex-col ">
          <div
            className={`absolute bottom-0 left-0 right-0 backdrop-blur-lg bg-gradient-to-t from-darkBlue via-darkBlue to-secondary/50 duration-300 pt-4 px-8 ${
              viewingReport ? "translate-y-0" : "translate-y-[110%]"
            }`}
            onClick={() => setViewingReport(false)}
          >
            <h2 className="font-jaro text-darkBlue text-2xl text-center mb-8 bg-primary px-4 py-2 -mt-8 rounded-md border-2 border-black">
              Report {viewingReportIdx + 1}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
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
                wide
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
              {/*<p>
            Serial Number: <br />
            </p>
            <p>
            Damage: <br />
            </p>*/}
            </div>
            <img
              src={`${process.env.NEXT_PUBLIC_BLOB_ENDPOINT}/report-${viewingReportIdx}.jpeg`} className="max-h-64 object-cover w-full"
            />
          </div>
          <h1 className=" font-jaro text-2xl text-center mb-4">
            Reported damages
          </h1>
          <p className="text-white text-center">
            Here's a map of all the reported damages of equipment in
            Kaapelitehdas. Tap on the reports to view them!
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
        <div className="absolute inset-0 h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
          Please enable location services, so we can know where you are in
          Kaapelitehdas!
          <Button onClick={getCurrentPosition}>Get Current Position</Button>
        </div>
      )}
    </main>
  );
}
