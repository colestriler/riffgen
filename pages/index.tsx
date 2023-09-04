import React, {useEffect, useRef} from 'react';
import {NextPage} from "next";
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SquigglyLines from "../components/SquigglyLines";
import {Testimonials} from "../components/Testimonials";
import AudioWaveform from "../components/AudioWaveForm";
import {USER_COUNT, USER_COUNT_STR} from "../lib/config";



const Home: NextPage = () => {

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Generate Custom Riffs using AI</title>
      </Head>
      <Header/>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-28 mt-20">
        <a
          href="https://twitter.com/nutlope/status/1626074563481051136"
          target="_blank"
          rel="noreferrer"
          className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out"
        >
          Used by over <span className="font-semibold">{USER_COUNT_STR}</span> happy
          users
        </a>
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
          Generate custom riffs{" "}
          <span className="relative whitespace-nowrap text-green-600">
            <SquigglyLines/>
            <span className="relative">using AI</span>
          </span>{" "}
          in seconds.
        </h1>
        <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">
          The world of AI has arrived for music. Generate custom riffs in seconds, powered by the latest AI models and 100% free.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            className="bg-white rounded-xl text-black font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-gray-100 border"
            href="https://youtu.be/FRQtFDDrUXQ"
            target="_blank"
            rel="noreferrer"
          >
            Learn how it's built
          </a>
          <Link
            className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
            href="/restore"
          >
            Generate a riff
          </Link>
        </div>
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-10 mt-4 mb-16">
            <div className="flex sm:space-x-2 sm:flex-row flex-col">
              <div className="flex flex-col items-center justify-center">
                <AudioWaveform audioUrl="https://replicate.delivery/pbxt/ujBiqf0LDwWmBiIcz51X1CgbyX5RGR0B6ZbGJenTXcUrezAjA/out.wav" />
                <p className="leading-7 mx-auto mt-1 max-w-xl p-5 rounded-lg text-xl text-gray-700 font-thin"><span className="font-bold mr-2">Prompt:</span>Edo25 major g melodies that sound triumphant and cinematic. Leading up to a crescendo that resolves
                    in a 9th harmonic.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Testimonials/>
      <Footer/>
    </div>
  );
};

export default Home;
