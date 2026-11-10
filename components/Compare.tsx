"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { cameras } from "@/lib/data";
import {
  subscribeCameras,
  type ManagedCamera,
} from "@/lib/cameraStore";

export default function Compare() {
  const params = useSearchParams();

  const [cameraList, setCameraList] = useState<ManagedCamera[]>(
    cameras.map((camera) => ({
      ...camera,
      status: "published" as const,
    }))
  );

  const [a, setA] = useState(
    params.get("a") || cameras[0]?.slug || ""
  );

  const [b, setB] = useState(
    params.get("b") || cameras[1]?.slug || ""
  );

  const [dif, setDif] = useState(false);
  const [focus, setFocus] = useState("All");

  // Subscribe to published cameras from Firestore.
  useEffect(() => {
    const unsubscribe = subscribeCameras(
      false,
      (docs) => {
        if (docs.length > 0) {
          setCameraList(docs);
        }
      },
      () => {}
    );

    return unsubscribe;
  }, []);

  // Find selected cameras.
  const x =
    cameraList.find((camera) => camera.slug === a) ||
    cameraList[0];

  const y =
    cameraList.find((camera) => camera.slug === b) ||
    cameraList[1] ||
    cameraList[0];

  // Prevent errors if there are no cameras.
  if (!x || !y) {
    return (
      <div className="panel p-6">
        <h2 className="section-title">No cameras available</h2>
        <p className="muted mt-3">
          Add and publish cameras through the SPECCTRL admin dashboard
          to start comparing specifications.
        </p>
      </div>
    );
  }

  // Camera specifications for comparison.
  const specRows: [string, string, string, string][] = [
    ["Sensor", x.format, y.format, "Photo"],
    ["Resolution", x.mp, y.mp, "Photo"],
    ["Lens mount", x.mount, y.mount, "All"],
    ["Video", x.video, y.video, "Video"],
    ["Stabilization", x.ibis, y.ibis, "All"],
    ["Weight", x.weight, y.weight, "All"],
    ["Screen", x.screen, y.screen, "All"],
    ["Card slots", x.slots, y.slots, "All"],
  ];

  // Filter specifications based on selected focus.
  const filteredRows = specRows.filter((row) => {
    const matchesFocus =
      focus === "All" ||
      row[3] === "All" ||
      row[3] === focus;

    const matchesDifference =
      !dif || row[1] !== row[2];

    return matchesFocus && matchesDifference;
  });

  return (
    <>
      {/* Camera Selection */}
      <div className="panel p-6 grid md:grid-cols-2 gap-5">
        <label className="font-bold">
          Camera A

          <select
            className="input mt-2"
            value={a}
            onChange={(e) => setA(e.target.value)}
          >
            {cameraList.map((camera) => (
              <option
                key={camera.slug}
                value={camera.slug}
              >
                {camera.name}
              </option>
            ))}
          </select>
        </label>

        <label className="font-bold">
          Camera B

          <select
            className="input mt-2"
            value={b}
            onChange={(e) => setB(e.target.value)}
          >
            {cameraList.map((camera) => (
              <option
                key={camera.slug}
                value={camera.slug}
              >
                {camera.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Same Camera Warning */}
      {x.slug === y.slug && (
        <p className="mt-4 text-sm font-bold">
          Select two different cameras for a meaningful comparison.
        </p>
      )}

      {/* Comparison Controls */}
      <div className="flex flex-wrap items-center gap-3 my-6">
        <span className="text-sm font-bold">
          Focus:
        </span>

        {["All", "Photo", "Video"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFocus(type)}
            className={
              focus === type ? "btn" : "btnOutline"
            }
          >
            {type === "All"
              ? "All specs"
              : type === "Photo"
              ? "Photography"
              : "Video"}
          </button>
        ))}

        <label className="flex gap-2 items-center text-sm ml-auto">
          <input
            type="checkbox"
            checked={dif}
            onChange={(e) => setDif(e.target.checked)}
          />

          Highlight differences only
        </label>
      </div>

      {/* Comparison Table */}
      <div className="panel tableWrap">
        <table className="compareTable">
          <thead>
            <tr>
              <th>Specification</th>

              <th>
                <Link href={`/cameras/${x.slug}/`}>
                  {x.name} ↗
                </Link>
              </th>

              <th>
                <Link href={`/cameras/${y.slug}/`}>
                  {y.name} ↗
                </Link>
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row) => (
              <tr key={row[0]}>
                <td className="font-bold">
                  {row[0]}
                </td>

                <td>{row[1]}</td>

                <td>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison Information */}
      <div className="panel p-7 mt-7">
        <h2 className="section-title">
          How to interpret the differences
        </h2>

        <p className="muted mt-3">
          Specifications alone do not establish a winner.
          Consider your preferred lenses, video recording modes,
          shooting environment and total kit budget.
          This tool is an informational comparison,
          not a lab-tested ranking.
        </p>

        <div className="flex flex-wrap gap-3 mt-5">
          <Link
            className="btnOutline"
            href={`/cameras/${x.slug}/`}
          >
            Read {x.name} profile
          </Link>

          <Link
            className="btnOutline"
            href={`/cameras/${y.slug}/`}
          >
            Read {y.name} profile
          </Link>
        </div>
      </div>
    </>
  );
}