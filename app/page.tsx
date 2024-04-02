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
  const [generatedText, setGeneratedText] = useState<string | null>(null);

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
                      setGeneratedText(data);
                      outputComponent.current?.scrollIntoView();
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
