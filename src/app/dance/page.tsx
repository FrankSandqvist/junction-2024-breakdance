"use client";

import { ActionText } from "@/components/action-text";
import { Map } from "@/components/map";
import { reportSchema } from "@/schema/report";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

export default function Home() {
  const [report]
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [report, setReport] = useState<z.infer<typeof reportSchema>>({
    object: null,
    objectCategory: null,
    manufacturerIsRelevant: null,
    manufacturer: null,
    modelIsRelevant: null,
    model: null,
    damage: null,
    condition: null,
    serialNumberOrIdentifierIsRelevant: null,
    serialNumberOrIdentifier: null,
  });
  const [shortCompliment, setShortCompliment] = useState<string | null>(null);
  const [suggestionForMorePhotos, setSuggestionForMorePhotos] = useState<
    string | null
  >(null);
  const [reportLoading, setReportLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set video source to phone camera
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Take a snaphsot of the video and encode it as base64
  const takeSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        setReportLoading(true);
        fetch("/api/analyze", {
          method: "POST",
          body: JSON.stringify({ image: dataURL }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setReportLoading(false);
            if (data.shortCompliment) {
              setShortCompliment(data.shortCompliment);
            }
            setSuggestionForMorePhotos(data.suggestionForMorePhotos ?? "Done!");
            setReport(data);
          });
      }
    }
  };

  return (
    <main className="absolute w-screen h-screen overflow-hidden">
      <button
        className="top-0 left-0 w-32 h-16 absolute z-50 bg-white"
        onClick={() => {
          // navigator.geolocation.getCurrentPosition((r) => {
          //   setCoordinates([r.coords.latitude, r.coords.longitude]);
          // });
          //
          // setInterval(() => {
          //   navigator.geolocation.getCurrentPosition((r) => {
          //     setCoordinates([r.coords.latitude, r.coords.longitude]);
          //   });
          // }, 500)
        }}
      >
        Test
      </button>
      {coordinates && <Map markerCoords={coordinates} />}
      <video
        autoPlay
        playsInline
        ref={videoRef}
        className="absolute h-screen object-cover bg-green-400"
        onClick={takeSnapshot}
      />
      {reportLoading && (
        <div className="absolute inset-0 bg-white animate-fadeOut z-50" />
      )}
      <div
        className={`absolute -bottom-8 -right-8 w-[90vw] h-[90vw] rotate-3 duration-300 ${
          reportLoading ? "-bottom-96" : ""
        }`}
      >
        <Image
          src="/paper.png"
          fill
          alt="Paper"
          className="object-contain drop-shadow-lg"
        />
        <div className="absolute inset-0 font-grace pt-16 pl-12 text-blue-900 z-50 text-xl">
          {report.object && <p className="ml-2">{report.object}</p>}
          {(report.manufacturerIsRelevant || report.modelIsRelevant) && (
            <p>
              {report.manufacturer}
              {report.model && ` ${report.model}`}
            </p>
          )}
          {report.condition && (
            <p>
              <span className="underline">Condition:</span> {report.condition}
            </p>
          )}
          {report.damage && (
            <p>
              <span className="underline">Damage:</span> {report.damage}
            </p>
          )}
          {/*<p>
            Serial Number: <br />
          </p>
          <p>
            Damage: <br />
          </p>*/}
        </div>
      </div>
      <ActionText className="absolute left-16 top-16">
        {shortCompliment ?? "Hello!"}
      </ActionText>
      <p className="text-white absolute left-16 top-32">
        {suggestionForMorePhotos ?? "Take a photo of an object to get started."}
      </p>
    </main>
  );
}
