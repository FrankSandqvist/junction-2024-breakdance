"use client";

import { Button } from "@/components/button";
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

  const locationInterval = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    // setInterval(() => {
    //   navigator.geolocation.getCurrentPosition((r) => {
    //     setCoordinates([r.coords.latitude, r.coords.longitude]);
    //   });
    // }, 500);

    fetch(`${process.env.NEXT_PUBLIC_BLOB_ENDPOINT}/report.json`, {
      cache: "no-cache",
    })
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
          />
          <Button
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
