import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  createTheatre,
  editTheatre,
  getTheatreById,
} from "../../services/theatreApi";

import LocationPicker from "../../Components/Map/LocationPicker";

function CreateEditTheatre() {

  const { id } = useParams();

  const navigate = useNavigate();

  const isEdit = !!id;

  const [loading,
    setLoading] =
    useState(false);

  const [position,
    setPosition] =
    useState(null);

  const [bannerImage,
    setBannerImage] =
    useState("");

  const [bannerPreview,
    setBannerPreview] =
    useState("");

  const [gallery,
    setGallery] =
    useState([]);

  const [formData,
    setFormData] =
    useState({

      name: "",

      city: "",

      address: ""

    });

  useEffect(() => {

    if (id) {

      fetchTheatre();

    }

  }, [id]);

  const fetchTheatre =
    async () => {

      try {

        const res = await getTheatreById(id);

        const data = res.theatre;

        setFormData({

          name: data.name,

          city: data.city,

          address: data.address

        });

        setBannerImage(
          data.bannerImage
        );

        setBannerPreview(
          data.bannerImage
        );

        setGallery(
          data.gallery || []
        );

        setPosition([
          data.location.coordinates[1],
          data.location.coordinates[0]
        ]);

      } catch (error) {

        console.log(error);

      }

    };

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value

      });

    };

  const uploadToCloudinary =
    async (file) => {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(

        "upload_preset",

        import.meta.env
          .VITE_CLOUDINARY_UPLOAD_PRESET_THEATRES_NAME

      );

      const res =
        await fetch(

          import.meta.env
            .VITE_CLOUDINARY_URL,

          {

            method: "POST",

            body: formData

          }

        );

      return await res.json();

    };

  const handleBannerUpload =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      try {

        setLoading(true);

        setBannerPreview(

          URL.createObjectURL(file)

        );

        const data = await uploadToCloudinary(file);

        setBannerImage(
          data.secure_url
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const handleGalleryUpload =
    async (e) => {

      const files =
        Array.from(
          e.target.files
        );

      if (!files.length)
        return;

      try {

        setLoading(true);

        const uploadedImages =
          [];

        for (let file of files) {

          const data =
            await uploadToCloudinary(file);

          uploadedImages.push(
            data.secure_url
          );

        }

        setGallery((prev) => [

          ...prev,

          ...uploadedImages

        ]);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const removeGalleryImage =
    (index) => {

      const updated =
        gallery.filter(

          (_, i) =>
            i !== index

        );

      setGallery(updated);

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const payload = {

          name: formData.name,

          city: formData.city,

          address: formData.address,

          bannerImage,

          gallery,

          location: {

            lat:
              position[0],

            lng:
              position[1]

          }

        };

        if (isEdit) {

          await editTheatre(
            id,
            payload
          );

        } else {

          await createTheatre(
            payload
          );

        }

        navigate(
          "/theatre-owner/theatre"
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      className="
        min-h-screen

        p-6
        lg:p-10
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto

          bg-[#181818]

          border
          border-white/10

          rounded-3xl

          overflow-hidden
        "
      >

        <div
          className="
            p-8

            border-b
            border-white/10
          "
        >

          <h1
            className="
              text-4xl
              font-bold
            "
          >

            {
              isEdit

                ? "Edit Theatre"

                : "Create Theatre"
            }

          </h1>

          <p
            className="
              text-gray-400

              mt-3
            "
          >

            Manage your theatre
            information, images,
            and location

          </p>

        </div>

        <form
          onSubmit={
            handleSubmit
          }

          className="
            p-8

            space-y-10
          "
        >

          <div
            className="
              space-y-5
            "
          >

            <div>

              <h2
                className="
                  text-2xl
                  font-semibold
                "
              >

                Banner Image

              </h2>

              <p
                className="
                  text-gray-400

                  mt-2
                "
              >

                Upload a cinematic
                cover image

              </p>

            </div>

            <input
              type="file"

              accept="image/*"

              onChange={
                handleBannerUpload
              }

              className="
                text-sm
              "
            />

            {
              bannerPreview && (

                <div
                  className="
                    relative
                  "
                >

                  <img
                    src={
                      bannerPreview
                    }

                    alt=""

                    className="
                      w-full

                      h-[400px]

                      object-cover

                      rounded-3xl
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-t
                      from-black/80
                      to-transparent

                      rounded-3xl
                    "
                  />

                </div>

              )
            }

          </div>

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2

              gap-6
            "
          >

            <div>

              <label
                className="
                  block

                  mb-3

                  text-sm
                  font-medium
                "
              >

                Theatre Name

              </label>

              <input
                type="text"

                name="name"

                value={
                  formData.name
                }

                onChange={
                  handleChange
                }

                placeholder="
                  Enter theatre name
                "

                className="
                  w-full

                  bg-black

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
                  font-medium
                "
              >

                City

              </label>

              <input
                type="text"

                name="city"

                value={
                  formData.city
                }

                onChange={
                  handleChange
                }

                placeholder="
                  Enter city
                "

                className="
                  w-full

                  bg-black

                  border
                  border-white/10

                  rounded-2xl

                  px-5
                  py-4

                  outline-none
                "
              />

            </div>

          </div>

          <div>

            <label
              className="
                block

                mb-3

                text-sm
                font-medium
              "
            >

              Address

            </label>

            <textarea
              rows="5"

              name="address"

              value={
                formData.address
              }

              onChange={
                handleChange
              }

              placeholder="
                Enter theatre address
              "

              className="
                w-full

                bg-black

                border
                border-white/10

                rounded-2xl

                px-5
                py-4

                outline-none

                resize-none
              "
            />

          </div>

          <div
            className="
              space-y-5
            "
          >

            <div>

              <h2
                className="
                  text-2xl
                  font-semibold
                "
              >

                Theatre Location

              </h2>

              <p
                className="
                  text-gray-400

                  mt-2
                "
              >

                Select the exact
                theatre location

              </p>

            </div>

            <LocationPicker
              position={
                position
              }

              setPosition={
                setPosition
              }
            />

          </div>

          <div
            className="
              space-y-6
            "
          >

            <div>

              <h2
                className="
                  text-2xl
                  font-semibold
                "
              >

                Theatre Gallery

              </h2>

              <p
                className="
                  text-gray-400

                  mt-2
                "
              >

                Upload theatre
                interior, screens,
                food court, lobby,
                etc

              </p>

            </div>

            <input
              type="file"

              multiple

              accept="image/*"

              onChange={
                handleGalleryUpload
              }
            />

            {
              gallery.length >
                0 && (

                <div
                  className="
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4

                    gap-5
                  "
                >

                  {
                    gallery.map(

                      (
                        img,
                        index
                      ) => (

                        <div
                          key={
                            index
                          }

                          className="
                            relative
                            group
                          "
                        >

                          <img
                            src={img}

                            alt=""

                            className="
                              w-full

                              h-[180px]

                              object-cover

                              rounded-2xl
                            "
                          />

                          <button
                            type="button"

                            onClick={() =>
                              removeGalleryImage(
                                index
                              )
                            }

                            className="
                              absolute
                              top-3
                              right-3

                              bg-red-500

                              w-8
                              h-8

                              rounded-full

                              opacity-0
                              group-hover:opacity-100

                              transition
                            "
                          >

                            ✕

                          </button>

                        </div>

                      )
                    )
                  }

                </div>

              )
            }

          </div>

          <div
            className="
              flex
              items-center
              justify-end

              gap-4
            "
          >

            <button
              type="button"

              onClick={() =>
                navigate(
                  "/theatre-owner/theatre"
                )
              }

              className="
                px-6
                py-3

                rounded-2xl

                bg-white/10
                hover:bg-white/20

                transition
              "
            >

              Cancel

            </button>

            <button
              type="submit"

              disabled={
                loading
              }

              className="
                px-8
                py-3

                rounded-2xl

                bg-pink-600
                hover:bg-pink-700

                transition
              "
            >

              {
                loading

                  ? "Saving..."

                  : isEdit

                  ? "Update Theatre"

                  : "Create Theatre"
              }

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default CreateEditTheatre;