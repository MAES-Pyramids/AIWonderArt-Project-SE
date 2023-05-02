import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField, Loader } from "../components";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(
          "https://aiwonderart.onrender.com/api/v1/Dalle",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: form.prompt }),
          }
        );

        const data = await response.json();

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch(
          "https://aiwonderart.onrender.com/api/v1/Post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
          }
        );
        await response.json();
        navigate("/");
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Create your own AI-generated images
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Use the power of Magic Images to create imaginative and visually
          stunning images. Share your creations with the community!
        </p>
      </div>

      <form className="mt-16 max-w-3xl mx-auto" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Mohamed"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="panda mad scientist mixing sparkling chemicals, digital art"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative bg-gray-50 border border-gray-300 rounded-lg overflow-hidden w-full h-80 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-3/4 h-3/4 object-contain opacity-50"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full  px-5 py-2.5 text-center "
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-gray-500 text-lg text-center">
            Once you have created the image you want, you can share it with the
            community
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-md text-sm w-full  px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
