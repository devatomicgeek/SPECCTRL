"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  Plus,
  Save,
  Trash2,
  Search,
  ArrowLeft,
  Database,
  Camera as CameraIcon,
} from "lucide-react";

import {
  subscribeCameras,
  saveCamera,
  removeCamera,
  seedCameras,
  type ManagedCamera,
} from "@/lib/cameraStore";

// --------------------------------------------------
// DEFAULT CAMERA DATA
// --------------------------------------------------

const blank: ManagedCamera = {
  slug: "",
  name: "",
  brand: "",
  type: "APS-C",
  format: "APS-C",
  mount: "",
  mp: "",
  video: "",
  ibis: "",
  weight: "",
  screen: "",
  slots: "",
  best: "",
  tag: "",
  summary: "",
  pros: [],
  cons: [],
  photo: 0,
  videoScore: 0,
  image: "",
  imageUrl: "",
  status: "draft",
};

// --------------------------------------------------
// CAMERA FIELDS
// --------------------------------------------------

const fields: [keyof ManagedCamera, string][] = [
  ["name", "Camera name"],
  ["brand", "Manufacturer"],
  ["format", "Sensor format"],
  ["mount", "Lens mount"],
  ["mp", "Resolution"],
  ["video", "Video recording"],
  ["ibis", "Stabilization"],
  ["weight", "Weight"],
  ["screen", "Rear screen"],
  ["slots", "Card slots"],
  ["best", "Best for"],
  ["tag", "Editorial label"],
  ["imageUrl", "Image URL or /images/cameras/file.webp"],
];

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

// --------------------------------------------------
// CAMERA MANAGER
// --------------------------------------------------

export default function CameraManager() {
  const [rows, setRows] = useState<ManagedCamera[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const [editing, setEditing] = useState<ManagedCamera | null>(
    null
  );

  const [original, setOriginal] = useState<string | null>(
    null
  );

  const [busy, setBusy] = useState(false);

  // --------------------------------------------------
  // FIRESTORE SUBSCRIPTION
  // --------------------------------------------------

  useEffect(() => {
    const unsubscribe = subscribeCameras(
      true,
      (docs) => {
        setRows(docs);
        setLoading(false);
        setError("");
      },
      (err) => {
        setLoading(false);
        setError(
          "Firestore could not load cameras: " + err.message
        );
      }
    );

    return unsubscribe;
  }, []);

  // --------------------------------------------------
  // SEARCH AND FILTER
  // --------------------------------------------------

  const shown = useMemo(() => {
    return rows
      .filter((camera) => {
        const matchesStatus =
          status === "all" || camera.status === status;

        const matchesSearch = [
          camera.name,
          camera.brand,
          camera.slug,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rows, query, status]);

  // --------------------------------------------------
  // START EDITING
  // --------------------------------------------------

  function start(camera?: ManagedCamera) {
    setEditing(
      camera
        ? {
            ...camera,
            pros: [...camera.pros],
            cons: [...camera.cons],
          }
        : { ...blank, pros: [], cons: [] }
    );

    setOriginal(camera?.slug || null);
    setError("");
    setMessage("");
  }

  // --------------------------------------------------
  // UPDATE TEXT FIELD
  // --------------------------------------------------

  function update(
    key: keyof ManagedCamera,
    value: string
  ) {
    setEditing((previous) =>
      previous
        ? {
            ...previous,
            [key]: value,
          }
        : previous
    );
  }

  // --------------------------------------------------
  // SAVE CAMERA
  // --------------------------------------------------

  async function submit(
    event?: FormEvent<HTMLFormElement>,
    statusOverride?: "draft" | "published"
  ) {
    event?.preventDefault();

    if (!editing || busy) return;

    const slug = slugify(
      editing.slug || editing.name
    );

    if (
      !slug ||
      !editing.name.trim() ||
      !editing.brand.trim()
    ) {
      setError(
        "Camera name, brand and slug are required."
      );
      return;
    }

    if (
      !original &&
      rows.some((camera) => camera.slug === slug)
    ) {
      setError(
        "This slug already exists. Edit the existing camera instead."
      );
      return;
    }

    if (original && original !== slug) {
      setError(
        "Existing camera slugs cannot be changed. Create a new camera instead."
      );
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await saveCamera({
        ...editing,
        slug,
        status: statusOverride || editing.status,
        type: editing.format,
        image: editing.image || slug,
        updatedAt: new Date().toISOString(),
      });

      setMessage("Camera saved successfully.");
      setEditing(null);
      setOriginal(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save camera."
      );
    } finally {
      setBusy(false);
    }
  }

  // --------------------------------------------------
  // DELETE CAMERA
  // --------------------------------------------------

  async function del(camera: ManagedCamera) {
    if (busy) return;

    const confirmed = window.confirm(
      `Permanently delete ${camera.name}? This cannot be undone.`
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");

    try {
      await removeCamera(camera.slug);

      setMessage(`${camera.name} deleted.`);

      if (editing?.slug === camera.slug) {
        setEditing(null);
        setOriginal(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete camera."
      );
    } finally {
      setBusy(false);
    }
  }

  // --------------------------------------------------
  // IMPORT STARTER CAMERAS
  // --------------------------------------------------

  async function seed() {
    if (busy || rows.length > 0) return;

    const confirmed = window.confirm(
      "Import all six starter cameras to an EMPTY Firestore cameras collection? This does not upload photographs."
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");

    try {
      await seedCameras();

      setMessage(
        "Six starter cameras imported. Existing local image paths are retained."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Import failed."
      );
    } finally {
      setBusy(false);
    }
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="cameraManager">
      {/* BACK LINK */}

      <Link
        href="/admin/"
        className="blue text-sm font-bold inline-flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={16} />
        Dashboard
      </Link>

      {/* HEADER */}

      <div className="adminTop">
        <div>
          <div className="tag mb-3">
            CONTENT / CAMERAS
          </div>

          <h1 className="text-3xl sm:text-4xl font-black">
            Camera management
            <span className="blue">.</span>
          </h1>

          <p className="muted mt-3">
            Edit camera specifications and control publication
            in Firestore.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() => start()}
        >
          <Plus size={17} />
          Add camera
        </button>
      </div>

      {/* MESSAGES */}

      {error && (
        <p className="adminError mt-5" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="adminSuccess mt-5" role="status">
          {message}
        </p>
      )}

      {/* EMPTY DATABASE */}

      {!loading && rows.length === 0 && (
        <div className="panel p-7 mt-7">
          <div className="flex items-center gap-3 mb-3">
            <Database className="blue" />

            <h2 className="font-bold text-lg">
              Your camera database is empty
            </h2>
          </div>

          <p className="muted text-sm mb-5">
            Import the six starter cameras once, or add a
            new camera. Until then, the public catalog
            displays its original built-in listings.
          </p>

          <button
            type="button"
            disabled={busy}
            onClick={seed}
            className="btn"
          >
            <Database size={16} />
            Import six starter cameras
          </button>
        </div>
      )}

      {/* CAMERA EDITOR */}

      {editing && (
        <form
          onSubmit={(event) => submit(event)}
          className="panel p-5 sm:p-7 mt-7 space-y-5"
        >
          <div className="flex justify-between items-center gap-3">
            <h2 className="section-title">
              {original ? "Edit camera" : "New camera"}
            </h2>

            <button
              type="button"
              className="btnOutline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>

          {/* SPECIFICATION FIELDS */}

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm font-bold">
              Slug (URL identifier)

              <input
                className="input mt-2"
                required
                disabled={!!original}
                value={editing.slug}
                placeholder="sony-a6700"
                onChange={(event) =>
                  update(
                    "slug",
                    slugify(event.target.value)
                  )
                }
              />
            </label>

            {fields.map(([key, label]) => (
              <label
                key={key}
                className="text-sm font-bold"
              >
                {label}

                <input
                  className="input mt-2"
                  required={
                    key === "name" || key === "brand"
                  }
                  value={String(editing[key] ?? "")}
                  onChange={(event) =>
                    update(key, event.target.value)
                  }
                  placeholder={label}
                />
              </label>
            ))}

            {/* PUBLICATION STATUS */}

            <label className="text-sm font-bold">
              Publication status

              <select
                className="input mt-2"
                value={editing.status}
                onChange={(event) =>
                  update("status", event.target.value)
                }
              >
                <option value="draft">Draft</option>
                <option value="published">
                  Published
                </option>
              </select>
            </label>

            {/* PHOTO FOCUS */}

            <label className="text-sm font-bold">
              Photography focus (illustrative, 0–10)

              <input
                className="input mt-2"
                type="number"
                min="0"
                max="10"
                value={editing.photo}
                onChange={(event) =>
                  setEditing((previous) =>
                    previous
                      ? {
                          ...previous,
                          photo: Number(
                            event.target.value
                          ),
                        }
                      : previous
                  )
                }
              />
            </label>

            {/* VIDEO FOCUS */}

            <label className="text-sm font-bold">
              Video focus (illustrative, 0–10)

              <input
                className="input mt-2"
                type="number"
                min="0"
                max="10"
                value={editing.videoScore}
                onChange={(event) =>
                  setEditing((previous) =>
                    previous
                      ? {
                          ...previous,
                          videoScore: Number(
                            event.target.value
                          ),
                        }
                      : previous
                  )
                }
              />
            </label>
          </div>

          {/* SUMMARY */}

          <label className="text-sm font-bold block">
            Summary

            <textarea
              className="input mt-2 min-h-28"
              value={editing.summary}
              onChange={(event) =>
                update("summary", event.target.value)
              }
            />
          </label>

          {/* PROS AND CONS */}

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm font-bold">
              Strengths (one per line)

              <textarea
                className="input mt-2 min-h-28"
                value={editing.pros.join("\n")}
                onChange={(event) =>
                  setEditing((previous) =>
                    previous
                      ? {
                          ...previous,
                          pros: splitLines(
                            event.target.value
                          ),
                        }
                      : previous
                  )
                }
              />
            </label>

            <label className="text-sm font-bold">
              Trade-offs (one per line)

              <textarea
                className="input mt-2 min-h-28"
                value={editing.cons.join("\n")}
                onChange={(event) =>
                  setEditing((previous) =>
                    previous
                      ? {
                          ...previous,
                          cons: splitLines(
                            event.target.value
                          ),
                        }
                      : previous
                  )
                }
              />
            </label>
          </div>

          {/* SAVE BUTTONS */}

          <div className="flex flex-wrap gap-3">
            <button
              className="btn"
              disabled={busy}
              type="submit"
            >
              <Save size={16} />
              {busy ? "Saving..." : "Save camera"}
            </button>

            <button
              className="btnOutline"
              disabled={busy}
              type="button"
              onClick={() =>
                submit(undefined, "draft")
              }
            >
              Save as draft
            </button>

            <button
              className="btnOutline"
              disabled={busy}
              type="button"
              onClick={() =>
                submit(undefined, "published")
              }
            >
              Publish
            </button>
          </div>

          <p className="muted text-xs">
            Image uploads are not included yet.
            Enter a hosted image URL or an existing
            local image path.
          </p>
        </form>
      )}

      {/* CAMERA LIST */}

      <div className="panel p-5 mt-7">
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-5">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-3 muted"
            />

            <input
              className="input pl-10"
              placeholder="Search cameras..."
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
            />
          </div>

          <select
            className="input sm:w-44"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        {loading ? (
          <p className="muted">
            Loading cameras...
          </p>
        ) : shown.length > 0 ? (
          shown.map((camera) => (
            <div
              key={camera.slug}
              className="cameraAdminRow"
            >
              <div className="cameraAdminIcon">
                <CameraIcon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <strong>{camera.name}</strong>

                <p className="muted text-xs break-all">
                  {camera.brand} · {camera.slug}
                </p>
              </div>

              <span
                className={
                  "cameraBadge " +
                  (camera.status === "published"
                    ? "published"
                    : "")
                }
              >
                {camera.status}
              </span>

              <button
                type="button"
                className="btnOutline"
                onClick={() => start(camera)}
              >
                Edit
              </button>

              <button
                type="button"
                className="btnOutline"
                disabled={busy}
                onClick={() => del(camera)}
                aria-label={`Delete ${camera.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="muted text-sm">
            No cameras match your filters.
          </p>
        )}
      </div>

      {/* STATIC HOSTING NOTICE */}

      <p className="muted text-xs mt-4">
        Note: New camera pages use
        /cameras/view/?slug=... on static hosting.
        Public pages load Firestore data in the browser.
        Search-engine indexing will need a separate
        SEO upgrade.
      </p>
    </div>
  );
}