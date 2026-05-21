import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  createScreen,
  getScreenById,
  updateScreen,
} from "../../services/screensApi";

const seatTypes = [
  "regular",
  "vip",
  "recliner",
  "couple",
];

const CreateEditScreen = () => {
  const { screenId, id } = useParams();

  const [toast, setToast] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    screenType: "2D",
  });

  const [rows] = useState(6);

  const [cols] = useState(12);

  const [seatLayout, setSeatLayout] = useState([]);

  const [prices, setPrices] = useState({
    regular: 150,
    vip: 300,
    recliner: 500,
    couple: 700,
  });

  const navigate = useNavigate();

  useEffect(() => {
    generateLayout(rows, cols);
  }, []);

  useEffect(() => {
    if (!screenId) return;

    const fetchScreen = async () => {
      try {
        const res = await getScreenById(screenId);

        const screen = res.screen;

        setFormData({
          name: screen.name,
          screenType: screen.screenType,
        });

        setPrices(screen.prices);

        setSeatLayout(screen.seatLayout);
      } catch (error) {
        console.log(error);
      }
    };

    fetchScreen();
  }, [screenId]);

  const generateLayout = (totalRows, totalCols) => {
    const layout = [];

    for (let i = 0; i < totalRows; i++) {
      const row = [];

      for (let j = 0; j < totalCols; j++) {
        row.push({
          seatNumber: `${String.fromCharCode(65 + i)}${j + 1}`,
          type: "regular",
          status: "available",
        });
      }

      layout.push(row);
    }

    setSeatLayout(layout);
  };

  const regenerateSeatNumbers = (layout) => {
    return layout.map((row, rowIndex) =>
      row.map((seat, colIndex) => {
        if (seat === null) return null;

        return {
          ...seat,

          seatNumber: `${String.fromCharCode(
            65 + rowIndex,
          )}${colIndex + 1}`,
        };
      }),
    );
  };

  const toggleGap = (rowIndex, colIndex) => {
    const updated = [...seatLayout];

    if (updated[rowIndex][colIndex] === null) {
      updated[rowIndex][colIndex] = {
        seatNumber: `${String.fromCharCode(
          65 + rowIndex,
        )}${colIndex + 1}`,
        type: "regular",
        status: "available",
      };
    } else {
      updated[rowIndex][colIndex] = null;
    }

    setSeatLayout(updated);
  };

  const changeSeatType = (rowIndex, colIndex) => {
    const updated = [...seatLayout];

    const seat = updated[rowIndex][colIndex];

    if (!seat) return;

    const currentIndex = seatTypes.indexOf(seat.type);

    const nextType =
      seatTypes[(currentIndex + 1) % seatTypes.length];

    seat.type = nextType;

    setSeatLayout(updated);

    setToast(
      `${seat.seatNumber} changed to ${nextType.toUpperCase()}`,
    );

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  const insertRowBelow = (rowIndex) => {
    const newRow = seatLayout[0].map(() => ({
      seatNumber: "",
      type: "regular",
      status: "available",
    }));

    const updated = [...seatLayout];

    updated.splice(rowIndex + 1, 0, newRow);

    setSeatLayout(regenerateSeatNumbers(updated));
  };

  const deleteRow = (rowIndex) => {
    const updated = [...seatLayout];

    updated.splice(rowIndex, 1);

    setSeatLayout(regenerateSeatNumbers(updated));
  };

  const insertColumnRight = (colIndex) => {
    const updated = seatLayout.map((row) => {
      const newRow = [...row];

      newRow.splice(colIndex + 1, 0, {
        seatNumber: "",
        type: "regular",
        status: "available",
      });

      return newRow;
    });

    setSeatLayout(regenerateSeatNumbers(updated));
  };

  const deleteColumn = (colIndex) => {
    const updated = seatLayout.map((row) => {
      const newRow = [...row];

      newRow.splice(colIndex, 1);

      return newRow;
    });

    setSeatLayout(regenerateSeatNumbers(updated));
  };

  const toggleEntireRowGap = (rowIndex) => {
    const updated = [...seatLayout];

    const isGap = updated[rowIndex].every(
      (seat) => seat === null,
    );

    updated[rowIndex] = updated[rowIndex].map(
      (_, colIndex) => {
        if (isGap) {
          return {
            seatNumber: `${String.fromCharCode(
              65 + rowIndex,
            )}${colIndex + 1}`,
            type: "regular",
            status: "available",
          };
        }

        return null;
      },
    );

    setSeatLayout(updated);
  };

  const toggleEntireColumnGap = (colIndex) => {
    const updated = [...seatLayout];

    const isGap = updated.every(
      (row) => row[colIndex] === null,
    );

    updated.forEach((row, rowIndex) => {
      if (isGap) {
        row[colIndex] = {
          seatNumber: `${String.fromCharCode(
            65 + rowIndex,
          )}${colIndex + 1}`,
          type: "regular",
          status: "available",
        };
      } else {
        row[colIndex] = null;
      }
    });

    setSeatLayout(updated);
  };

  const getSeatClasses = (seat) => {
    if (!seat) {
      return `
        border-dashed
        border-white/20
        text-white/20
      `;
    }

    switch (seat.type) {
      case "vip":
        return `
          border-yellow-400
          text-yellow-400
        `;

      case "recliner":
        return `
          border-blue-400
          text-blue-400
        `;

      case "couple":
        return `
          border-pink-300
          text-pink-300
        `;

      default:
        return `
          border-green-500
          text-green-400
          hover:bg-green-500/10
        `;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (screenId) {
        res = await updateScreen(screenId, {
          ...formData,
          prices,
          seatLayout,
        });
      } else {
        res = await createScreen({
          ...formData,
          theatreId: id,
          prices,
          seatLayout,
        });
      }

      navigate("/theatre-owner/screens");

      setToast("Screen Saved Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 sm:p-8">
      <form
        onSubmit={submitHandler}
        className="max-w-7xl mx-auto space-y-8"
      >

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            {screenId
              ? "Edit Screen"
              : "Create Screen"}
          </h1>

          <p className="text-white/50 mt-2">
            Manual Theatre Layout Designer
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Screen Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="
              bg-[#111]
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              w-full
            "
          />

          <select
            value={formData.screenType}
            onChange={(e) =>
              setFormData({
                ...formData,
                screenType: e.target.value,
              })
            }
            className="
              bg-[#111]
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              w-full
            "
          >
            <option>2D</option>
            <option>3D</option>
            <option>IMAX</option>
          </select>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {seatTypes.map((type) => (
            <div key={type}>
              <label className="text-sm capitalize">
                {type} Price
              </label>

              <input
                type="number"
                value={prices[type]}
                onChange={(e) =>
                  setPrices({
                    ...prices,
                    [type]: e.target.value,
                  })
                }
                className="
                  mt-2
                  w-full
                  bg-[#111]
                  border
                  border-white/10
                  rounded-xl
                  px-4
                  py-3
                "
              />
            </div>
          ))}
        </div>

        <div
          className="
            bg-[#111]
            border
            border-pink-500/20
            rounded-2xl
            p-4

            grid
            grid-cols-2
            sm:flex
            sm:flex-wrap

            gap-4

            text-sm
          "
        >
          <p>Left Click → Gap</p>

          <p>Right Click → Type</p>

          <p>G → Full Gap</p>

          <p>+ → Add</p>

          <p>- → Delete</p>
        </div>

        <div
          className="
            overflow-x-auto

            bg-[#111]

            border
            border-white/10

            rounded-3xl

            p-4 sm:p-6
          "
        >

          <div className="flex mb-3 min-w-max">
            <div className="w-8" />

            <div className="flex gap-1 sm:gap-2">
              {seatLayout?.[0]?.map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="
                    w-8 sm:w-9

                    flex
                    flex-col

                    items-center

                    gap-1
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleEntireColumnGap(colIndex)
                    }
                    className="
                      h-4
                      w-4

                      rounded

                      bg-yellow-500

                      text-[9px]
                    "
                  >
                    G
                  </button>

                  <div className="flex gap-[2px]">
                    <button
                      type="button"
                      onClick={() =>
                        insertColumnRight(colIndex)
                      }
                      className="
                        h-4
                        w-4

                        rounded

                        bg-blue-600

                        text-[9px]
                      "
                    >
                      +
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteColumn(colIndex)
                      }
                      className="
                        h-4
                        w-4

                        rounded

                        bg-red-600

                        text-[9px]
                      "
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-max">
            {seatLayout.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <div
                  className="
                    w-8

                    flex
                    flex-col

                    items-center

                    gap-1
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleEntireRowGap(rowIndex)
                    }
                    className="
                      h-4
                      w-4

                      rounded

                      bg-yellow-500

                      text-[9px]
                    "
                  >
                    G
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertRowBelow(rowIndex)
                    }
                    className="
                      h-4
                      w-4

                      rounded

                      bg-green-600

                      text-[9px]
                    "
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteRow(rowIndex)}
                    className="
                      h-4
                      w-4

                      rounded

                      bg-red-600

                      text-[9px]
                    "
                  >
                    -
                  </button>
                </div>

                <div className="flex gap-1 sm:gap-2">
                  {row.map((seat, colIndex) => (
                    <button
                      key={colIndex}
                      type="button"
                      onClick={() =>
                        toggleGap(rowIndex, colIndex)
                      }
                      onContextMenu={(e) => {
                        e.preventDefault();

                        changeSeatType(
                          rowIndex,
                          colIndex,
                        );
                      }}
                      className={`
                        h-8
                        w-8

                        sm:h-9
                        sm:w-9

                        rounded-xl

                        border

                        text-[8px]
                        sm:text-[9px]

                        font-semibold

                        transition-all

                        flex
                        flex-col
                        items-center
                        justify-center

                        shrink-0

                        ${getSeatClasses(seat)}
                      `}
                    >
                      <span>{seat?.seatNumber}</span>

                      {seat && (
                        <span className="text-[6px]">
                          {seat.type === "regular"
                            ? "R"
                            : seat.type === "vip"
                              ? "V"
                              : seat.type === "recliner"
                                ? "RL"
                                : "C"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>


        <button
          type="submit"
          className="
            w-full
            sm:w-auto

            px-8
            py-4

            rounded-2xl

            bg-pink-600
            hover:bg-pink-700

            font-semibold

            transition
          "
        >
          Save Screen
        </button>
      </form>


      {toast && (
        <div
          className="
            fixed

            bottom-4
            right-4
            left-4

            sm:left-auto
            sm:bottom-6
            sm:right-6

            z-50

            bg-[#111]

            border
            border-pink-500/20

            px-5
            py-3

            rounded-2xl

            shadow-2xl
          "
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default CreateEditScreen;