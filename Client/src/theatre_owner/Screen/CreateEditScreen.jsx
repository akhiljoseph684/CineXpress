import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaTrash,
  FaCouch,
  FaTicketAlt,
  FaCheck,
  FaSpinner,
  FaExclamationCircle,
  FaEraser,
  FaMousePointer,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import {
  createScreen,
  getScreenById,
  updateScreen,
} from "../../services/screensApi";

const seatTypes = [
  {
    value: "regular",
    label: "Regular",
    short: "R",
    price: 150,
    color: "border-emerald-500 bg-emerald-500/15 text-emerald-400",
    active: "border-emerald-500 bg-emerald-500/20 text-emerald-300",
  },
  {
    value: "vip",
    label: "VIP",
    short: "V",
    price: 300,
    color: "border-yellow-500 bg-yellow-500/15 text-yellow-400",
    active: "border-yellow-400 bg-yellow-500/25 text-yellow-300",
  },
  {
    value: "recliner",
    label: "Recliner",
    short: "RL",
    price: 500,
    color: "border-blue-500 bg-blue-500/15 text-blue-400",
    active: "border-blue-400 bg-blue-500/25 text-blue-300",
  },
  {
    value: "couple",
    label: "Couple",
    short: "C",
    price: 700,
    color: "border-pink-500 bg-pink-500/15 text-pink-400",
    active: "border-pink-400 bg-pink-500/25 text-pink-300",
  },
];

const createSeat = (rowIndex, colIndex, type = "regular") => ({
  seatNumber: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
  type,
  status: "available",
});

const generateLayout = (rows, cols) =>
  Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) =>
      createSeat(rowIndex, colIndex)
    )
  );

const regenerateSeatNumbers = (layout) =>
  layout.map((row, rowIndex) =>
    row.map((seat, colIndex) =>
      seat
        ? {
            ...seat,
            seatNumber: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
          }
        : null
    )
  );

function CreateEditScreen() {
  const { screenId, id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    screenType: "2D",
  });

  const [seatLayout, setSeatLayout] = useState(() =>
    generateLayout(6, 12)
  );

  const [prices, setPrices] = useState({
    regular: 150,
    vip: 300,
    recliner: 500,
    couple: 700,
  });

  const [activeTool, setActiveTool] = useState("regular");
  const [loading, setLoading] = useState(Boolean(screenId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [dragging, setDragging] = useState(false);
  const [dragVisited, setDragVisited] = useState(new Set());

  const isEditMode = Boolean(screenId);

  useEffect(() => {
    if (!screenId) return;

    let cancelled = false;

    const fetchScreen = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getScreenById(screenId);
        const screen = res.screen;

        if (cancelled) return;

        setFormData({
          name: screen.name || "",
          screenType: screen.screenType || "2D",
        });

        setPrices((previous) => ({
          ...previous,
          ...(screen.prices || {}),
        }));

        setSeatLayout(
          screen.seatLayout?.length
            ? screen.seatLayout
            : generateLayout(6, 12)
        );
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load screen details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchScreen();

    return () => {
      cancelled = true;
    };
  }, [screenId]);

  useEffect(() => {
    if (!dragging) return;

    const stopDragging = () => setDragging(false);

    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, [dragging]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const updateSeat = (rowIndex, colIndex, tool = activeTool) => {
    setSeatLayout((previous) => {
      const updated = previous.map((row) => [...row]);
      const seat = updated[rowIndex]?.[colIndex];

      if (tool === "gap") {
        if (seat) {
          updated[rowIndex][colIndex] = null;
        } else {
          updated[rowIndex][colIndex] = createSeat(rowIndex, colIndex);
        }
      } else if (seat) {
        updated[rowIndex][colIndex] = {
          ...seat,
          type: tool,
        };
      }

      return updated;
    });
  };

  const handleSeatPointerDown = (event, rowIndex, colIndex) => {
    if (event.button !== 0) return;

    event.preventDefault();
    setDragging(true);
    setDragVisited(new Set([`${rowIndex}-${colIndex}`]));
    updateSeat(rowIndex, colIndex);
  };

  const handleSeatPointerEnter = (rowIndex, colIndex) => {
    if (!dragging) return;

    const key = `${rowIndex}-${colIndex}`;

    if (dragVisited.has(key)) return;

    setDragVisited((previous) => new Set([...previous, key]));
    updateSeat(rowIndex, colIndex);
  };

  const handleSeatClick = (rowIndex, colIndex) => {
    if (dragging) return;
    updateSeat(rowIndex, colIndex);
  };

  const addRow = (afterIndex = seatLayout.length - 1) => {
    const columnCount = seatLayout[0]?.length || 12;
    const newRow = Array.from({ length: columnCount }, (_, colIndex) =>
      createSeat(0, colIndex)
    );

    setSeatLayout((previous) => {
      const updated = [...previous];
      updated.splice(afterIndex + 1, 0, newRow);
      return regenerateSeatNumbers(updated);
    });

    showToast("Row added");
  };

  const deleteRow = (rowIndex) => {
    if (seatLayout.length <= 1) {
      setError("At least one row must remain.");
      return;
    }

    setSeatLayout((previous) =>
      regenerateSeatNumbers(
        previous.filter((_, index) => index !== rowIndex)
      )
    );

    setError("");
    showToast("Row removed");
  };

  const addColumn = (afterIndex = (seatLayout[0]?.length || 1) - 1) => {
    setSeatLayout((previous) => {
      const updated = previous.map((row) => {
        const newRow = [...row];
        newRow.splice(afterIndex + 1, 0, createSeat(0, 0));
        return newRow;
      });

      return regenerateSeatNumbers(updated);
    });

    showToast("Column added");
  };

  const deleteColumn = (colIndex) => {
    if ((seatLayout[0]?.length || 0) <= 1) {
      setError("At least one column must remain.");
      return;
    }

    setSeatLayout((previous) =>
      regenerateSeatNumbers(
        previous.map((row) =>
          row.filter((_, index) => index !== colIndex)
        )
      )
    );

    setError("");
    showToast("Column removed");
  };

  const toggleEntireRowGap = (rowIndex) => {
    setSeatLayout((previous) => {
      const updated = previous.map((row) => [...row]);
      const rowIsEmpty = updated[rowIndex].every((seat) => seat === null);

      updated[rowIndex] = updated[rowIndex].map((seat, colIndex) =>
        rowIsEmpty
          ? createSeat(rowIndex, colIndex)
          : null
      );

      return updated;
    });

    showToast("Row layout updated");
  };

  const toggleEntireColumnGap = (colIndex) => {
    setSeatLayout((previous) => {
      const updated = previous.map((row) => [...row]);
      const columnIsEmpty = updated.every((row) => row[colIndex] === null);

      updated.forEach((row, rowIndex) => {
        row[colIndex] = columnIsEmpty
          ? createSeat(rowIndex, colIndex)
          : null;
      });

      return updated;
    });

    showToast("Column layout updated");
  };

  const clearAllGaps = () => {
    setSeatLayout((previous) =>
      previous.map((row, rowIndex) =>
        row.map((seat, colIndex) =>
          seat || createSeat(rowIndex, colIndex)
        )
      )
    );

    showToast("All seats restored");
  };

  const getSeatType = (type) =>
    seatTypes.find((seatType) => seatType.value === type) || seatTypes[0];

  const getSeatCounts = () => {
    const counts = {
      total: 0,
      regular: 0,
      vip: 0,
      recliner: 0,
      couple: 0,
      gaps: 0,
    };

    seatLayout.forEach((row) => {
      row.forEach((seat) => {
        if (!seat) {
          counts.gaps += 1;
          return;
        }

        counts.total += 1;
        counts[seat.type] = (counts[seat.type] || 0) + 1;
      });
    });

    return counts;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter a screen name.");
      return;
    }

    if (seatLayout.length === 0 || !seatLayout[0]?.length) {
      setError("Please create a valid seat layout.");
      return;
    }

    const invalidPrice = seatTypes.find(
      (type) =>
        prices[type.value] === "" ||
        !Number.isFinite(Number(prices[type.value])) ||
        Number(prices[type.value]) < 0
    );

    if (invalidPrice) {
      setError(`Enter a valid price for ${invalidPrice.label}.`);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        prices: Object.fromEntries(
          seatTypes.map((type) => [
            type.value,
            Number(prices[type.value]),
          ])
        ),
        seatLayout,
      };

      if (screenId) {
        await updateScreen(screenId, payload);
      } else {
        await createScreen({
          ...payload,
          theatreId: id,
        });
      }

      navigate("/theatre-owner/screens");
    } catch (err) {
      setError(err?.message || "Failed to save screen. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const counts = getSeatCounts();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] text-gray-400">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-3xl text-red-500" />
          <p>Loading screen details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <form
        onSubmit={submitHandler}
        className="mx-auto max-w-[1500px] space-y-7"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/theatre-owner/screens")}
              className="mb-4 flex items-center gap-2 text-sm text-gray-400 transition hover:text-red-400"
            >
              <FaArrowLeft />
              Back to screens
            </button>

            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
              {isEditMode ? "Edit Screen" : "Create Screen"}
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Design your theatre seating plan and set ticket prices.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111] px-4 py-3">
            <FaTicketAlt className="text-xl text-red-400" />
            <div>
              <p className="text-xs text-gray-500">Available seats</p>
              <p className="text-lg font-bold">{counts.total}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold">Screen Details</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Screen Name
              </label>
              <input
                type="text"
                placeholder="e.g. Screen 1"
                value={formData.name}
                maxLength={80}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Screen Type
              </label>
              <select
                value={formData.screenType}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    screenType: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm outline-none focus:border-red-500"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Seat Pricing</h2>
            <p className="mt-1 text-sm text-gray-400">
              Set the ticket price for each seat category.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {seatTypes.map((type) => (
              <div
                key={type.value}
                className={`rounded-xl border bg-[#080808] p-4 ${type.color}`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <FaCouch />
                  <label
                    htmlFor={`price-${type.value}`}
                    className="text-sm font-semibold"
                  >
                    {type.label}
                  </label>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111] px-3">
                  <span className="text-gray-500">₹</span>
                  <input
                    id={`price-${type.value}`}
                    type="number"
                    min="0"
                    step="1"
                    value={prices[type.value]}
                    onChange={(event) =>
                      setPrices((previous) => ({
                        ...previous,
                        [type.value]: event.target.value,
                      }))
                    }
                    className="w-full bg-transparent py-3 text-sm text-white outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  {counts[type.value] || 0} seats assigned
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <div className="border-b border-white/10 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Seat Layout Designer</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Choose a seat type, then click or drag over seats to assign it.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => addRow()}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-red-500/40 hover:text-red-400"
                >
                  <FaPlus />
                  Add Row
                </button>

                <button
                  type="button"
                  onClick={() => addColumn()}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-red-500/40 hover:text-red-400"
                >
                  <FaPlus />
                  Add Column
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-4 sm:p-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Select seat type
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {seatTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setActiveTool(type.value)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      activeTool === type.value
                        ? `${type.active} ring-2 ring-white/10`
                        : "border-white/10 bg-[#080808] text-gray-300 hover:border-white/20"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${type.color}`}
                    >
                      {type.short}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {type.label}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        ₹{Number(prices[type.value] || 0)}
                      </span>
                    </span>

                    {activeTool === type.value && (
                      <FaCheck className="shrink-0 text-sm" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTool("gap")}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    activeTool === "gap"
                      ? "border-red-500 bg-red-500/15 text-red-400"
                      : "border-white/10 bg-[#080808] text-gray-400 hover:border-red-500/40"
                  }`}
                >
                  <FaEraser />
                  {activeTool === "gap" ? "Gap Tool Selected" : "Gap / Restore Tool"}
                </button>

                <button
                  type="button"
                  onClick={clearAllGaps}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400 transition hover:border-red-500/40 hover:text-red-400"
                >
                  <FaUndo />
                  Restore All Seats
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {seatTypes.map((type) => (
                <div
                  key={type.value}
                  className="rounded-xl border border-white/10 bg-[#080808] p-3"
                >
                  <p className="text-xs text-gray-500">{type.label}</p>
                  <p className="mt-1 text-xl font-bold">
                    {counts[type.value] || 0}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080808] p-3 sm:p-5">
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-4 text-center sm:px-6">
                <div className="mx-auto mb-2 h-1 w-2/3 rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
                  Screen
                </p>
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-gray-500">
                  {seatLayout.length} rows · {seatLayout[0]?.length || 0} columns
                </p>
                <p className="text-xs text-gray-500">
                  Active tool:{" "}
                  <span className="font-semibold text-red-400">
                    {activeTool === "gap"
                      ? "Gap / Restore"
                      : getSeatType(activeTool).label}
                  </span>
                </p>
              </div>

              <div className="overflow-x-auto pb-3">
                <div className="min-w-max space-y-3">
                  <div className="flex items-end gap-2">
                    <div className="w-10 shrink-0 text-center text-[10px] text-gray-600">
                      Row
                    </div>

                    {seatLayout[0]?.map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className="flex w-9 shrink-0 flex-col items-center gap-1"
                      >
                        <span className="text-[10px] text-gray-500">
                          {colIndex + 1}
                        </span>

                        <button
                          type="button"
                          title={`Toggle gap in column ${colIndex + 1}`}
                          onClick={() => toggleEntireColumnGap(colIndex)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-[#181818] text-xs text-gray-400 transition hover:border-red-500/40 hover:text-red-400"
                        >
                          <FaEraser size={10} />
                        </button>

                        <div className="flex gap-1">
                          <button
                            type="button"
                            title={`Insert column after ${colIndex + 1}`}
                            onClick={() => addColumn(colIndex)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-xs text-gray-300 hover:bg-red-600 hover:text-white"
                          >
                            +
                          </button>

                          <button
                            type="button"
                            title={`Delete column ${colIndex + 1}`}
                            onClick={() => deleteColumn(colIndex)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-red-500/10 text-xs text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <FaMinus size={8} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-2">
                      <div className="flex w-10 shrink-0 flex-col items-center gap-1">
                        <span className="text-xs font-bold text-gray-400">
                          {String.fromCharCode(65 + rowIndex)}
                        </span>

                        <button
                          type="button"
                          title={`Toggle gap in row ${rowIndex + 1}`}
                          onClick={() => toggleEntireRowGap(rowIndex)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-[#181818] text-xs text-gray-400 transition hover:border-red-500/40 hover:text-red-400"
                        >
                          <FaEraser size={10} />
                        </button>

                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            title={`Insert row below ${rowIndex + 1}`}
                            onClick={() => addRow(rowIndex)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-xs text-gray-300 hover:bg-red-600 hover:text-white"
                          >
                            +
                          </button>

                          <button
                            type="button"
                            title={`Delete row ${rowIndex + 1}`}
                            onClick={() => deleteRow(rowIndex)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-red-500/10 text-xs text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <FaMinus size={8} />
                          </button>
                        </div>
                      </div>

                      {row.map((seat, colIndex) => {
                        const type = seat ? getSeatType(seat.type) : null;

                        return (
                          <button
                            key={colIndex}
                            type="button"
                            title={
                              seat
                                ? `${seat.seatNumber} · ${type.label} · ₹${Number(prices[seat.type] || 0)}`
                                : "Empty space · click to restore"
                            }
                            onPointerDown={(event) =>
                              handleSeatPointerDown(event, rowIndex, colIndex)
                            }
                            onPointerEnter={() =>
                              handleSeatPointerEnter(rowIndex, colIndex)
                            }
                            onClick={() =>
                              handleSeatClick(rowIndex, colIndex)
                            }
                            className={`flex h-9 w-9 shrink-0 touch-none select-none flex-col items-center justify-center rounded-lg border text-[9px] font-semibold transition sm:h-10 sm:w-10 sm:rounded-xl sm:text-[10px] ${
                              !seat
                                ? "border-dashed border-white/15 bg-transparent text-gray-700 hover:border-red-500/50"
                                : `${type.color} hover:brightness-125`
                            }`}
                          >
                            {seat ? (
                              <>
                                <span>{seat.seatNumber}</span>
                                <span className="text-[7px] opacity-80">
                                  {type.short}
                                </span>
                              </>
                            ) : (
                              <FaPlus size={10} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-4">
                {seatTypes.map((type) => (
                  <div key={type.value} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded border ${type.color}`} />
                    <span className="text-xs text-gray-400">{type.label}</span>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded border border-dashed border-white/30" />
                  <span className="text-xs text-gray-400">Empty space</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080808] p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">
                Quick instructions
              </h3>

              <div className="grid grid-cols-1 gap-3 text-xs text-gray-400 sm:grid-cols-2 lg:grid-cols-3">
                <p className="flex items-start gap-2">
                  <FaMousePointer className="mt-0.5 shrink-0 text-red-400" />
                  Choose a seat type above, then click a seat to assign it.
                </p>

                <p className="flex items-start gap-2">
                  {/* <FaGrip className="mt-0.5 shrink-0 text-red-400" /> */}
                  Drag across seats to assign the selected type to multiple seats.
                </p>

                <p className="flex items-start gap-2">
                  <FaEraser className="mt-0.5 shrink-0 text-red-400" />
                  Select Gap / Restore, then click or drag to create or restore gaps.
                </p>

                <p className="flex items-start gap-2">
                  <FaPlus className="mt-0.5 shrink-0 text-red-400" />
                  Use the plus buttons to insert rows or columns.
                </p>

                <p className="flex items-start gap-2">
                  <FaTrash className="mt-0.5 shrink-0 text-red-400" />
                  Use the minus buttons to remove rows or columns.
                </p>

                <p className="flex items-start gap-2">
                  <FaUndo className="mt-0.5 shrink-0 text-red-400" />
                  Restore All Seats fills empty spaces with Regular seats.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/theatre-owner/screens")}
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving Screen...
              </>
            ) : (
              <>
                <FaCheck />
                {isEditMode ? "Update Screen" : "Save Screen"}
              </>
            )}
          </button>
        </div>
      </form>

      {toast && (
        <div className="fixed bottom-5 left-4 right-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-xl border border-red-500/30 bg-[#181818] px-5 py-4 text-sm text-white shadow-2xl shadow-black/50 sm:bottom-6 sm:left-auto sm:right-6">
          <FaCheck className="shrink-0 text-red-400" />
          {toast}
        </div>
      )}
    </div>
  );
}

export default CreateEditScreen;