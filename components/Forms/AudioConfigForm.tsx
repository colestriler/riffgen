export {};


// import {FC, useState} from "react";
// import * as Yup from "yup";
// import {useFormik} from "formik";
// import {UploadDropzone} from "react-uploader";
// import {Uploader, UploadWidgetConfig} from "uploader";
// import {useSession} from "next-auth/react";
// import useSWR from "swr";
// import LoadingDots from "../LoadingDots";
//
// export type AudioConfigValues = {
//   model_version: 'melody' | 'large' | 'encode-decode';
//   prompt: string;
//   continuation: boolean;
//   continuation_start: number;
//   continuation_end: number;
//   normalization_strategy: 'peak' | 'loudness' | 'clip' | 'rms';
//   duration: number;
//   top_k: number;
//   top_p: number;
//   temperature: number;
//   classifier_free_guidance: number;
//   output_format: 'wav' | 'mp3',
// }
//
// // Configuration for the uploader
// const uploader = Uploader({
//   apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
//     ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
//     : "free",
// });
//
// const AudioConfigForm: FC<{
//   // State
//   loading: boolean;
//   newAudio: string | null;
//   // State Actions
//   setAudioName: (name: string | null) => void;
//   setError: any;
//   setNewAudio: (audio: string | null) => void;
//   setLoading: (loaded: boolean) => void;
// }> = ({
//         loading,
//         newAudio,
//         setAudioName,
//         setError,
//         setNewAudio,
//         setLoading,
//       }) => {
//   const [originalAudio, setOriginalAudio] = useState<string | null>(null);
//   const [endpointUrl, setEndpointUrl] = useState<string | null>(null);
//   const [showAdvanced, setShowAdvanced] = useState(false);
//
//   const fetcher = (url: string) => fetch(url).then((res) => res.json());
//   const {data, mutate} = useSWR("/api/remaining", fetcher);
//   const {data: session, status} = useSession();
//
//   const toggleAdvanced = () => {
//     setShowAdvanced(!showAdvanced);
//   };
//
//   const options: UploadWidgetConfig = {
//     maxFileCount: 1,
//     styles: {colors: {primary: "#000"}},
//     onValidate: async (file: File): Promise<undefined | string> => {
//       if (data.remainingGenerations === 0) {
//         return "No more generations left for the day.";
//       }
//       return undefined;
//     },
//   };
//
//
//
//   return (
//
//     <form className="w-full space-y-4">
//       {/* Prompt */}
//       <div>
//         <label htmlFor="prompt" className="block text-left text-sm font-medium text-gray-600">Prompt</label>
//         <textarea id="prompt" name="prompt" rows={4} className="mt-1 p-2 w-full rounded-md border"
//                   placeholder="Edo25 major g melodies that sound triumphant and cinematic. Leading up to a crescendo that resolves in a 9th harmonic"
//                   value={formik.values.prompt} onChange={formik.handleChange}></textarea>
//       </div>
//       {/* Input Audio */}
//       <div>
//         <label htmlFor="input_audio" className="block text-left text-sm font-medium text-gray-600">Input
//           Audio</label>
//         <UploadDropZone/>
//         {/*<input type="file" id="input_audio" name="input_audio" className="mt-1 p-2 w-full rounded-md border"/>*/}
//       </div>
//       {originalAudio && !newAudio && (
//         <div className="flex justify-center">
//           <audio
//             controls
//             src={originalAudio}
//           >
//             Your browser does not support the
//             <code>audio</code> element.
//           </audio>
//         </div>
//
//       )}
//
//       <div className="w-full text-left">
//         <button type="button" onClick={toggleAdvanced} className="text-blue-500 flex items-center">
//         <span className="ml-2">
//           {!showAdvanced ? `Show advanced options` : "Hide advanced options"}
//         </span>
//           <svg
//             className={`transition-transform duration-300 ease-in-out transform ${showAdvanced ? 'rotate-180' : ''}`}
//             width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M8.293 9.293L12 13L15.7071 9.293L16.4142 10L12 14.4142L7.58579 10L8.293 9.293Z"
//                   fill="#1E40AF"/>
//           </svg>
//
//         </button>
//       </div>
//       {showAdvanced && (
//         <div
//           className="space-y-4 p-8 md:p-10 md:pl-12 bg-gradient-to-r from-indigo-300/10 from-10% via-purple-200/10 via-30% to-indigo-400/10 to-90% rounded-lg border-[0.75px] border-slate-200">
//           <p className="text-center text-lg font-bold">Advanced Configuration</p>
//           {/* Model Version */}
//           <div>
//             <label htmlFor="model_version" className="block text-left text-sm font-medium text-gray-600">Model
//               Version</label>
//             <select id="model_version" name="model_version" className="mt-1 p-2 w-full rounded-md border">
//               <option value="melody">Melody</option>
//               <option value="large">Large</option>
//               <option value="encode-decode">Encode-Decode</option>
//             </select>
//           </div>
//           {/* Duration */}
//           <div>
//             <label htmlFor="duration" className="block text-left text-sm font-medium text-gray-600">Duration
//               (max 30 secs)</label>
//             <input type="number" min="1" max="30" id="duration" name="duration"
//                    className="mt-1 p-2 w-full rounded-md border" value={formik.values.duration} onChange={formik.handleChange}/>
//           </div>
//           {/*{formik.errors.duration && formik.touched.duration ? (<p className="text-red">Duration must be between 1 and 30 seconds</p>) : (null)}*/}
//
//           {/* Continuation */}
//           <div className="flex items-start gap-3">
//             <input type="checkbox" id="continuation" name="continuation" className="mt-1"/>
//             <label htmlFor="continuation"
//                    className="text-sm text-left font-medium text-gray-600">Continuation</label>
//           </div>
//
//           <div className="flex flex-col md:flex-row mx-auto gap-5">
//             {/* Continuation Start */}
//             <div className="w-full">
//               <label htmlFor="continuation_start"
//                      className="block text-left text-sm font-medium text-gray-600">Continuation
//                 Start</label>
//               <input type="number" id="continuation_start" name="continuation_start"
//                      className="mt-1 p-2 w-full rounded-md border" value={formik.values.continuation_start} onChange={formik.handleChange}/>
//             </div>
//             {/* Continuation End */}
//             <div className="w-full">
//               <label htmlFor="continuation_end" className="block text-left text-sm font-medium text-gray-600">Continuation
//                 End</label>
//               <input type="number" id="continuation_end" name="continuation_end"
//                      className="mt-1 p-2 w-full rounded-md border" value={formik.values.continuation_end} onChange={formik.handleChange}/>
//             </div>
//           </div>
//
//           {/* Normalization Strategy */}
//           <div>
//             <label htmlFor="normalization_strategy"
//                    className="block text-left text-sm font-medium text-gray-600">Normalization
//               Strategy</label>
//             <select id="normalization_strategy" name="normalization_strategy"
//                     className="mt-1 p-2 w-full rounded-md border"
//                     value={formik.values.normalization_strategy} onChange={formik.handleChange}>
//               <option value="loudness">Loudness</option>
//               <option value="clip">Clip</option>
//               <option value="peak">Peak</option>
//               <option value="rms">RMS</option>
//             </select>
//           </div>
//           {/* Top K */}
//           <div>
//             <label htmlFor="top_k" className="block text-left text-sm font-medium text-gray-600">Top K</label>
//             <input type="number" id="top_k" name="top_k" className="mt-1 p-2 w-full rounded-md border"
//                    value={formik.values.top_k} onChange={formik.handleChange}/>
//           </div>
//           {/* Top P */}
//           <div>
//             <label htmlFor="top_p" className="block text-left text-sm font-medium text-gray-600">Top P</label>
//             <input type="number" id="top_p" name="top_p" className="mt-1 p-2 w-full rounded-md border"
//                    value={formik.values.top_p} onChange={formik.handleChange}/>
//           </div>
//           {/* Temperature */}
//           <div>
//             <label htmlFor="temperature"
//                    className="block text-left text-sm font-medium text-gray-600">Temperature</label>
//             <input type="number" id="temperature" name="temperature"
//                    className="mt-1 p-2 w-full rounded-md border" value={formik.values.temperature} onChange={formik.handleChange}/>
//           </div>
//           {/* Classifier Free Guidance */}
//           <div>
//             <label htmlFor="classifier_free_guidance"
//                    className="block text-left text-sm font-medium text-gray-600">Classifier
//               Free Guidance</label>
//             <input type="number" id="classifier_free_guidance" name="classifier_free_guidance"
//                    className="mt-1 p-2 w-full rounded-md border"
//                    value={formik.values.classifier_free_guidance} onChange={formik.handleChange}/>
//           </div>
//           {/* Output Format */}
//           <div>
//             <label htmlFor="output_format" className="block text-left text-sm font-medium text-gray-600">Output
//               Format</label>
//             <select id="output_format" name="output_format" className="mt-1 p-2 w-full rounded-md border"
//                     value={formik.values.output_format} onChange={formik.handleChange}>
//               <option value="mp3">MP3</option>
//               <option value="wav">WAV</option>
//             </select>
//           </div>
//         </div>
//       )}
//
//       <button disabled={loading} type="submit"
//               className="button-style text-lg w-full bg-black rounded-lg py-5 px-5 text-white">
//         {loading ? <span className="pt-4">
//                 <LoadingDots color="white" style="large"/>
//               </span> : "Generate riff"}
//       </button>
//     </form>
//   );
// };
//
// export default AudioConfigForm;
//
//
// @ts-ignore