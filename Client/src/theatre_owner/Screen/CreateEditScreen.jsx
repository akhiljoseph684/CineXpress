import React, {
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

function CreateEditScreen() {

  const { theatreId } =
    useParams();

  const [screenName,
    setScreenName] =
    useState("");

  const [screenType, setScreenType] = useState("2D");

  const [seatMode, setSeatMode] = useState("manual");

  const [seatLayout, setSeatLayout] = useState([]);

  const [seatImage, setSeatImage] = useState(null);

  const createManualSeats = () => {

    const rows = 8;

    const cols = 12;

    const layout = [];

    for (let i = 0; i < rows; i++) {

      const row = [];

      for (let j = 0; j < cols; j++) {
        row.push(1);
      }

      layout.push(row);

    }
    setSeatLayout(layout);
  };


  const toggleSeat = ( rowIndex, colIndex) => {

    const updated = [...seatLayout];

    updated[rowIndex][colIndex] = updated[rowIndex][colIndex] === null

        ? 1

        : null;

    setSeatLayout(updated);

  };


 const handleImageUpload =
  async (e) => {

    try {

      const file =
        e.target.files[0];

      if (!file) return;

      setSeatImage(file);

      /* ---------- CLOUDINARY ---------- */

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(

        "upload_preset",

        import.meta.env
          .VITE_CLOUDINARY_UPLOAD_PRESET_SCREENS_NAME

      );

      const cloudinaryRes =
        await axios.post(

          import.meta.env
            .VITE_CLOUDINARY_URL,

          formData

        );

      const imageUrl =
        cloudinaryRes.data
          .secure_url;

      console.log(
        imageUrl
      );

      /* ---------- SEND TO AI ---------- */

      const aiRes =
        await sendSeatImageToAI(
          imageUrl
        );

      console.log(
        aiRes
      );


      setSeatLayout(

        aiRes.layout || []

      );

    } catch (error) {

      console.log(error);

    }

};

  return (

    <div
      className="
        p-8

        max-w-7xl
        mx-auto

        space-y-8
      "
    >

      {/* HEADER */}

      <div>

        <h1
          className="
            text-4xl
            font-bold
          "
        >

          Create Screen

        </h1>

        <p
          className="
            text-gray-400
            mt-2
          "
        >

          Setup screen and seat arrangement

        </p>

      </div>

      {/* BASIC DETAILS */}

      <div
        className="
          bg-[#181818]

          rounded-3xl

          border
          border-white/10

          p-8

          space-y-6
        "
      >

        <h2
          className="
            text-2xl
            font-semibold
          "
        >

          Basic Details

        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2

            gap-6
          "
        >

          <div>

            <label
              className="
                block
                mb-3

                text-sm
                text-gray-400
              "
            >

              Screen Name

            </label>

            <input
              type="text"

              value={screenName}

              onChange={(e) =>
                setScreenName(
                  e.target.value
                )
              }

              className="
                w-full

                bg-black/30

                border
                border-white/10

                rounded-2xl

                px-5
                py-4

                outline-none
              "
            />

          </div>

          <div>

            <label
              className="
                block
                mb-3

                text-sm
                text-gray-400
              "
            >

              Screen Type

            </label>

            <select
              value={screenType}

              onChange={(e) =>
                setScreenType(
                  e.target.value
                )
              }

              className="
                w-full

                bg-black/30

                border
                border-white/10

                rounded-2xl

                px-5
                py-4

                outline-none
              "
            >

              <option>
                2D
              </option>

              <option>
                3D
              </option>

              <option>
                IMAX
              </option>

              <option>
                4DX
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* CREATE METHOD */}

      <div
        className="
          bg-[#181818]

          rounded-3xl

          border
          border-white/10

          p-8

          space-y-6
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-semibold
              "
            >

              Seat Arrangement

            </h2>

            <p
              className="
                text-gray-400
                mt-2
              "
            >

              Create seats manually or use AI image detection

            </p>

          </div>

        </div>

        {/* OPTIONS */}

        <div
          className="
            flex
            flex-wrap

            gap-4
          "
        >

          <button
            onClick={() => {

              setSeatMode(
                "manual"
              );

              createManualSeats();

            }}

            className={`
              px-6
              py-3

              rounded-2xl

              transition

              ${
                seatMode ===
                "manual"

                  ? `
                    bg-pink-600
                  `

                  : `
                    bg-white/10
                  `
              }
            `}
          >

            Manual Create

          </button>

          <button
            onClick={() =>
              setSeatMode("ai")
            }

            className={`
              px-6
              py-3

              rounded-2xl

              transition

              ${
                seatMode ===
                "ai"

                  ? `
                    bg-pink-600
                  `

                  : `
                    bg-white/10
                  `
              }
            `}
          >

            Use AI Detection

          </button>

        </div>

        {/* AI SECTION */}

        {
          seatMode === "ai" && (

            <div
              className="
                space-y-5
              "
            >

              <div
                className="
                  border-2
                  border-dashed
                  border-white/10

                  rounded-3xl

                  p-10

                  text-center
                "
              >

                <input
                  type="file"
                  accept="image/*"

                  onChange={
                    handleImageUpload
                  }
                />

                <p
                  className="
                    text-gray-400
                    mt-4
                  "
                >

                  Upload seat arrangement image from any angle

                </p>

              </div>

              <div
                className="
                  bg-yellow-500/10

                  text-yellow-300

                  p-5

                  rounded-2xl
                "
              >

                AI will detect seats and generate nested array layout.

                Null positions represent walkway gaps.

              </div>

            </div>

          )
        }

      </div>

      {/* EDITOR */}

      {
        seatLayout.length > 0 && (

          <div
            className="
              bg-[#181818]

              rounded-3xl

              border
              border-white/10

              p-8

              space-y-8
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-2xl
                    font-semibold
                  "
                >

                  Seat Editor

                </h2>

                <p
                  className="
                    text-gray-400
                    mt-2
                  "
                >

                  Click seats to add walkway gaps

                </p>

              </div>

              <button
                className="
                  bg-white/10
                  hover:bg-white/20

                  transition

                  px-5
                  py-3

                  rounded-2xl
                "
              >

                Adjust By User

              </button>

            </div>

            {/* SCREEN */}

            <div
              className="
                w-full

                h-8

                bg-gradient-to-r
                from-pink-500
                to-purple-500

                rounded-full

                text-center

                flex
                items-center
                justify-center

                text-sm
                font-semibold
              "
            >

              SCREEN

            </div>

            {/* SEATS */}

            <div
              className="
                overflow-x-auto
              "
            >

              <div
                className="
                  flex
                  flex-col

                  items-center

                  gap-3

                  min-w-max
                "
              >

                {
                  seatLayout.map(
                    (row, rowIndex) => (

                      <div
                        key={rowIndex}

                        className="
                          flex
                          gap-2
                        "
                      >

                        {
                          row.map(
                            (
                              seat,
                              colIndex
                            ) => (

                              <button
                                key={colIndex}

                                onClick={() =>
                                  toggleSeat(
                                    rowIndex,
                                    colIndex
                                  )
                                }

                                className={`
                                  h-10
                                  w-10

                                  rounded-lg

                                  transition

                                  ${
                                    seat === null

                                      ? `
                                        bg-transparent
                                      `

                                      : `
                                        bg-pink-600
                                        hover:bg-pink-700
                                      `
                                  }
                                `}
                              >

                                {
                                  seat !== null && (
                                    "S"
                                  )
                                }

                              </button>

                            )
                          )
                        }

                      </div>

                    )
                  )
                }

              </div>

            </div>

          </div>

        )
      }

      {/* SAVE */}

      <button
        className="
          w-full

          bg-pink-600
          hover:bg-pink-700

          transition

          py-5

          rounded-3xl

          text-lg
          font-semibold
        "
      >

        Create Screen

      </button>

    </div>

  );
}

export default CreateEditScreen;