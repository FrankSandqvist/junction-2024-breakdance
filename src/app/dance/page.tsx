"use client";

import { ActionText } from "@/components/action-text";
import { Button } from "@/components/button";
import { InfoBox } from "@/components/info-box";
import { reportSchema } from "@/schema/report";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [previousReports, setPreviousReports] = useState<
    Array<z.infer<typeof reportSchema>>
  >([]);
  const [report, setReport] = useState<z.infer<typeof reportSchema>>({
    latitude: Number(searchParams.get("latitude") ?? 0),
    longitude: Number(searchParams.get("longitude") ?? 0),
  });
  console.log(report);
  const [wittyComment, setWittyComment] = useState<string | null>(null);
  const [suggestionForMorePhotos, setSuggestionForMorePhotos] = useState<
    string | null
  >(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [lastImageBase64, setLastImageBase64] = useState<string | null>(null);
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
        const dataURL = canvas.toDataURL("image/jpeg", 0.5);
        //console.log(dataURL.slice(23))
        setReportLoading(true);
        setLastImageBase64(dataURL);
        fetch("/api/analyze", {
          method: "POST",
          body: JSON.stringify({ image: dataURL, previousReports }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setReportLoading(false);
            if (data.wittyComment) {
              setWittyComment(data.wittyComment);
            }
            setSuggestionForMorePhotos(data.suggestionForMorePhotos ?? "Done! You can submit your report.");
            setPreviousReports((r) => [...r, report]);
            setReport((r) => ({ ...r, ...data }));
          });
      }
    }
  };

  const uploadReport = async () => {
    await fetch("/api/report", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ report, lastImageBase64 }),
    });

    router.push("/map");
  };

  return (
    <main className="absolute w-screen h-screen overflow-hidden md:relative md:w-full">
      <video
        autoPlay
        playsInline
        ref={videoRef}
        className="absolute h-screen object-cover bg-green-400"
        onClick={takeSnapshot}
      />
      <div
        className={`absolute inset-0 backdrop-blur-lg pointer-events-none duration-300 ${
          reportLoading ? "opacity-100" : "opacity-0"
        }`}
      />
      {reportLoading && (
        <div className="absolute inset-0 bg-white animate-fadeOut z-50" />
      )}
      <div
        className={`absolute border-b-4 left-0 right-0 duration-500 p-4 flex flex-col gap-4 delay-1000 ${
          reportLoading ? "-bottom-[110%]" : "bottom-16"
        }`}
      >
        <div className="grid grid-cols-2 gap-4">
          <InfoBox
            title="Category"
            value={report.objectCategory}
            onValueChange={(objectCategory) => {
              setReport((r) => ({ ...r, objectCategory }));
            }}
          />
          <InfoBox
            title="Object"
            value={report.object}
            onValueChange={(object) => {
              setReport((r) => ({ ...r, object }));
            }}
          />
          {(report.manufacturer ||
            report.manufacturerIsIrrelevant !== true) && (
            <InfoBox
              title="Manufacturer"
              value={report.manufacturer}
              onValueChange={(manufacturer) => {
                setReport((r) => ({ ...r, manufacturer }));
              }}
            />
          )}
          {(report.model || report.modelIsIrrelevant !== true) && (
            <InfoBox
              title="Model"
              value={report.model}
              onValueChange={(model) => {
                setReport((r) => ({ ...r, model }));
              }}
            />
          )}
          <InfoBox
            title="Condition"
            value={report.conditionOrDamage}
            onValueChange={(conditionOrDamage) => {
              setReport((r) => ({ ...r, conditionOrDamage }));
            }}
          />

          {(report.serialNumberOrIdentifier ||
            report.serialNumberOrIdentifierIsIrrelevant !== true) && (
            <InfoBox
              title="Identifier"
              value={report.serialNumberOrIdentifier}
              onValueChange={(serialNumberOrIdentifier) => {
                setReport((r) => ({ ...r, serialNumberOrIdentifier }));
              }}
            />
          )}
          {/*<p>
            Serial Number: <br />
            </p>
            <p>
            Damage: <br />
            </p>*/}
        </div>
        {previousReports.length > 0 && (
          <Button onClick={() => uploadReport()}>Submit report</Button>
        )}
      </div>
      {wittyComment && <ActionText
        className="absolute top-32 ml-auto mr-auto w-[80%]"
        style={{
          rotate: `${(report.latitude % 1) * 6 - 3}deg`,
          animationName: `actionTextAppear${(previousReports.length % 2) + 1}`,
          animationDuration: "2s",
          animationTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          animationFillMode: "forwards",
        }}
        key={previousReports.length}
      >
        {wittyComment}
      </ActionText>}
      <p
        className={`font-jaro text-2xl absolute left-4 right-4 p-4 text-center backdrop-blur-lg text-white bg-darkBlue/80 rounded-lg duration-300 delay-1000 ${
          reportLoading ? "-top-[110%]" : "top-5"
        }`}
      >
        {suggestionForMorePhotos ??
          "Just tap anywhere to take a photo. Time to do the BREAKDANCE!"}
      </p>
    </main>
  );
}
