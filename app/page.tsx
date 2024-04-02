"use client";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { useRef, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DescriptionComponent } from "./components/DescriptionComponent";

export default function Home() {
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(
    `
    Are you interested in running Strapi.js on AWS EC2 but not sure where to start? Look no further! In this tutorial, we will guide you through the process step by step, making it easy for you to set up and start using Strapi.js on AWS EC2.

In this tech-savvy video, we will be focusing on using Node.js and Hindi language to help you understand the process better. By the end of this tutorial, you will have a clear understanding of how to run Strapi.js on AWS EC2 and be able to use it effectively in your projects.

Don't forget to hit the subscribe button to stay updated with our latest tech tutorials. If you found this video helpful, give it a thumbs up and feel free to leave a comment if you have any questions or suggestions for future videos.

For more tech tutorials and resources, visit our website [insert link to website]. Get ready to elevate your tech skills and take your projects to the next level with Strapi.js on AWS EC2!

Target Audience: This video is perfect for tech enthusiasts, developers, and anyone looking to enhance their knowledge of running Strapi.js on AWS EC2 using Node.js in Hindi language. Whether you are a beginner or an experienced user, this tutorial will provide you with valuable insights and tips.
    `
  );

  const outputComponent = useRef<HTMLDivElement>(null);

  const form = useFormik({
    initialValues: {
      title: "",
      keywords: [],
      description: "",
    },
    onSubmit: () => {},
  });

  return (
    <div className="bg-slate-800 min-h-[100vh] py-20">
      <div className="page text-white">
        <h1 className="text-3xl mb-10 underline">Youtube Description GenX</h1>

        <div className="mb-10">
          <input
            type="text"
            id="title"
            className="bg-inherit rounded-2xl px-4 py-2 border border-white w-full text-xl"
            placeholder="enter video title here*"
            value={form.values.title}
            onChange={form.handleChange}
          />
        </div>

        <div className="mb-10">
          <label htmlFor="keywords">add upto 5 target keywords</label>

          <FormikProvider value={form}>
            <FieldArray
              name="keywords"
              render={(arrayHelpers) => {
                return (
                  <div
                    className={`${form.values.keywords.length ? "mt-3" : ""}`}
                  >
                    <div className="flex gap-5 flex-wrap">
                      {form.values.keywords.map((keyword: string, index) => {
                        return (
                          <div
                            key={keyword}
                            className="text-lg border px-5 py-2 rounded-2xl flex justify-center items-center gap-2"
                          >
                            <p>{keyword}</p>
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                arrayHelpers.remove(index);
                              }}
                            >
                              <CloseIcon />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {form.values.keywords.length < 5 ? (
                      <div className="mt-5 rounded-2xl px-4 py-2 border border-white text-xl w-fit">
                        <input
                          type="text"
                          className="bg-inherit outline-none"
                          placeholder="add keyword"
                          value={keywordInput}
                          onChange={({ target }) => {
                            setKeywordInput(target.value || "");
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && keywordInput.length) {
                              arrayHelpers.insert(
                                form.values.keywords.length,
                                keywordInput
                              );
                              setKeywordInput("");
                            }
                          }}
                        />
                        <div
                          className="inline-block"
                          onClick={() => {
                            if (keywordInput.length) {
                              arrayHelpers.insert(
                                form.values.keywords.length,
                                keywordInput
                              );
                              setKeywordInput("");
                            }
                          }}
                        >
                          <AddIcon className="cursor-pointer" />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              }}
            ></FieldArray>
          </FormikProvider>
        </div>

        <div className="mb-10">
          <label htmlFor="keywords">{`provide video descriptions (optional)`}</label>
          <textarea
            id="description"
            value={form.values.description}
            onChange={form.handleChange}
            className="block w-full h-56 bg-inherit rounded-2xl px-4 py-2 border border-white text-xl mt-2.5"
            placeholder="describe little bit about your video"
          />
        </div>

        <div className="">
          {loading ? (
            <CircularProgress color="inherit" />
          ) : (
            <button
              className="border border-white py-2 px-10 rounded-2xl text-xl focus:rounded-xl hover:rounded-xl"
              onClick={() => {
                if (form.values.title && form.values.keywords.length) {
                  setLoading(true);
                  axios
                    .post(`/api/generate`, form.values)
                    .then(({ data }) => {
                      outputComponent.current?.scrollIntoView();
                      setGeneratedText(data);
                    })
                    .catch((err) => {
                      alert("something went wrong!");
                      console.error(err);
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                } else {
                  alert("please enter details!");
                }
              }}
            >
              Generate
            </button>
          )}{" "}
        </div>

        <div ref={outputComponent}>
          {generatedText ? (
            <div>
              <DescriptionComponent description={generatedText} />
              <div className="flex justify-end p-3">
                <IconButton
                  color="inherit"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedText);
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
