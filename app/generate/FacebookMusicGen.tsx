'use client';

import {createClientComponentClient, Session} from '@supabase/auth-helpers-nextjs'
import * as Yup from 'yup';
import {useState} from "react";
import useSWR from "swr";
import {Uploader, UploadWidgetConfig} from "uploader";
import {UploadDropzone} from "react-uploader";
import {useFormik} from "formik";
import toast from "react-hot-toast";
import {USER_COUNT_STR} from "@/lib/config";
import LoadingDots from "@/app/(components)/LoadingDots";
import {Rings} from "react-loader-spinner";
import FormLabel from "@/app/(components)/FormLabel";
import AudioWaveform from "@/app/(components)/AudioWaveForm";
import downloadFile from "@/utils/downloadFile";
import appendNewToName from "@/utils/appendNewToName";
import {User} from "@supabase/supabase-js";
import LoginButton from "@/app/(components)/LoginButton";

export type AudioConfigValues = {
  model_version: 'melody' | 'large' | 'encode-decode';
  prompt: string;
  continuation: boolean;
  continuation_start: number;
  continuation_end: number;
  normalization_strategy: 'peak' | 'loudness' | 'clip' | 'rms';
  duration: number;
  top_k: number;
  top_p: number;
  temperature: number;
  classifier_free_guidance: number;
  output_format: 'wav' | 'mp3',
}

// Configuration for the uploader
const uploader = Uploader({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
});

export default function FacebookMusicGen({session, user}: { session: any, user: User | null }) {
  const [originalAudio, setOriginalAudio] = useState<string | null>(null);
  const [newAudio, setNewAudio] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [endpointUrl, setEndpointUrl] = useState<string | null>(null);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data, mutate} = useSWR("/api/remaining", fetcher);


  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const options: UploadWidgetConfig = {
    maxFileCount: 1,
    styles: {colors: {primary: "#000"}},
    onValidate: async (file: File): Promise<undefined | string> => {
      if (data.remainingGenerations === 0) {
        return "No more generations left for the day.";
      }
      return undefined;
    },
  };

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          console.log(file);
          console.log('FILE URL', file[0].fileUrl);
          const fileType = file[0].fileUrl.slice(-3);
          console.log('FILE TYPE', fileType);
          setAudioName(file[0].originalFile.originalFileName);
          setOriginalAudio(file[0].fileUrl.replace("raw", "audio") + `!f=${fileType}&a=/audio.${fileType}`);
        }
      }}
      width="100%"
      height="225px"
    />
  );

  const formik = useFormik({
    initialValues: {
      model_version: 'melody',
      prompt: '',
      continuation: false,
      continuation_start: 7,
      continuation_end: 9,
      normalization_strategy: 'peak',
      duration: 15,
      top_k: 250,
      top_p: 0,
      temperature: 1,
      classifier_free_guidance: 3,
      output_format: 'wav',
    } as AudioConfigValues,
    validationSchema: Yup.object({
      model_version: Yup.string().required('Required'),
      prompt: Yup.string().required('Required'),
      continuation_start: Yup.number().required('Required'),
      continuation_end: Yup.number().required('Required'),
      normalization_strategy: Yup.string().required('Required'),
      duration: Yup.number().min(8).max(30).required('Required'),
      top_k: Yup.number().required('Required'),
      top_p: Yup.number().required('Required'),
      temperature: Yup.number().required('Required'),
      classifier_free_guidance: Yup.number().required('Required'),
      output_format: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      const endpointUrl = await generateAudio({values, ...{duration: values.duration * 1000}});

      if (originalAudio) {
        values.model_version = "melody";
      }

      // GET request to get the status of the image restoration process & return the result when it's ready
      let generatedAudio: string | null = null;
      while (!generatedAudio && endpointUrl) {
        // Loop in 1s intervals until the alt text is ready
        console.log("polling for result...");
        const res = await fetch("/api/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({endpointUrl}),
        });

        let jsonFinalResponse = await res.json();
        console.log('FINAL JSON RESPONSE', jsonFinalResponse);

        if (jsonFinalResponse.status === "succeeded") {
          generatedAudio = jsonFinalResponse.generatedAudio;
        } else if (jsonFinalResponse.status === "failed") {
          setError(jsonFinalResponse.generatedAudio);
          toast.error(jsonFinalResponse.generatedAudio);
          break;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      mutate();
      setNewAudio(generatedAudio);
      setLoading(false);

    }
  })


  async function generateAudio(values: any) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({audioUrl: originalAudio, ...values}),
    });

    const _endpointUrl = await res.json();

    if (res.status !== 200) {
      setError(_endpointUrl);
      setLoading(false)
    } else {
      mutate();
      return _endpointUrl;  // Return the endpointUrl
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {user && (
        <div className="mx-auto border rounded-2xl bg-pink-50/5">
          {/*<p className="text-center text-xs text-slate-500 mb-1">Model name</p>*/}
          <a
            href="https://replicate.com/facebookresearch/musicgen"
            target="_blank"
            rel="noreferrer"
            className="text-pink-300 hover:text-pink-200  w-fit py-1 px-4 text-sm mb-5  transition duration-300 ease-in-out"
          >
            facebookresearch/<strong>musicgen</strong>
          </a>
        </div>
      )}
      <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal sm:text-6xl mb-5">
        {loading ? <span className="pt-4">
            <>Generating riff</><LoadingDots color="black" style="large"/></span> : "Create your riff."}
      </h1>
      {user ? (
        <>
          {data && (
            <p className="text-sm text-mono text-slate-400">
              You have{" "}
              <span className="font-semibold">
              {data.remainingGenerations} generations
            </span>{" "}
              left today. Your generation
              {Number(data.remainingGenerations) > 1 ? "s" : ""} will renew in{" "}
              <span className="font-semibold">
              {data.hours} hours and {data.minutes} minutes.
            </span>
            </p>
          )}
          <div className="flex justify-between items-center w-full flex-col mt-4">
            {loading ? (
              <div className="flex flex-col gap-5 max-w-[670px] h-[250px] justify-center items-center">
                <Rings
                  height="100"
                  width="100"
                  color="white"
                  radius="6"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="rings-loading"
                />
                <div className="flex flex-col text-center">
                  <p className="text-slate-400 text-mono text-sm">Usually takes ~60 secs</p>
                  <p className="text-slate-500 text-mono text-xs">Do not leave or refresh this page!</p>
                </div>
              </div>
            ) : (
              <>
                {(newAudio && !sideBySide) ? (
                  <div className="flex sm:space-x-4 sm:flex-row flex-col w-full md:gap-10">
                    {originalAudio && (
                      <div className="w-full">
                        <h2 className="mb-1 font-medium text-lg">Original Audio</h2>
                        <AudioWaveform audioUrl={originalAudio}/>
                      </div>
                    )}
                    <div className="sm:mt-0 mt-8 w-full">
                      <h2 className="mb-1 font-medium text-lg">Generated Audio</h2>
                      <a href={newAudio} target="_blank" rel="noreferrer">
                        <AudioWaveform audioUrl={newAudio} onLoadedData={() => setRestoredLoaded(true)}/>
                        {/*<audio*/}
                        {/*  controls*/}
                        {/*  src={newAudio}*/}
                        {/*  onLoadedData={() => setRestoredLoaded(true)}*/}
                        {/*>*/}
                        {/*  Your browser does not support the*/}
                        {/*  <code>audio</code> element.*/}
                        {/*</audio>*/}
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <form onSubmit={formik.handleSubmit} onChange={formik.handleChange} className="w-full space-y-4">
                      {/* Prompt */}
                      <div>
                        <FormLabel title="Prompt" subtitle="A description of the music you want to generate."/>
                        <textarea id="prompt" name="prompt" rows={4}
                                  className="mt-1 p-2 bg-background w-full rounded-md border-2 focus:border-purple-200"
                                  placeholder="Edo25 major g melodies that sound triumphant and cinematic. Leading up to a crescendo that resolves in a 9th harmonic"
                                  value={formik.values.prompt} onChange={formik.handleChange}
                                  disabled={loading}></textarea>
                      </div>
                      {/* Input Audio */}
                      <div className="w-full text-left text-sm font-mono">
                        <button type="button" onClick={toggleAdvanced} className="text-white flex items-center">
                <span className="ml-2">
                  {!showAdvanced ? `Show advanced options` : "Hide advanced options"}
                </span>
                          <svg
                            className={`transition-transform duration-300 ease-in-out transform ${showAdvanced ? 'rotate-180' : ''}`}
                            width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.293 9.293L12 13L15.7071 9.293L16.4142 10L12 14.4142L7.58579 10L8.293 9.293Z"
                                  fill="#FAFAFA"/>
                          </svg>
                        </button>
                      </div>
                      {showAdvanced && (
                        <div
                          className="space-y-4 p-8 md:p-10 md:pl-12 bg-gradient-to-r from-indigo-600/10 from-10% via-purple-400/10 via-30% to-indigo-600/10 to-90% rounded-lg border-[0.75px] border-slate-200">
                          <p className="text-center text-lg font-bold">Advanced Configuration</p>
                          <div>
                            <FormLabel title="Input Audio"
                                       subtitle="An audio file that will influence the generated music. If `continuation` is `True`, the generated music will be a continuation of the audio file. Otherwise, the generated music will mimic the audio file's melody."/>

                            {!originalAudio && (
                              <UploadDropZone/>
                            )}
                            {originalAudio && !newAudio && (
                              <div className="mt-5">
                                <h2 className="mb-1 font-medium text-lg">Uploaded Audio</h2>
                                <div className="flex justify-center">
                                  <AudioWaveform audioUrl={originalAudio}/>

                                  {/*<audio*/}
                                  {/*  controls*/}
                                  {/*  src={originalAudio}*/}
                                  {/*>*/}
                                  {/*  Your browser does not support the*/}
                                  {/*  <code>audio</code> element.*/}
                                  {/*</audio>*/}
                                </div>
                                <button disabled={loading} type="button"
                                        className="text-blue-500 hover:text-blue-400 mt-2 text-sm"
                                        onClick={() => setOriginalAudio(null)}>Reset upload
                                </button>
                              </div>
                            )}
                            {/*<input type="file" id="input_audio" name="input_audio" className="mt-1 p-2 w-full rounded-md border"/>*/}
                          </div>
                          {/* Model Version */}
                          <div>
                            <FormLabel title="Model Version"
                                       subtitle="Model to use for generation. If set to 'encode-decode', the audio specified via 'input_audio' will simply be encoded and then decoded."/>
                            <select id="model_version" name="model_version"
                                    className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                    value={formik.values.model_version} disabled={loading}>
                              <option value="melody">Melody</option>
                              <option value="large">Large</option>
                              <option value="encode-decode">Encode-Decode</option>
                            </select>
                          </div>
                          {/* Duration */}
                          <div>
                            <FormLabel title="Duration"
                                       subtitle="Duration of the generated audio in seconds. (maximum: 30)"/>
                            <input type="number" min="1" max="30" id="duration" name="duration"
                                   className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                   value={formik.values.duration}
                                   onChange={formik.handleChange} disabled={loading}/>
                          </div>
                          {/*{formik.errors.duration && formik.touched.duration ? (<p className="text-red">Duration must be between 1 and 30 seconds</p>) : (null)}*/}

                          {/* Continuation */}
                          <div className="flex items-start gap-3">
                            <input type="checkbox" id="continuation" name="continuation"
                                   className="mt-1 bg-transparent"/>
                            <FormLabel title="Continuation"
                                       subtitle="If `True`, generated music will continue `melody`. Otherwise, generated music will mimic `audio_input`'s melody."/>
                          </div>

                          <div className="flex flex-col md:flex-row mx-auto gap-5">
                            {/* Continuation Start */}
                            <div className="w-full">
                              <FormLabel title="Continuation Start"
                                         subtitle="Start time of the audio file to use for continuation."/>
                              <input type="number" id="continuation_start" name="continuation_start"
                                     className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                     value={formik.values.continuation_start}
                                     onChange={formik.handleChange} disabled={loading}/>
                            </div>
                            {/* Continuation End */}
                            <div className="w-full">
                              <FormLabel title="Continuation End"
                                         subtitle="End time of the audio file to use for continuation."/>
                              <input type="number" id="continuation_end" name="continuation_end"
                                     className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                     value={formik.values.continuation_end}
                                     onChange={formik.handleChange} disabled={loading}/>
                            </div>
                          </div>

                          {/* Normalization Strategy */}
                          <div>
                            <FormLabel title="Normalization Strategy" subtitle="Strategy for normalizing audio."/>
                            <select id="normalization_strategy" name="normalization_strategy"
                                    className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                    value={formik.values.normalization_strategy} onChange={formik.handleChange}
                                    disabled={loading}>
                              <option value="loudness">Loudness</option>
                              <option value="clip">Clip</option>
                              <option value="peak">Peak</option>
                              <option value="rms">RMS</option>
                            </select>
                          </div>
                          {/* Top K */}
                          <div>
                            <FormLabel title="Top K"
                                       subtitle="Reduces sampling to tokens with cumulative probability of p. When set to `0` (default), top_k sampling is used."/>
                            <input type="number" id="top_k" name="top_k"
                                   className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                   value={formik.values.top_k} onChange={formik.handleChange} disabled={loading}/>
                          </div>
                          {/* Top P */}
                          <div>
                            <FormLabel title="Top P" subtitle="Reduces sampling to the k most likely tokens."/>
                            <input type="number" id="top_p" name="top_p"
                                   className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                   value={formik.values.top_p} onChange={formik.handleChange} disabled={loading}/>
                          </div>
                          {/* Temperature */}
                          <div>
                            <FormLabel title="Temperature"
                                       subtitle="Controls the 'conservativeness' of the sampling process. Higher temperature means more diversity."/>
                            <input type="number" id="temperature" name="temperature"
                                   className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                   value={formik.values.temperature}
                                   onChange={formik.handleChange} disabled={loading}/>
                          </div>
                          {/* Classifier Free Guidance */}
                          <div>
                            <FormLabel title="Classifier Free Guidance"
                                       subtitle="Increases the influence of inputs on the output. Higher values produce lower-varience outputs that adhere more closely to inputs."/>
                            <input type="number" id="classifier_free_guidance" name="classifier_free_guidance"
                                   className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                   value={formik.values.classifier_free_guidance} onChange={formik.handleChange}
                                   disabled={loading}/>
                          </div>
                          {/* Output Format */}
                          <div>
                            <FormLabel title="Output Format" subtitle="Output format for generated audio."/>
                            <select id="output_format" name="output_format"
                                    className="mt-1 p-2 w-full rounded-md border bg-transparent"
                                    value={formik.values.output_format} onChange={formik.handleChange}
                                    disabled={loading}>
                              <option value="mp3">MP3</option>
                              <option value="wav">WAV</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <button disabled={loading} type="submit"
                              className="bg-foreground w-full py-3 px-6 rounded-lg font-mono text-sm text-background cursor-pointer hover:opacity-90">
                        {loading ? <span className="pt-4">
                <LoadingDots color="white" style="large"/>
              </span> : "Generate riff"}
                      </button>
                    </form>
                  </>
                )}
              </>


            )}

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8 max-w-[575px]"
                role="alert"
              >
                <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                  Please try again in 24 hours
                </div>
                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  {error}
                </div>
              </div>
            )}
            <div className="flex space-x-2 justify-center">
              {restoredLoaded && (
                <>
                  <button
                    onClick={() => {
                      setOriginalAudio(null);
                      setNewAudio(null);
                      setRestoredLoaded(false);
                      setError(null);
                      setEndpointUrl(null);
                      setAudioName(null);
                      formik.resetForm();
                    }}
                    className="bg-white rounded-full text-black font-medium px-4 py-2 mt-8 hover:bg-white/80 transition"
                  >
                    Generate a New Riff
                  </button>
                  <button
                    onClick={() => {
                      downloadFile(newAudio!, appendNewToName(audioName!, formik.values.output_format));
                    }}
                    className="bg-black border rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-gray-900/80 transition"
                  >
                    Download Generated Riff
                  </button>
                </>
              )}
            </div>
          </div>
        </>

      ) : (
        <div className="flex flex-col gap-10 justify-center items-center h-full ">
          <p className="text-mono text-slate-400 text-center mx-auto max-w-lg">Sign in below with Google to create a
            free account and restore
            your photos today. You will be able to generate 5 riffs per day for free.</p>
          <LoginButton/>
        </div>

      )}
    </div>
  )
}
